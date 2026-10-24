"use client";

import { useState } from "react";
import Calendar from "../../public/images/icons/calendar.svg";
import Eye from "../../public/images/icons/eye.svg";
import OrderItemCard from "../order-item-card/order-item-card";
import { IOrder } from "@/types/order";
import { ORDER_STATUS_LABELS } from "@/lib/orders";

interface IOrderCardProps {
  order: IOrder;
}

// Часовой пояс задаём явно: карточка рисуется и на сервере, и в браузере,
// и без этого дата у них может разойтись (ошибка гидратации)
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("ru-RU", { timeZone: "Europe/Moscow" });

// 3006.83 → «3 006,83»
const formatTotal = (total: number) =>
  total.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Свёрнутый заказ показывает один ряд товаров: 2 на мобильном, 3 на планшете, 4 на десктопе.
// Ширину экрана сервер не знает, поэтому лишние карточки прячем через CSS (как в ProductsSection)
const getCollapsedItemClass = (index: number) => {
  if (index < 2) return undefined;
  if (index === 2) return "hidden md:block";
  if (index === 3) return "hidden xl:block";
  return "hidden";
};

// Кнопка «Просмотреть заказ» нужна, только если в ряд влезли не все товары
const getToggleClass = (itemsCount: number) => {
  if (itemsCount > 4) return "flex";
  if (itemsCount === 4) return "flex xl:hidden";
  if (itemsCount === 3) return "flex md:hidden";
  return "hidden";
};

// Один заказ: дата, интервал доставки, статус, сумма и товары
const OrderCard = ({ order }: IOrderCardProps) => {
  const { createdAt, status, delivery, items, total } = order;
  const [isExpanded, setIsExpanded] = useState(false);

  // Выбрать время доставки можно, пока заказ не доставлен и не отменён
  const canChooseDelivery = delivery === null && (status === "new" || status === "in-progress");

  return (
    <article className="flex flex-col items-center gap-6 md:gap-10">
      <header className="w-full flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 md:flex-1">
          <h2 className="text-lg md:text-2xl font-bold">
            {/* Есть доставка — показываем её день, иначе день оформления */}
            <time dateTime={delivery?.date ?? createdAt}>{formatDate(delivery?.date ?? createdAt)}</time>
          </h2>
          {delivery && <span className="text-lg md:text-2xl font-bold">{delivery.interval}</span>}
          <span className="px-2 py-1 bg-[#f3f2f1] rounded-sm text-sm md:text-base">
            {ORDER_STATUS_LABELS[status]}
          </span>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-6">
          <span className="text-lg md:text-2xl">{formatTotal(total)} ₽</span>
          {canChooseDelivery && (
            // TODO: окно выбора дня и интервала доставки — пока кнопка ничего не делает
            <button
              type="button"
              className="w-50 h-10 p-2 flex items-center justify-center gap-2 bg-(--color-secondary) hover:bg-(--color-primary) active:shadow-(--shadow-button-active) rounded-sm text-white duration-300 cursor-pointer"
            >
              <Calendar className="w-6 h-6 shrink-0" aria-hidden="true" />
              <span className="flex-1">Когда доставить</span>
            </button>
          )}
        </div>
      </header>

      <ul className="w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 xl:gap-10">
        {items.map((item, index) => (
          <li key={item.productId} className={isExpanded ? undefined : getCollapsedItemClass(index)}>
            <OrderItemCard item={item} />
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`${getToggleClass(items.length)} w-50 h-10 p-2 items-center justify-center gap-2 bg-[#f3f2f1] hover:bg-[#e6e5e3] rounded-sm text-[#606060] duration-300 cursor-pointer`}
      >
        <Eye className="w-6 h-6 shrink-0" aria-hidden="true" />
        <span className="flex-1">{isExpanded ? "Свернуть заказ" : "Просмотреть заказ"}</span>
      </button>
    </article>
  );
};

export default OrderCard;
