import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { IUserDocument } from "@/types/user";

// Возвращает _id текущего пользователя или null, если он не авторизован.
// ЗАГЛУШКА: авторизации пока нет, поэтому считаем, что вошёл тестовый пользователь.
// Когда появится вход на сайт, здесь будем читать cookie с сессией/токеном.
export const getCurrentUserId = async (): Promise<ObjectId | null> => {
  const db = await getDb();
  const user = await db
    .collection<IUserDocument>("users")
    .findOne({ email: "test@email.com" }, { projection: { _id: 1 } });

  return user?._id ?? null;
};
