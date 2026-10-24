import type { ObjectId } from "mongodb";

// Статья в том виде, в каком её отдаёт API и получают компоненты
export interface IArticle {
    id: string;
    title: string;
    createdAt: string;
    description: string;
    img: string;
}

// Статья в том виде, в каком она лежит в MongoDB
export interface IArticleDocument extends Omit<IArticle, "id" | "createdAt"> {
    _id: ObjectId;
    createdAt: Date;
}
