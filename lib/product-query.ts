import { Db, Filter } from "mongodb";
import { parsePrice, PRODUCT_PRICE_EXPR } from "@/lib/product-filters";
import { IPriceRange } from "@/lib/get-price-range";
import { IProductDocument } from "@/types/product";

// Серверная часть фильтров каталога — общая для /api/products и /api/favorites.
// (lib/product-filters.ts — то, что нужно и браузеру: имена параметров и сборка query-строки)

// ?inStock=true&minPrice=100&maxPrice=500 -> условия для MongoDB.
// Возвращает строку с ошибкой для ответа 400, если цена не число
export const parseProductFilters = (
  searchParams: URLSearchParams,
): Filter<IProductDocument> | string => {
  const filter: Filter<IProductDocument> = {};

  if (searchParams.get("inStock") === "true") {
    filter.quantity = { $gt: 0 };
  }

  // Цена со скидкой — вычисляемая, поэтому сравниваем через $expr
  const priceConditions = [];
  for (const [param, operator] of [["minPrice", "$gte"], ["maxPrice", "$lte"]] as const) {
    const raw = searchParams.get(param);
    if (raw === null) continue;
    const price = parsePrice(raw);
    if (price === undefined) {
      return `${param} должен быть числом от 0`;
    }
    priceConditions.push({ [operator]: [PRODUCT_PRICE_EXPR, price] });
  }
  if (priceConditions.length > 0) {
    filter.$expr = { $and: priceConditions };
  }

  return filter;
};

// Самая низкая и самая высокая цена (со скидкой акции) среди товаров под условием match —
// границы ползунка «Цена». Целые рубли: min вниз, max вверх, чтобы крайние товары попадали в диапазон.
// Товаров нет — { min: 0, max: 0 }
export const findPriceRange = async (db: Db, match: Filter<IProductDocument>): Promise<IPriceRange> => {
  const [range] = await db
    .collection<IProductDocument>("products")
    .aggregate<IPriceRange>([
      { $match: match },
      { $group: { _id: null, min: { $min: PRODUCT_PRICE_EXPR }, max: { $max: PRODUCT_PRICE_EXPR } } },
    ])
    .toArray();

  return range ? { min: Math.floor(range.min), max: Math.ceil(range.max) } : { min: 0, max: 0 };
};
