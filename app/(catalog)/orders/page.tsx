import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOrders } from "@/lib/get-orders";
import OrdersList from "@/components/orders-list/orders-list";

// Как в макете: 4 заказа на страницу
const LIMIT = 4;

export const metadata: Metadata = {
  title: "Заказы",
  description: "История ваших заказов в Северяночке",
  // личная страница пользователя — поисковикам её индексировать незачем
  robots: { index: false },
};

interface IOrdersPageProps {
  searchParams: Promise<{ page?: string }>;
}

const OrdersPage = async ({ searchParams }: IOrdersPageProps) => {
  const { page: pageParam } = await searchParams;
  const newPage = pageParam === undefined ? undefined : Number(pageParam);

  // ?page=-3 или ?page=abc — на первую страницу
  if (newPage !== undefined && (!Number.isInteger(newPage) || newPage < 1)) {
    redirect("/orders");
  }

  const { items, page, totalPages } = await getOrders(newPage, LIMIT);

  // ?page=999 — страниц меньше, отправляем на последнюю
  if (totalPages > 0 && page > totalPages) {
    redirect(`/orders?page=${totalPages}`);
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl xl:text-[40px] font-bold mb-4 md:mb-8 xl:mb-10">Заказы</h1>
      <OrdersList key={page} initialItems={items} page={page} totalPages={totalPages} limit={LIMIT} />
    </div>
  );
};

export default OrdersPage;
