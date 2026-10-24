"use client";

import { useState } from "react";
import Link from "next/link";
import OrderCard from "../order-card/order-card";
import Pagination from "../pagination/pagination";
import { IOrder } from "@/types/order";
import { IPaginatedResponse } from "@/lib/pagination";

interface IOrdersListProps {
  initialItems: IOrder[]; // первая порция — уже загружена на сервере
  page: number;
  totalPages: number;
  limit: number;
}

// Список заказов + «Показать ещё» + пагинация — так же, как товары в категории (CategoryProducts).
// «Показать ещё» догружает следующую страницу в браузере и дописывает заказы в конец.
// Страница сервера передаёт key={page}, поэтому при переходе по пагинации состояние сбрасывается
const OrdersList = ({ initialItems, page, totalPages, limit }: IOrdersListProps) => {
  const [items, setItems] = useState(initialItems);
  const [lastPage, setLastPage] = useState(page);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const hasMore = lastPage < totalPages;

  const loadMore = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      // Заказы у каждого свои — не кешируем
      const res = await fetch(`/api/orders?page=${lastPage + 1}&limit=${limit}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Ошибка загрузки заказов: ${res.status}`);
      const data: IPaginatedResponse<IOrder> = await res.json();
      setItems((prev) => [...prev, ...data.items]);
      setLastPage(data.page);
    } catch (error) {
      console.error(error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-xl xl:text-[32px] font-bold">Заказов пока нет</p>
        <Link href="/catalog" className="text-lg text-(--color-primary) hover:underline">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col gap-15 md:gap-20 xl:gap-30">
        {items.map((order) => (
          <li key={order.id}>
            <OrderCard order={order} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={isLoading}
          className="self-center h-15 px-4 mt-10 md:mt-15 bg-[#f3f2f1] enabled:hover:bg-[#e6e5e3] rounded-sm text-lg md:text-2xl text-[#606060] duration-300 cursor-pointer disabled:cursor-wait"
        >
          {isLoading ? "Загружаем…" : "Показать ещё"}
        </button>
      )}
      {hasError && (
        <p role="alert" className="self-center mt-2 text-sm text-(--color-primary)">
          Не удалось загрузить заказы, попробуйте ещё раз
        </p>
      )}

      <Pagination page={lastPage} totalPages={totalPages} getHref={(p) => (p > 1 ? `/orders?page=${p}` : "/orders")} />
    </div>
  );
};

export default OrdersList;
