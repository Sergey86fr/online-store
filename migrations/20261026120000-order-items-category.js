// Добавляем позициям заказа поле category — категорию товара на момент покупки.
// Нужна для ссылки на страницу товара из личного кабинета: /catalog/<category>/<id> (getProductHref).
// Новые заказы получают category сразу при создании (POST /api/orders), а у старых её нет — дописываем

export const up = async (db) => {
    const products = await db
        .collection("products")
        .find({}, { projection: { category: 1 } })
        .toArray()
    const categoryById = new Map(products.map((p) => [p._id.toString(), p.category]))

    const orders = db.collection("orders")
    const oldOrders = await orders.find({ "items.category": { $exists: false } }).toArray()

    const operations = oldOrders.map((order) => ({
        updateOne: {
            filter: { _id: order._id },
            update: {
                $set: {
                    items: order.items.map((item) => {
                        const category = categoryById.get(item.productId.toString())
                        // Товар удалили из каталога — категорию взять неоткуда, такую позицию не трогаем
                        return item.category || !category ? item : { ...item, category }
                    }),
                },
            },
        },
    }))
    if (operations.length > 0) await orders.bulkWrite(operations)
}

// Откат: убираем поле у всех позиций всех заказов
export const down = async (db) => {
    await db.collection("orders").updateMany({}, { $unset: { "items.$[].category": "" } })
}
