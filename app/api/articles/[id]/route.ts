import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { parseObjectId } from "@/lib/object-id";
import { toArticle } from "@/lib/articles";
import { IArticleDocument } from "@/types/article";

// GET /api/articles/:id — одна статья по _id из MongoDB Atlas
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const articleId = parseObjectId(id);

  if (!articleId) {
    return NextResponse.json({ error: "Некорректный id статьи" }, { status: 400 });
  }

  try {
    const db = await getDb();
    const article = await db
      .collection<IArticleDocument>("articles")
      .findOne({ _id: articleId });

    if (!article) {
      return NextResponse.json({ error: "Статья не найдена" }, { status: 404 });
    }

    return NextResponse.json(toArticle(article));
  } catch (error) {
    console.error("Ошибка при получении статьи:", error);
    return NextResponse.json({ error: "Не удалось получить статью" }, { status: 500 });
  }
}
