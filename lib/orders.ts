import { IOrder, IOrderDocument, OrderStatus } from "@/types/order";

// Подписи статусов для плашки на странице «Заказы»
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Оформлен",
  "in-progress": "В процессе",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

// Документ из MongoDB -> заказ для API: ObjectId и Date превращаем в строки.
// userId наружу не отдаём — пользователь и так смотрит только свои заказы.
// У старых заказов нет status и delivery — считаем их новыми и без выбранного времени доставки
export const toOrder = ({
  _id,
  createdAt,
  status,
  delivery,
  items,
  total,
}: IOrderDocument): IOrder => ({
  id: _id.toString(),
  createdAt: createdAt.toISOString(),
  status: status ?? "new",
  delivery: delivery ?? null,
  items: items.map((item) => ({ ...item, productId: item.productId.toString() })),
  total,
});
