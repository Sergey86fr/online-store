import { IReview, IReviewDocument, IReviewsResponse } from "@/types/review";

export const REVIEW_MIN_RATING = 1;
export const REVIEW_MAX_RATING = 5;
export const REVIEW_MAX_LENGTH = 2000;

// Документ из MongoDB -> отзыв для API: без productId/userId, дата строкой
export const toReview = ({ _id, userName, rating, text, createdAt }: IReviewDocument): IReview => ({
  id: _id.toString(),
  userName,
  rating,
  text,
  createdAt: createdAt.toISOString(),
});

// Сводка для блока «4 из 5» и столбика 5…1: средняя оценка и сколько отзывов с каждой оценкой
export const toReviewsResponse = (reviews: IReviewDocument[]): IReviewsResponse => {
  const distribution: IReviewsResponse["distribution"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const { rating } of reviews) {
    distribution[rating as keyof typeof distribution] += 1;
    sum += rating;
  }

  return {
    items: reviews.map(toReview),
    total: reviews.length,
    // Одна цифра после запятой: 4.333… -> 4.3
    average: reviews.length > 0 ? Math.round((sum / reviews.length) * 10) / 10 : 0,
    distribution,
  };
};

// «1 отзыв», «3 отзыва», «5 отзывов», «21 отзыв»
export const formatReviewsCount = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  const word =
    mod10 === 1 && mod100 !== 11
      ? "отзыв"
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? "отзыва"
        : "отзывов";
  return `${count} ${word}`;
};
