import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/auth";
import { findUserLists } from "@/lib/user-lists";

// GET /api/favorites/ids — только id товаров в избранном: чтобы закрасить сердечки на карточках.
// Ответ: { ids: string[] }
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (userId === null) {
      return NextResponse.json({ error: "Нужно войти в аккаунт" }, { status: 401 });
    }

    const lists = await findUserLists(await getDb(), userId);
    if (lists === null) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    return NextResponse.json({ ids: lists.favorites.map((id) => id.toString()) });
  } catch (error) {
    console.error("Ошибка при получении избранного:", error);
    return NextResponse.json({ error: "Не удалось получить избранное" }, { status: 500 });
  }
}
