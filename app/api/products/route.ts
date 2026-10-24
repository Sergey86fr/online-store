import { NextRequest, NextResponse } from "next/server";
import { Filter, Sort } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getNewProductsSince, isProductCategory, toProduct } from "@/lib/products";
import { parsePagination, toPaginatedResponse } from "@/lib/pagination";
import { parsePrice, PRODUCT_PRICE_EXPR } from "@/lib/product-filters";
import { IProductDocument } from "@/types/product";

// GET /api/products — товары с фильтрами через query-параметры:
//   ?category=dairy — только товары категории (страница категории); неизвестная категория — 400
//   ?discount=true  — только товары со скидкой (Акции)
//   ?new=true       — только новинки: добавлены не раньше NEW_PRODUCT_DAYS дней назад (страница «Все новинки»)
//   ?inStock=true   — только товары в наличии (quantity > 0)
//   ?minPrice=100&maxPrice=500 — цена со скидкой акции в диапазоне (границы включительно)
//   ?sort=new     — сначала последние добавленные (секция «Новинки» на главной: ?sort=new&limit=4)
//   ?page=2&limit=20 — пагинация (limit по умолчанию 20, максимум 100)
// Параметры можно сочетать: /api/products?category=dairy&discount=true&page=1&limit=20
// Ответ: { items, total, page, limit, totalPages }
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const pagination = parsePagination(searchParams);
  if (typeof pagination === "string") {
    return NextResponse.json({ error: pagination }, { status: 400 });
  }

  const filter: Filter<IProductDocument> = {};

  const category = searchParams.get("category");
  if (category !== null) {
    if (!isProductCategory(category)) {
      return NextResponse.json({ error: `Неизвестная категория "${category}"` }, { status: 400 });
    }
    filter.category = category;
  }

  if (searchParams.get("discount") === "true") {
    filter.discountPercent = { $gt: 0 };
  }
  if (searchParams.get("new") === "true") {
    filter.createdAt = { $gte: getNewProductsSince() };
  }
  if (searchParams.get("inStock") === "true") {
    filter.quantity = { $gt: 0 };
  }

  // Цена со скидкой — вычисляемая, поэтому сравниваем через $expr
  const priceConditions = [];
  for (const [param, operator] of [["minPrice", "$gte"], ["maxPrice", "$lte"]] as const) {
    const raw = searchParams.get(param);
    if (raw === null) continue;
    const price = parsePrice(raw);
    if (price === undefined) {
      return NextResponse.json({ error: `${param} должен быть числом от 0` }, { status: 400 });
    }
    priceConditions.push({ [operator]: [PRODUCT_PRICE_EXPR, price] });
  }
  if (priceConditions.length > 0) {
    filter.$expr = { $and: priceConditions };
  }

  // Без сортировки MongoDB не гарантирует порядок, а пагинации нужен стабильный порядок.
  // _id в конце — на случай одинаковых дат или названий
  const sort: Sort =
    searchParams.get("sort") === "new" ? { createdAt: -1, _id: -1 } : { title: 1, _id: 1 };

  try {
    const db = await getDb();
    const collection = db.collection<IProductDocument>("products");

    // Оба запроса независимы, поэтому отправляем их одновременно
    const [products, total] = await Promise.all([
      collection.find(filter).sort(sort).skip(pagination.skip).limit(pagination.limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return NextResponse.json(toPaginatedResponse(products.map(toProduct), total, pagination));
  } catch (error) {
    console.error("Ошибка при получении товаров:", error);
    return NextResponse.json({ error: "Не удалось получить товары" }, { status: 500 });
  }
}
