import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { parseObjectId } from "@/lib/object-id";
import { toProduct } from "@/lib/products";
import { IProductDocument } from "@/types/product";

// GET /api/products/:id — один товар (страница товара)
// Ответ: IProduct; 400 — id не похож на id MongoDB; 404 — товара нет
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseObjectId(id);

  if (!productId) {
    return NextResponse.json({ error: "Некорректный id товара" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const product = await db.collection<IProductDocument>("products").findOne({ _id: productId });

    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    return NextResponse.json(toProduct(product));
  } catch (error) {
    console.error("Ошибка при получении товара:", error);
    return NextResponse.json({ error: "Не удалось получить товар" }, { status: 500 });
  }
}
