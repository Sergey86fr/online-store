import { ObjectId } from "mongodb";

// Превращает строку из адреса (/api/articles/:id) в ObjectId.
// Возвращает null, если строка не похожа на id из MongoDB.
// ObjectId.isValid() здесь не подходит: он считает валидной любую строку из 12 символов.
export const parseObjectId = (value: string): ObjectId | null => {
  return /^[0-9a-f]{24}$/i.test(value) ? new ObjectId(value) : null;
};
