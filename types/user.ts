import type { ObjectId } from "mongodb";

export interface ICartItemDocument {
    productId: ObjectId;
    count: number;
}

// Покупка в том виде, в каком она лежит в MongoDB
export interface IPurchaseDocument {
    productId: ObjectId; // _id купленного товара
    date: Date;
}

// Пользователь в том виде, в каком он лежит в MongoDB
export interface IUserDocument {
    _id: ObjectId;
    userName: string;
    email: string;
    phone: string;
    purchases: IPurchaseDocument[];
    favorites?: ObjectId[];
    cart?: ICartItemDocument[];
}
