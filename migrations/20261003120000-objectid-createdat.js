import { readFile } from "fs/promises"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Переход на _id от MongoDB и даты createdAt:
// - products: убираем свои id и флаг isNew, добавляем createdAt (тип Date)
// - users:    убираем userId, в покупках вместо числового id товара — его _id (productId)
// - articles: убираем свои id, createdAt из строки превращаем в Date

// Даты появления товаров в магазине (ключ — старый числовой id).
// Товары, которые были isNew: true, получили даты за последний месяц.
const productCreatedAt = {
    1: "2026-05-12", 2: "2026-09-28", 3: "2026-06-03", 4: "2026-09-25", 5: "2026-07-14",
    6: "2026-09-21", 7: "2026-04-20", 8: "2026-08-02", 9: "2026-09-18", 10: "2026-06-25",
    11: "2026-05-30", 12: "2026-09-15", 13: "2026-10-01", 14: "2026-07-08", 15: "2026-08-19",
    16: "2026-09-12", 17: "2026-04-11", 18: "2026-06-16", 19: "2026-09-09", 20: "2026-09-30",
    21: "2026-05-05", 22: "2026-09-06", 23: "2026-07-27", 24: "2026-08-10", 25: "2026-09-26",
    26: "2026-04-28", 27: "2026-09-04", 28: "2026-06-09", 29: "2026-08-24", 30: "2026-10-02",
}

const readJson = async (file) => JSON.parse(await readFile(join(__dirname, file), "utf-8"))

export const up = async (db) => {
    const products = db.collection("products")
    const users = db.collection("users")
    const articles = db.collection("articles")

    // Старый числовой id товара -> его _id (нужно, чтобы переписать покупки)
    const allProducts = await products.find({}, { projection: { _id: 1, id: 1 } }).toArray()
    const productIdMap = new Map(allProducts.map((p) => [p.id, p._id]))

    // Сначала проверяем данные, и только потом что-то меняем
    for (const p of allProducts) {
        if (!productCreatedAt[p.id]) throw new Error(`Нет даты createdAt для товара id=${p.id}`)
    }
    const allUsers = await users.find().toArray()
    for (const u of allUsers) {
        for (const purchase of u.purchases ?? []) {
            if (!productIdMap.has(purchase.id)) throw new Error(`Покупка ссылается на несуществующий товар id=${purchase.id}`)
        }
    }

    for (const p of allProducts) {
        await products.updateOne(
            { _id: p._id },
            { $set: { createdAt: new Date(productCreatedAt[p.id]) }, $unset: { id: "", isNew: "" } }
        )
    }

    for (const u of allUsers) {
        const purchases = (u.purchases ?? []).map((purchase) => ({
            productId: productIdMap.get(purchase.id),
            date: new Date(purchase.date),
        }))
        await users.updateOne({ _id: u._id }, { $set: { purchases }, $unset: { userId: "" } })
    }

    for (const a of await articles.find().toArray()) {
        await articles.updateOne(
            { _id: a._id },
            { $set: { createdAt: new Date(a.createdAt) }, $unset: { id: "" } }
        )
    }
}

// Откат: возвращаем числовые id, isNew и строковые даты.
// Старые значения берём из исходных JSON-файлов (сопоставляем по title / email).
const toDateString = (date) => date.toISOString().slice(0, 10)

export const down = async (db) => {
    const products = db.collection("products")
    const users = db.collection("users")
    const articles = db.collection("articles")

    const productsJson = await readJson("products-old.json")
    const usersJson = await readJson("users.json")
    const articlesJson = await readJson("articles.json")

    // _id товара (строкой) -> старый числовой id
    const oldIdByObjectId = new Map()
    for (const p of await products.find().toArray()) {
        const original = productsJson.find((j) => j.title === p.title)
        if (!original) throw new Error(`Товар "${p.title}" не найден в products-old.json`)
        oldIdByObjectId.set(p._id.toString(), original.id)
        await products.updateOne(
            { _id: p._id },
            { $set: { id: original.id, isNew: original.isNew }, $unset: { createdAt: "" } }
        )
    }

    for (const u of await users.find().toArray()) {
        const original = usersJson.find((j) => j.email === u.email)
        if (!original) throw new Error(`Пользователь ${u.email} не найден в users.json`)
        const purchases = (u.purchases ?? []).map((purchase) => ({
            id: oldIdByObjectId.get(purchase.productId.toString()),
            date: toDateString(purchase.date),
        }))
        await users.updateOne({ _id: u._id }, { $set: { userId: original.userId, purchases } })
    }

    for (const a of await articles.find().toArray()) {
        const original = articlesJson.find((j) => j.title === a.title)
        if (!original) throw new Error(`Статья "${a.title}" не найдена в articles.json`)
        await articles.updateOne(
            { _id: a._id },
            { $set: { id: original.id, createdAt: toDateString(a.createdAt) } }
        )
    }
}
