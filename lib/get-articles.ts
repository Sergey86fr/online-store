import { IArticle } from "@/types/article";
import { DEFAULT_LIMIT, IPaginatedResponse } from "./pagination";

export const getArticles = async (limit?:number, newPage?:number,): Promise<IPaginatedResponse<IArticle>> => {
  
  const params = new URLSearchParams()
  if(newPage !== undefined) params.set("page", String(newPage));
  if(limit!== undefined) params.set("limit", String(limit))
    const query = params.toString()
  
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles${query? `?${query}`: ""}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) throw new Error(`Сервер ответил статусом ${res.status}`);
    const data:IPaginatedResponse<IArticle> = await res.json();
    return data;
  } catch (error) {
    console.error("Ошибка при получении статей", error);
    return {items:[], total:0,page:1, limit:DEFAULT_LIMIT, totalPages:0} ;
  }
};