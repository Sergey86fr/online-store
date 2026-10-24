// Добавляем товарам поле quantity — сколько штук осталось на складе.
// quantity = 0 — товар временно закончился: на карточке надпись, кнопка «В корзину» неактивна.

// Эти товары сразу делаем закончившимися, чтобы было видно, как выглядит карточка.
// Булочки — в «Новинках» на главной, шампиньоны — в «Акциях»
const OUT_OF_STOCK = ["Булочки сдобные с кунжутом", "Шампиньоны", "Рис жасмин Premiere of Taste"]

export const up = async (db) => {
    const products = db.collection("products")
    const all = await products.find({}, { projection: { title: 1 } }).sort({ title: 1 }).toArray()

    for (const title of OUT_OF_STOCK) {
        if (!all.some((p) => p.title === title)) throw new Error(`В базе нет товара "${title}"`)
    }

    // Остальным — от 10 до 50 штук. Не случайно, а по номеру товара, чтобы при каждом запуске выходило одно и то же
    const operations = all.map((p, i) => ({
        updateOne: {
            filter: { _id: p._id },
            update: { $set: { quantity: OUT_OF_STOCK.includes(p.title) ? 0 : 10 + ((i * 7) % 41) } },
        },
    }))
    if (operations.length > 0) await products.bulkWrite(operations)
}

// Откат: просто убираем поле
export const down = async (db) => {
    await db.collection("products").updateMany({}, { $unset: { quantity: "" } })
}
