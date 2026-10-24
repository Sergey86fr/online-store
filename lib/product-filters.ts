// Фильтры каталога: ?minPrice=100&maxPrice=500&inStock=true
// Общие для API (app/api/products) и страницы категории, чтобы имена параметров не разъехались

export interface IProductFilters {
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
}

// Цена товара со скидкой акции (без карты) — как «Обычная» в карточке.
// В MongoDB её нет отдельным полем, поэтому считаем выражением: basePrice * (1 - discountPercent / 100)
export const PRODUCT_PRICE_EXPR = {
  $multiply: [
    "$basePrice",
    { $subtract: [1, { $divide: [{ $ifNull: ["$discountPercent", 0] }, 100] }] },
  ],
};

// "150" → 150; пусто, "abc", "-5" → undefined (фильтр не применяется)
export const parsePrice = (value: string | null | undefined): number | undefined => {
  if (value === null || value === undefined || value.trim() === "") return undefined;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : undefined;
};

// Фильтры → query-строка без page: "minPrice=100&inStock=true".
// Пустые фильтры в URL не попадают
export const toFiltersQuery = ({ minPrice, maxPrice, inStock }: IProductFilters) => {
  const params = new URLSearchParams();
  if (minPrice !== undefined) params.set("minPrice", String(minPrice));
  if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));
  if (inStock) params.set("inStock", "true");
  return params.toString();
};
