import { IProduct, IProductDocument, ProductCategory } from "@/types/product";

// Названия категорий для отображения на сайте
export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  alcohol: "Алкоголь",
  dairy: "Молочная продукция",
  "vegetables-fruits": "Овощи и фрукты",
  bakery: "Хлеб и выпечка",
  grocery: "Бакалея",
  canned: "Консервы",
  meat: "Птица и мясо",
  drinks: "Напитки",
  fish: "Рыба и морепродукты",
};

// Проверка строки из URL (?category=..., [category] в пути): есть ли такая категория.
// Список берём из ключей PRODUCT_CATEGORY_LABELS, чтобы не дублировать его
export const isProductCategory = (value: string): value is ProductCategory =>
  Object.hasOwn(PRODUCT_CATEGORY_LABELS, value);

// Сколько дней после появления товар считается новинкой (бейдж «Новинка»)
export const NEW_PRODUCT_DAYS = 30;

// Скидка по карте покупателя, в процентах. На новинки не действует
export const LOYALTY_CARD_DISCOUNT = 10;

const DAY_MS = 24 * 60 * 60 * 1000;

// С какой даты товар считается новинкой: сейчас минус NEW_PRODUCT_DAYS дней
export const getNewProductsSince = () =>
  new Date(Date.now() - NEW_PRODUCT_DAYS * DAY_MS);

// Округление до копеек: 119 * 0.9 в JS даёт 107.10000000000001
export const roundPrice = (price: number) => Math.round(price * 100) / 100;

// Адрес страницы товара — в одном месте, чтобы при переезде страницы поменять только здесь
export const getProductHref = (category: string, id: string) =>
  `/catalog/${category}/${id}`;

// Цена для показа: 108.9 -> "108,90"
export const formatPrice = (price: number) =>
  price.toFixed(2).replace(".", ",");

// Цены товара за штуку: обычная (со скидкой акции) и по карте покупателя (на новинки карта не действует)
export const getProductPrices = ({
  basePrice,
  discountPercent = 0,
  isNew,
}: Pick<IProduct, "basePrice" | "discountPercent" | "isNew">) => {
  const price = basePrice * (1 - discountPercent / 100);
  const cardPrice = isNew ? price : price * (1 - LOYALTY_CARD_DISCOUNT / 100);
  return { price: roundPrice(price), cardPrice: roundPrice(cardPrice) };
};

// Документ из MongoDB -> товар для API: _id становится строковым id, isNew вычисляется
export const toProduct = ({
  _id,
  createdAt,
  ...rest
}: IProductDocument): IProduct => ({
  ...rest,
  id: _id.toString(),
  createdAt: createdAt.toISOString(),
  isNew: createdAt >= getNewProductsSince(),
});
