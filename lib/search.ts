// Поиск в шапке: общие настройки для API (app/api/search) и поля поиска (components/header)

// Короче — не ищем: по одной букве совпадёт полкаталога
export const SEARCH_MIN_LENGTH = 2;

// Сколько товаров показываем в подсказках (как в макете)
export const SEARCH_PRODUCTS_LIMIT = 3;

// Спецсимволы регулярки экранируем, чтобы «(» или «.» в запросе искались как обычные символы
export const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Делим название на куски для подсветки совпадения жирным:
// ("Коктейль молочный", "моло") → [{ text: "Коктейль ", match: false }, { text: "моло", match: true }, { text: "чный", match: false }]
export const splitByMatch = (text: string, query: string) =>
  text
    // Скобки в регулярке оставляют совпадения в массиве после split — они и будут жирными
    .split(new RegExp(`(${escapeRegExp(query)})`, "i"))
    .filter(Boolean)
    .map((part) => ({ text: part, match: part.toLowerCase() === query.toLowerCase() }));
