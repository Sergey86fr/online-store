import { readFile } from "fs/promises"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Замена 30 выдуманных товаров (products-old.json) на 145 настоящих из products.json:
// картинки в public/images/products, у каждого товара есть category.
// Старые товары и покупки сохраняются в *_backup-коллекции, чтобы down мог всё вернуть как было.

const PRODUCTS_BACKUP = "products_backup_20261004"
const PURCHASES_BACKUP = "users_purchases_backup_20261004"

// Должны совпадать с ProductCategory в types/product.ts
const CATEGORIES = ["alcohol", "dairy", "vegetables-fruits", "bakery", "grocery", "canned", "meat", "drinks", "fish"]

// Покупки пользователей ссылаются на старые товары — переносим их на похожие новые.
// Старое название -> новое название. Покупки товаров, которых тут нет, пропадут.
const purchaseReplacements = {
    "Молоко Простоквашино 3.2%": "Молоко Простоквашино 2.5%",
    "Кефир Простоквашино 1%": "Кефир Простоквашино 2.5%",
    "Сметана Простоквашино 20%": "Сметана Простоквашино 10%",
    "Творог Простоквашино 5%": "Творог Кубанский молочник 5% ГОСТ",
    "Масло сливочное Простоквашино 82.5%": "Масло сливочное Белорусское 82.5%",
    "Колбаса сырокопченая Сальчичон": "Колбаса сырокопчёная Сальчичон",
    "Сосиски вареные Молочные": "Сосиски Delikaiser Сливочные",
    "Котлеты домашние весовые": "Фарш говяжий Свежесть",
    "Хлеб Бородинский": "Хлеб Аютинский ржано-пшеничный",
    "Батон Нарезной": "Батон Аютинский хлеб с отрубями",
    "Булочки сдобные с маком": "Булочки сдобные с кунжутом",
    "Рис Basmati Мистраль": "Рис басмати Premiere of Taste",
    "Макароны Barilla Spaghetti": "Спагетти Gusto di Roma",
    "Майонез Провансаль": "Майонез Calve Лёгкий",
    "Сок Добрый апельсиновый": "Сок Добрый апельсин",
    "Чай Greenfield Golden Ceylon": "Чай Greenfield Blueberry Nights чёрный",
}

const readJson = async (file) => JSON.parse(await readFile(join(__dirname, file), "utf-8"))

export const up = async (db) => {
    const products = db.collection("products")
    const users = db.collection("users")

    const newProducts = (await readJson("products.json")).map((p) => ({
        ...p,
        createdAt: new Date(p.createdAt),
    }))
    const oldProducts = await products.find().toArray()
    const allUsers = await users.find().toArray()

    // Сначала проверяем данные, и только потом что-то меняем
    for (const p of newProducts) {
        if (!CATEGORIES.includes(p.category)) throw new Error(`Неизвестная категория "${p.category}" у "${p.title}"`)
    }
    for (const newTitle of Object.values(purchaseReplacements)) {
        if (!newProducts.some((p) => p.title === newTitle)) {
            throw new Error(`В products.json нет товара "${newTitle}"`)
        }
    }

    // 1. Резервная копия старых товаров и покупок
    if (oldProducts.length > 0) await db.collection(PRODUCTS_BACKUP).insertMany(oldProducts)
    const purchasesBackup = allUsers.map((u) => ({ _id: u._id, purchases: u.purchases ?? [] }))
    if (purchasesBackup.length > 0) await db.collection(PURCHASES_BACKUP).insertMany(purchasesBackup)

    // 2. Меняем товары
    await products.deleteMany({})
    const { insertedIds } = await products.insertMany(newProducts)

    // 3. Переносим покупки на новые товары
    const newIdByTitle = new Map(newProducts.map((p, i) => [p.title, insertedIds[i]]))
    const oldTitleById = new Map(oldProducts.map((p) => [p._id.toString(), p.title]))

    for (const u of allUsers) {
        const purchases = (u.purchases ?? [])
            .map((purchase) => {
                const newTitle = purchaseReplacements[oldTitleById.get(purchase.productId.toString())]
                return newTitle ? { productId: newIdByTitle.get(newTitle), date: purchase.date } : null
            })
            .filter((p) => p !== null)
        await users.updateOne({ _id: u._id }, { $set: { purchases } })
    }
}

// Откат: возвращаем старые товары и покупки из резервных коллекций
export const down = async (db) => {
    const products = db.collection("products")
    const users = db.collection("users")

    const oldProducts = await db.collection(PRODUCTS_BACKUP).find().toArray()
    if (oldProducts.length === 0) throw new Error(`Коллекция ${PRODUCTS_BACKUP} пуста — откатывать нечего`)

    await products.deleteMany({})
    await products.insertMany(oldProducts)

    for (const { _id, purchases } of await db.collection(PURCHASES_BACKUP).find().toArray()) {
        await users.updateOne({ _id }, { $set: { purchases } })
    }

    await db.collection(PRODUCTS_BACKUP).drop()
    await db.collection(PURCHASES_BACKUP).drop()
}
