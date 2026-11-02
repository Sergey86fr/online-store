import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/auth";
import { findPriceRange } from "@/lib/product-query";
import { findUserLists } from "@/lib/user-lists";

// GET /api/favorites/price-range — самая низкая и самая высокая цена среди товаров в избранном
// (границы ползунка «Цена»). Ответ: { min, max }, избранное пустое — { min: 0, max: 0 }
export async function GET() {
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

    return NextResponse.json(await findPriceRange(db, { _id: { $in: lists.favorites } }));
  } catch (error) {
    console.error("Ошибка при получении диапазона цен избранного:", error);
    return NextResponse.json({ error: "Не удалось получить диапазон цен" }, { status: 500 });
  }
}
