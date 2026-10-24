import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { toArticle } from "@/lib/articles";
import { parsePagination, toPaginatedResponse } from "@/lib/pagination";
import { IArticleDocument } from "@/types/article";

// GET /api/articles — статьи из MongoDB Atlas, сначала новые
//   ?page=2&limit=20 — пагинация (limit по умолчанию 20, максимум 100)
//   на главной: ?limit=3, на странице «Все статьи»: ?page=1&limit=20
// Ответ: { items, total, page, limit, totalPages }
export async function GET(request: NextRequest) {
  const pagination = parsePagination(request.nextUrl.searchParams);
  if (typeof pagination === "string") {
    return NextResponse.json({ error: pagination }, { status: 400 });
  }

  try {
    const db = await getDb();
    const collection = db.collection<IArticleDocument>("articles");

    // _id в конце — чтобы статьи с одинаковой датой не «прыгали» между страницами
    const [articles, total] = await Promise.all([
      collection
        .find()
        .sort({ createdAt: -1, _id: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .toArray(),
      collection.countDocuments(),
    ]);

    return NextResponse.json(toPaginatedResponse(articles.map(toArticle), total, pagination));
  } catch (error) {
    console.error("Ошибка при получении статей:", error);
    return NextResponse.json({ error: "Не удалось получить статьи" }, { status: 500 });
  }
}
