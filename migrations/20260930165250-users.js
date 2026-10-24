import { readFile } from "fs/promises"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

export const up = async (db) => {
    const raw = await readFile(join(__dirname, "users.json"), "utf-8")
    const users = JSON.parse(raw)
    await db.collection("users").insertMany(users)
};


export const down = async (db) => {
    
};
