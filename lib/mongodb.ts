import { MongoClient } from "mongodb";

const url = process.env.DELIVERY_SHOP_DB_URL;
const dbName = process.env.DELIVERY_SHOP_DB_NAME;

if (!url || !dbName) {
  throw new Error("В .env не заданы DELIVERY_SHOP_DB_URL или DELIVERY_SHOP_DB_NAME");
}

// В dev-режиме Next.js перезагружает модули при каждом сохранении файла.
// Храним подключение в globalThis, чтобы не открывать новое на каждую правку.
const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
};

const clientPromise =
  globalForMongo.mongoClientPromise ?? new MongoClient(url).connect();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClientPromise = clientPromise;
}

// Сам клиент нужен для транзакций: сессия открывается у клиента, а не у базы
export const getMongoClient = () => clientPromise;

export const getDb = async () => {
  const client = await clientPromise;
  return client.db(dbName);
};
