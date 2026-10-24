import { IProduct } from "@/types/product";
import { IReviewsResponse } from "@/types/review";

// Загрузка данных для страницы товара с нашего API (как getProducts в lib/get-products.ts)

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Товар по id. null — товара нет (или id кривой): страница покажет 404.
// Остальные ошибки пробрасываем — пусть сработает error-страница, а не «товар не найден»
export const getProduct = async (id: string): Promise<IProduct | null> => {
  // Остаток (quantity) меняется при заказах, поэтому кешируем ненадолго
  const res = await fetch(`${BASE_URL}/api/products/${encodeURIComponent(id)}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 400 || res.status === 404) return null;
  if (!res.ok) throw new Error(`Ошибка загрузки товара ${id}: ${res.status}`);
  return res.json();
};

const EMPTY_REVIEWS: IReviewsResponse = {
  items: [],
  total: 0,
  average: 0,
  distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

// Отзывы без кеша: после отправки отзыва router.refresh() должен сразу показать новый.
// При ошибке — пустой список, чтобы из-за отзывов не падала вся страница
export const getReviews = async (productId: string): Promise<IReviewsResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/api/products/${productId}/reviews`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Ошибка загрузки отзывов ${productId}: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error(error);
    return EMPTY_REVIEWS;
  }
};

// «С этим товаром покупают». При ошибке — пусто, блок просто не покажется
export const getBoughtTogether = async (productId: string, limit = 4): Promise<IProduct[]> => {
  try {
    const res = await fetch(`${BASE_URL}/api/products/${productId}/bought-together?limit=${limit}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Ошибка загрузки «С этим товаром покупают» ${productId}: ${res.status}`);
    const data: { items: IProduct[] } = await res.json();
    return data.items;
  } catch (error) {
    console.error(error);
    return [];
  }
};
