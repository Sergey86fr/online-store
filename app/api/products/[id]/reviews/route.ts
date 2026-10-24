import { NextRequest, NextResponse } from "next/server";
import { ObjectId, MongoServerError } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/auth";
import { parseObjectId } from "@/lib/object-id";
import {
  REVIEW_MAX_LENGTH,
  REVIEW_MAX_RATING,
  REVIEW_MIN_RATING,
  toReview,
  toReviewsResponse,
} from "@/lib/reviews";
import { IProductDocument } from "@/types/product";
import { IReviewDocument } from "@/types/review";
import { IUserDocument } from "@/types/user";

type RouteContext = { params: Promise<{ id: string }> };

// Код ошибки MongoDB «нарушен уникальный индекс»
const DUPLICATE_KEY = 11000;

// GET /api/products/:id/reviews — отзывы о товаре, сначала новые, плюс сводка оценок
// Ответ: { items, total, average, distribution } (IReviewsResponse — types/review.ts)
export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const productId = parseObjectId(id);
  if (!productId) {
    return NextResponse.json({ error: "Некорректный id товара" }, { status: 400 });
  }

  try {
    const db = await getDb();
    // Индекс { productId, createdAt } — в миграции 20261011120000-reviews.js
    const reviews = await db
      .collection<IReviewDocument>("reviews")
      .find({ productId })
      .sort({ createdAt: -1, _id: -1 })
      .toArray();

    return NextResponse.json(toReviewsResponse(reviews));
  } catch (error) {
    console.error("Ошибка при получении отзывов:", error);
    return NextResponse.json({ error: "Не удалось получить отзывы" }, { status: 500 });
  }
}

// POST /api/products/:id/reviews — оставить отзыв. Тело: { "rating": 1…5, "text": "…" }
// Ответы:
//   201 IReview          — отзыв сохранён
//   400 { error }        — неверный id или тело
//   401 { error }        — не вошёл в аккаунт
//   404 { error }        — нет товара или пользователя
//   409 { error }        — этот пользователь уже оставлял отзыв об этом товаре
export async function POST(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const productId = parseObjectId(id);
  if (!productId) {
    return NextResponse.json({ error: "Некорректный id товара" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Тело запроса должно быть JSON" }, { status: 400 });
  }

  const { rating, text } = (body ?? {}) as { rating?: unknown; text?: unknown };
  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < REVIEW_MIN_RATING ||
    rating > REVIEW_MAX_RATING
  ) {
    return NextResponse.json(
      { error: `rating — целое число от ${REVIEW_MIN_RATING} до ${REVIEW_MAX_RATING}` },
      { status: 400 },
    );
  }
  const trimmedText = typeof text === "string" ? text.trim() : "";
  if (trimmedText.length === 0 || trimmedText.length > REVIEW_MAX_LENGTH) {
    return NextResponse.json(
      { error: `Текст отзыва — от 1 до ${REVIEW_MAX_LENGTH} символов` },
      { status: 400 },
    );
  }

  try {
    const userId = await getCurrentUserId();
    if (userId === null) {
      return NextResponse.json({ error: "Нужно войти в аккаунт" }, { status: 401 });
    }

    const db = await getDb();
    const [product, user] = await Promise.all([
      db.collection<IProductDocument>("products").findOne({ _id: productId }, { projection: { _id: 1 } }),
      db.collection<IUserDocument>("users").findOne({ _id: userId }, { projection: { userName: 1 } }),
    ]);
    if (!product) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
    }
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    // Имя копируем в отзыв: список отзывов показываем без похода в users
    const review: IReviewDocument = {
      _id: new ObjectId(),
      productId,
      userId,
      userName: user.userName,
      rating,
      text: trimmedText,
      createdAt: new Date(),
    };
    // Один отзыв на товар от пользователя держит уникальный индекс { productId, userId } (миграция):
    // проверка «уже есть?» отдельным запросом пропустила бы два одновременных POST
    await db.collection<IReviewDocument>("reviews").insertOne(review);

    return NextResponse.json(toReview(review), { status: 201 });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === DUPLICATE_KEY) {
      return NextResponse.json({ error: "Вы уже оставили отзыв об этом товаре" }, { status: 409 });
    }
    console.error("Ошибка при сохранении отзыва:", error);
    return NextResponse.json({ error: "Не удалось сохранить отзыв" }, { status: 500 });
  }
}
