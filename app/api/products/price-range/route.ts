import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { isProductCategory } from "@/lib/products";
import { PRODUCT_PRICE_EXPR } from "@/lib/product-filters";
import { IProductDocument } from "@/types/product";

// GET /api/products/price-range?category=dairy — самая низкая и самая высокая цена в категории
// (цена со скидкой акции, как в фильтре ?minPrice&maxPrice). Нужна для границ ползунка «Цена».
// Ответ: { min, max } — целые рубли: min округлён вниз, max вверх, чтобы крайние товары попадали в диапазон.
// Товаров нет — { min: 0, max: 0 }
export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  if (category !== null && !isProductCategory(category)) {
    return NextResponse.json({ error: `Неизвестная категория "${category}"` }, { status: 400 });
  }

  try {
    const db = await getDb();
    const [range] = await db
      .collection<IProductDocument>("products")
      .aggregate<{ min: number; max: number }>([
        { $match: category === null ? {} : { category } },
        { $group: { _id: null, min: { $min: PRODUCT_PRICE_EXPR }, max: { $max: PRODUCT_PRICE_EXPR } } },
      ])
      .toArray();

    return NextResponse.json(
      range ? { min: Math.floor(range.min), max: Math.ceil(range.max) } : { min: 0, max: 0 },
    );
  } catch (error) {
    console.error("Ошибка при получении диапазона цен:", error);
    return NextResponse.json({ error: "Не удалось получить диапазон цен" }, { status: 500 });
  }
}
