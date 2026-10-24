// Коллекция orders — история заказов для личного кабинета.
// Индекс под запрос «заказы пользователя, сначала новые» (GET /api/orders).
// createIndex заодно создаёт саму коллекцию — внутри транзакции заказа её создавать не придётся

const INDEX_NAME = "userId_createdAt"

export const up = async (db) => {
    await db.collection("orders").createIndex({ userId: 1, createdAt: -1 }, { name: INDEX_NAME })
}

// Откат: убираем только индекс. Сами заказы не удаляем — это история покупок пользователей
export const down = async (db) => {
    await db.collection("orders").dropIndex(INDEX_NAME)
}
