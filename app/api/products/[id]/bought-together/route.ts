import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { parseObjectId } from "@/lib/object-id";
import { toProduct } from "@/lib/products";
import { IProductDocument } from "@/types/product";
import { IOrderDocument } from "@/types/order";

const DEFAULT_LIMIT = 4;
const MAX_LIMIT = 20;

// GET /api/products/:id/bought-together?limit=4 — блок «С этим товаром покупают»
// 1. Ищем заказы, где был этот товар, и считаем, какие ещё товары в них встречались чаще всего.
// 2. Если заказов мало и товаров не набралось — добираем самыми высоко оценёнными товарами
//    из других категорий (из той же категории уже есть блок «Похожие»).
// Ответ: { items: IProduct[] }
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseObjectId(id);
  if (!productId) {
    return NextResponse.json({ error: "Некорректный id товара" }, { status: 400 });
  }

  const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? DEFAULT_LIMIT);
  if (!Number.isInteger(limitParam) || limitParam < 1 || limitParam > MAX_LIMIT) {
    return NextResponse.json({ error: `limit — целое число от 1 до ${MAX_LIMIT}` }, { status: 400 });
  }

  try {
    const db = await getDb();
    const products = db.collection<IProductDocument>("products");

    const product = await products.findOne({ _id: productId }, { projection: { category: 1 } });
    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    // Товары из тех же заказов, самые частые — первыми
    const together = await db
      .collection<IOrderDocument>("orders")
      .aggregate<{ _id: ObjectId }>([
        { $match: { "items.productId": productId } },
        { $unwind: "$items" },
        { $match: { "items.productId": { $ne: productId } } },
        { $group: { _id: "$items.productId", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        { $limit: limitParam },
      ])
      .toArray();

    // $in возвращает товары в произвольном порядке — раскладываем обратно по частоте
    const ids = together.map(({ _id }) => _id);
    const found = await products.find({ _id: { $in: ids } }).toArray();
    const items = ids.flatMap((tid) => found.filter((p) => p._id.equals(tid)));

    if (items.length < limitParam) {
      const fillers = await products
        .find({ _id: { $nin: [productId, ...ids] }, category: { $ne: product.category } })
        .sort({ rating: -1, _id: 1 })
        .limit(limitParam - items.length)
        .toArray();
      items.push(...fillers);
    }

    return NextResponse.json({ items: items.map(toProduct) });
  } catch (error) {
    console.error("Ошибка при подборе товаров «С этим товаром покупают»:", error);
    return NextResponse.json({ error: "Не удалось подобрать товары" }, { status: 500 });
  }
}
