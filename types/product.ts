import type { ObjectId } from "mongodb";

// Категории товаров. Русские названия для отображения — PRODUCT_CATEGORY_LABELS в lib/products.ts
export type ProductCategory =
    | "alcohol"
    | "dairy"
    | "vegetables-fruits"
    | "bakery"
    | "grocery"
    | "canned"
    | "meat"
    | "drinks"
    | "fish";

// Товар в том виде, в каком его отдаёт API и получают компоненты
export interface IProduct {
    id: string;
    img: string;
    title: string;
    category: ProductCategory;
    description: string;
    basePrice: number;
    discountPercent?: number;
    rating: number;
    weight?: string;
    volume?: string;
    quantity: number; // остаток на складе; 0 — товар временно закончился
    createdAt: string;
    isNew: boolean; // не хранится в базе — вычисляется из createdAt
}

// Товар в том виде, в каком он лежит в MongoDB
export interface IProductDocument extends Omit<IProduct, "id" | "createdAt" | "isNew"> {
    _id: ObjectId;
    createdAt: Date;
}
