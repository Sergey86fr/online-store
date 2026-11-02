import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/auth";
import { parseObjectId } from "@/lib/object-id";
import { IProductDocument } from "@/types/product";
import { IUserDocument } from "@/types/user";

type RouteContext = { params: Promise<{ productId: string }> };

// PUT /api/favorites/:productId — добавить товар в избранное.
// PUT, а не POST: повторный запрос ничего не меняет ($addToSet не добавит дубль)
// Ответы: 204 — готово; 400 — неверный id; 401 — не вошёл; 404 — нет товара или пользователя
export async function PUT(_request: NextRequest, { params }: RouteContext) {
  const productId = parseObjectId((await params).productId);
  if (!productId) {
    return NextResponse.json({ error: "Некорректный id товара" }, { status: 400 });
  }

  try {
    const userId = await getCurrentUserId();
    if (userId === null) {
      return NextResponse.json({ error: "Нужно войти в аккаунт" }, { status: 401 });
    }

    const db = await getDb();
    const product = await db
      .collection<IProductDocument>("products")
      .findOne({ _id: productId }, { projection: { _id: 1 } });
    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }

    const result = await db
      .collection<IUserDocument>("users")
      .updateOne({ _id: userId }, { $addToSet: { favorites: productId } });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Ошибка при добавлении в избранное:", error);
    return NextResponse.json({ error: "Не удалось добавить в избранное" }, { status: 500 });
  }
}

// DELETE /api/favorites/:productId — убрать товар из избранного.
// Товара там не было — тоже 204: результат тот же, что и нужен
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const productId = parseObjectId((await params).productId);
  if (!productId) {
    return NextResponse.json({ error: "Некорректный id товара" }, { status: 400 });
  }

  try {
    const userId = await getCurrentUserId();
    if (userId === null) {
      return NextResponse.json({ error: "Нужно войти в аккаунт" }, { status: 401 });
    }

    const result = await (await getDb())
      .collection<IUserDocument>("users")
      .updateOne({ _id: userId }, { $pull: { favorites: productId } });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Ошибка при удалении из избранного:", error);
    return NextResponse.json({ error: "Не удалось убрать из избранного" }, { status: 500 });
  }
}
