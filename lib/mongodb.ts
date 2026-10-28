import { MongoClient } from "mongodb";

const url = process.env.DELIVERY_SHOP_DB_URL;
const dbName = process.env.DELIVERY_SHOP_DB_NAME;

if (!url || !dbName) {
  throw new Error(
    "В .env не заданы DELIVERY_SHOP_DB_URL или DELIVERY_SHOP_DB_NAME",
  );
}

// Подключение храним в globalThis: в dev-режиме Next.js перезагружает модули при каждом сохранении файла,
// и без этого на каждую правку открывалось бы новое подключение
const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>;
};

// Звоним в базу. Если звонок сорвётся (нет сети, Atlas не ответил) — убираем его из globalThis,
// чтобы следующий запрос позвонил заново, а не получал ту же ошибку до перезапуска сервера
const connect = () => {
  const promise = new MongoClient(url).connect();
  promise.catch(() => {
    // Срываем только свой «стикер»: другой запрос мог уже позвонить заново и повесить новый
    if (globalForMongo.mongoClientPromise === promise) {
      globalForMongo.mongoClientPromise = undefined;
    }
  });
  return promise;
};

// Подключение есть — отдаём его, нет — звоним. Сам клиент нужен и для транзакций: сессия открывается у клиента
export const getMongoClient = () => {
  if (!globalForMongo.mongoClientPromise) {
    globalForMongo.mongoClientPromise = connect();
  }
  return globalForMongo.mongoClientPromise;
};

export const getDb = async () => {
  const client = await getMongoClient();
  return client.db(dbName);
};
