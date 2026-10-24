import { IProduct } from "@/types/product";
import { DEFAULT_LIMIT, IPaginatedResponse } from "@/lib/pagination";

// Загружает список товаров с нашего API.
// path — путь с query-параметрами, например "/api/products?discount=true".
// При ошибке пишет её в консоль и возвращает пустую страницу, чтобы страница не падала целиком
export const getProducts = async (path: string, init?: RequestInit,newPage?:number, limit?:number,category?:string):Promise<IPaginatedResponse<IProduct>>=> {
  try {
    const [pathname,search=""] = path.split("?");
    const params = new URLSearchParams(search)
    if(newPage !== undefined) params.set("page", String(newPage));
    if(limit!== undefined) params.set("limit", String(limit));
    if(category!== undefined) params.set("category", category);
      const query = params.toString()
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${pathname}${query? `?${query}`: ""}`, init);
    if (!res.ok) {
      throw new Error(`Ошибка загрузки ${path}: ${res.status}`);
    }
    const data: IPaginatedResponse<IProduct> = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return { items: [], total: 0, page: 1, limit: DEFAULT_LIMIT, totalPages: 0 };
  }
};
