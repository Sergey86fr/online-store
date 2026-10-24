import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/auth";
import { toProduct } from "@/lib/products";
import { parsePagination, toPaginatedResponse } from "@/lib/pagination";
import { IUserDocument } from "@/types/user";
import { IProductDocument } from "@/types/product";

// GET /api/purchases — товары, которые текущий пользователь покупал раньше.
// Сначала купленные последними; если товар покупали несколько раз — он один, по последней покупке.
//   ?page=2&limit=20 — пагинация (на главной: ?limit=4)
// Ответ: { items, total, page, limit, totalPages }
// Ответ у каждого пользователя свой — НЕ кешируйте его на фронте (cache: "no-store")
export async function GET(request: NextRequest) {
  const pagination = parsePagination(request.nextUrl.searchParams);
  if (typeof pagination === "string") {
    return NextResponse.json({ error: pagination }, { status: 400 });
  }

  try {
    const userId = await getCurrentUserId();

    if (userId === null) {
      return NextResponse.json({ error: "Нужно войти в аккаунт" }, { status: 401 });
    }

    const db = await getDb();

    // 1. Берём у пользователя только массив покупок
    const user = await db
      .collection<IUserDocument>("users")
      .findOne({ _id: userId }, { projection: { _id: 0, purchases: 1 } });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    // Покупок нет (или поля purchases нет вовсе) — сразу отдаём пустой список, без запроса к базе
    if (!user.purchases || user.purchases.length === 0) {
      return NextResponse.json(toPaginatedResponse([], 0, pagination));
    }

    // 2. Сортируем покупки от новых к старым и убираем повторы одного и того же товара
    const sortedPurchases = [...user.purchases].sort((a, b) => b.date.getTime() - a.date.getTime());
    const uniqueProductIds = sortedPurchases
      .map((p) => p.productId)
      .filter((id, index, ids) => ids.findIndex((other) => other.equals(id)) === index);

    // 3. Берём только нужную страницу и одним запросом находим эти товары
    const pageProductIds = uniqueProductIds.slice(pagination.skip, pagination.skip + pagination.limit);
    const products = await db
      .collection<IProductDocument>("products")
      .find({ _id: { $in: pageProductIds } })
      .toArray();

    // $in не сохраняет порядок, поэтому выстраиваем товары как в покупках.
    // ObjectId — это объекты, их сравнивают через .equals(), а не ===
    const purchasedProducts = pageProductIds
      .map((id) => products.find((p) => p._id.equals(id)))
      .filter((p) => p !== undefined)
      .map(toProduct);

    return NextResponse.json(
      toPaginatedResponse(purchasedProducts, uniqueProductIds.length, pagination)
    );
  } catch (error) {
    console.error("Ошибка при получении покупок:", error);
    return NextResponse.json({ error: "Не удалось получить покупки" }, { status: 500 });
  }
}
