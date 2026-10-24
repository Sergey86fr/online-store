import type { IProduct, ProductCategory } from "./product";

// Ответ GET /api/search?q=... — подсказки для поиска в шапке
export interface ISearchResponse {
    // Подходящая категория (первая строка подсказок) или null, если ничего не нашлось
    category: { slug: ProductCategory; label: string } | null;
    // Товары с совпадением в названии — только то, что нужно для строки подсказки
    products: Pick<IProduct, "id" | "title" | "category">[];
}
