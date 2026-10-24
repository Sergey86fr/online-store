import { readFile } from "fs/promises"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

export const up = async (db) => {
    const raw = await readFile(join(__dirname, "products-old.json"), "utf-8")
    const products = JSON.parse(raw)
    await db.collection("products").insertMany(products)
};


export const down = async (db) => {
    
};
