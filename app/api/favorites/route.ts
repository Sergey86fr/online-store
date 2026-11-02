import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/auth";
import { parsePagination, toPaginatedResponse } from "@/lib/pagination";
import { parseProductFilters } from "@/lib/product-query";
import { toProduct } from "@/lib/products";
import { findUserLists } from "@/lib/user-lists";
import { IProductDocument } from "@/types/product";

// GET /api/favorites — товары из избранного текущего пользователя (страница «Избранное»).
//   ?inStock=true, ?minPrice=100&maxPrice=500 — те же фильтры, что у /api/products
//   ?page=2&limit=20 — пагинация
//   ?offset=7&limit=6 — вместо page: «с 7-го товара». Нужно «Показать ещё» на странице «Избранное»:
//                       если там сняли сердечко, список на сервере сдвинулся и page=2 пропустил бы товары
// Ответ: { items: IProduct[], total, page, limit, totalPages }
// Ответ у каждого пользователя свой — НЕ кешируйте его на фронте (cache: "no-store")
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const pagination = parsePagination(searchParams);
  if (typeof pagination === "string") {
    return NextResponse.json({ error: pagination }, { status: 400 });
  }

  const filters = parseProductFilters(searchParams);
  if (typeof filters === "string") {
    return NextResponse.json({ error: filters }, { status: 400 });
  }

  const offsetParam = searchParams.get("offset");
  const offset = offsetParam === null ? null : Number(offsetParam);
  if (offset !== null && (!Number.isInteger(offset) || offset < 0)) {
    return NextResponse.json({ error: "offset должен быть целым числом от 0" }, { status: 400 });
  }
  const skip = offset ?? pagination.skip;

  try {
    const userId = await getCurrentUserId();
    if (userId === null) {
      return NextResponse.json({ error: "Нужно войти в аккаунт" }, { status: 401 });
    }

    const db = await getDb();
    const lists = await findUserLists(db, userId);
    if (lists === null) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    // Товар, удалённый из каталога, в $in просто не найдётся — в избранном его не покажем
    const filter = { ...filters, _id: { $in: lists.favorites } };
    const collection = db.collection<IProductDocument>("products");

    const [products, total] = await Promise.all([
      collection.find(filter).sort({ title: 1, _id: 1 }).skip(skip).limit(pagination.limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return NextResponse.json(toPaginatedResponse(products.map(toProduct), total, pagination));
  } catch (error) {
    console.error("Ошибка при получении избранного:", error);
    return NextResponse.json({ error: "Не удалось получить избранное" }, { status: 500 });
  }
}
