import { Db, ObjectId } from "mongodb";
import { IUserDocument } from "@/types/user";

// Избранное и корзина текущего пользователя — общий запрос для /api/favorites и /api/cart.
// null — пользователя нет в базе. У старых пользователей полей нет — отдаём пустые списки
export const findUserLists = async (db: Db, userId: ObjectId) => {
  const user = await db
    .collection<IUserDocument>("users")
    .findOne({ _id: userId }, { projection: { favorites: 1, cart: 1 } });

  return user ? { favorites: user.favorites ?? [], cart: user.cart ?? [] } : null;
};
