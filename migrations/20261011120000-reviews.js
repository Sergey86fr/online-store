// Коллекция reviews — отзывы о товарах (страница товара).
// 1. { productId, createdAt } — под запрос «отзывы товара, сначала новые» (GET /api/products/:id/reviews)
// 2. { productId, userId } unique — один отзыв на товар от одного пользователя (POST ответит 409)

const LIST_INDEX = "productId_createdAt"
const UNIQUE_INDEX = "productId_userId_unique"

export const up = async (db) => {
    const reviews = db.collection("reviews")
    await reviews.createIndex({ productId: 1, createdAt: -1 }, { name: LIST_INDEX })
    await reviews.createIndex({ productId: 1, userId: 1 }, { name: UNIQUE_INDEX, unique: true })
}

// Откат: убираем только индексы. Сами отзывы не удаляем — их писали пользователи
export const down = async (db) => {
    const reviews = db.collection("reviews")
    await reviews.dropIndex(UNIQUE_INDEX)
    await reviews.dropIndex(LIST_INDEX)
}
