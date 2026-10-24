"use client";

import { useState } from "react";
import ProductCard from "../product-card/product-card";
import Pagination from "../pagination/pagination";
import { IProduct } from "@/types/product";
import { IPaginatedResponse } from "@/lib/pagination";

interface ICategoryProductsProps {
  initialItems: IProduct[]; // первая порция — уже загружена на сервере
  page: number;
  totalPages: number;
  limit: number;
  basePath: string; // "/catalog/dairy"
  apiQuery: string; // фильтры для API без page/limit: "category=dairy&inStock=true"
  filtersQuery: string; // фильтры для ссылок пагинации: "inStock=true"
}

// Сетка товаров категории + «Показать ещё» + пагинация.
// «Показать ещё» догружает следующую страницу в браузере и дописывает товары в конец,
// а пагинация подсвечивает последнюю загруженную страницу — с неё и продолжаются ссылки «‹ ›».
// Страница сервера передаёт key, поэтому при смене фильтров или ?page состояние сбрасывается
const CategoryProducts = ({
  initialItems,
  page,
  totalPages,
  limit,
  basePath,
  apiQuery,
  filtersQuery,
}: ICategoryProductsProps) => {
  const [items, setItems] = useState(initialItems);
  const [lastPage, setLastPage] = useState(page);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const hasMore = lastPage < totalPages;

  const loadMore = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const res = await fetch(`/api/products?${apiQuery}&page=${lastPage + 1}&limit=${limit}`);
      if (!res.ok) throw new Error(`Ошибка загрузки товаров: ${res.status}`);
      const data: IPaginatedResponse<IProduct> = await res.json();
      setItems((prev) => [...prev, ...data.items]);
      setLastPage(data.page);
    } catch (error) {
      console.error(error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Первая страница — без ?page=1, остальные фильтры сохраняются
  const getHref = (p: number) => {
    const params = new URLSearchParams(filtersQuery);
    if (p > 1) params.set("page", String(p));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  if (items.length === 0) {
    return (
      <p className="text-xl xl:text-[32px] font-bold">
        {filtersQuery ? "По этим фильтрам товаров не нашлось" : "В этой категории пока нет товаров"}
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      <ul className="grid grid-cols-2 md:grid-cols-3 justify-items-center gap-4 md:gap-8 xl:gap-10">
        {items.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={isLoading}
          className="self-center h-10 px-8 mt-8 xl:mt-10 bg-[#f3f2f1] enabled:hover:bg-[#e6e5e3] rounded-sm text-[#606060] duration-300 cursor-pointer disabled:cursor-wait"
        >
          {isLoading ? "Загружаем…" : "Показать ещё"}
        </button>
      )}
      {hasError && (
        <p role="alert" className="self-center mt-2 text-sm text-(--color-primary)">
          Не удалось загрузить товары, попробуйте ещё раз
        </p>
      )}

      <Pagination page={lastPage} totalPages={totalPages} getHref={getHref} />
    </div>
  );
};

export default CategoryProducts;
