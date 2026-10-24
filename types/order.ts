import type { ObjectId } from "mongodb";
import { IProduct } from "./product";
import { useEffect, useState } from "react";

// Позиция заказа. Название, картинка и цены копируются из товара в момент покупки:
// если товар потом подорожает или переименуется, в истории заказов останется как было
export interface IOrderItem {
    productId: string;
    title: string;
    img: string;
    basePrice: number; // цена без скидок на момент покупки
    discountPercent: number; // скидка акции на момент покупки
    price: number; // сколько заплачено за 1 шт.
    count: number;
    sum: number; // price * count
}

// Статус заказа: new — оформлен, in-progress — собираем/везём, delivered — доставлен, cancelled — отменён
export type OrderStatus = "new" | "in-progress" | "delivered" | "cancelled";



// Интервал доставки, который выбрал покупатель («Когда доставить»)
export interface IOrderDelivery {
    date: string; // день доставки, "2026-10-12"
    interval: string; // "11:00-14:00"
}

// Заказ в том виде, в каком его отдаёт API (личный кабинет)
export interface IOrder {
    id: string;
    createdAt: string;
    status: OrderStatus;
    delivery: IOrderDelivery | null; // null — время доставки ещё не выбрано
    items: IOrderItem[];
    total: number; // сумма всего заказа
}

// Заказ в том виде, в каком он лежит в MongoDB (коллекция orders)
export interface IOrderItemDocument extends Omit<IOrderItem, "productId"> {
    productId: ObjectId;
}

// status и delivery необязательные: у заказов, сохранённых до их появления, этих полей нет
export interface IOrderDocument extends Omit<IOrder, "id" | "createdAt" | "items" | "status" | "delivery"> {
    _id: ObjectId;
    userId: ObjectId;
    createdAt: Date;
    status?: OrderStatus;
    delivery?: IOrderDelivery;
    items: IOrderItemDocument[];
}
