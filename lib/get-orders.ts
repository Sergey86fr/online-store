import { IOrder } from "@/types/order";
import { DEFAULT_LIMIT, IPaginatedResponse } from "@/lib/pagination";

// Загружает страницу заказов текущего пользователя с нашего API.
// Ответ у каждого пользователя свой, поэтому без кеша (cache: "no-store").
// При ошибке пишет её в консоль и возвращает пустую страницу, чтобы страница не падала целиком
export const getOrders = async (page?: number, limit?: number): Promise<IPaginatedResponse<IOrder>> => {
  try {
    const params = new URLSearchParams();
    if (page !== undefined) params.set("page", String(page));
    if (limit !== undefined) params.set("limit", String(limit));
    const query = params.toString();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders${query ? `?${query}` : ""}`,
      { cache: "no-store" },
    );
    if (!res.ok) {
      throw new Error(`Ошибка загрузки заказов: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    return { items: [], total: 0, page: 1, limit: limit ?? DEFAULT_LIMIT, totalPages: 0 };
  }
};
