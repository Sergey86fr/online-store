import type { ObjectId } from "mongodb";

// Отзыв в том виде, в каком его отдаёт API и получают компоненты
export interface IReview {
    id: string;
    userName: string;
    rating: number; // целое от 1 до 5
    text: string;
    createdAt: string;
}

// Отзыв в том виде, в каком он лежит в MongoDB (коллекция reviews)
export interface IReviewDocument extends Omit<IReview, "id" | "createdAt"> {
    _id: ObjectId;
    productId: ObjectId;
    userId: ObjectId;
    createdAt: Date;
}

// Ответ GET /api/products/:id/reviews
export interface IReviewsResponse {
    items: IReview[]; // сначала новые
    total: number;
    average: number; // средняя оценка, 0 — отзывов нет
    // Сколько отзывов с каждой оценкой: distribution[5] — пятёрок, distribution[1] — единиц
    distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}
