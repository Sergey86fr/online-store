import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb, getMongoClient } from "@/lib/mongodb";
import { getCurrentUserId } from "@/lib/auth";
import { parseObjectId } from "@/lib/object-id";
import { parsePagination, toPaginatedResponse } from "@/lib/pagination";
import { getProductPrices, roundPrice, toProduct } from "@/lib/products";
import { toOrder } from "@/lib/orders";
import { IProductDocument } from "@/types/product";
import { IPurchaseDocument, IUserDocument } from "@/types/user";
import { IOrderDocument, IOrderItemDocument } from "@/types/order";


// Сколько разных товаров и сколько штук одного товара можно купить за раз
const MAX_ORDER_ITEMS = 100;
const MAX_ITEM_COUNT = 99;

// Что пришло от фронта: какой товар и сколько штук
interface IRequestedItem {
  productId: ObjectId;
  count: number;
}

// Товар, которого не хватило: сколько просили и сколько есть (0 — закончился или товара нет вовсе)
interface IOrderProblem {
  productId: string;
  title: string | null; // null — товара с таким id нет
  requested: number;
  available: number;
}

// Бросаем внутри транзакции, чтобы она откатилась, и ловим снаружи, чтобы ответить 409
class NotEnoughStockError extends Error {
  constructor(public problems: IOrderProblem[]) {
    super("Не хватает товара");
  }
}

class UserNotFoundError extends Error {}

// Проверяем тело запроса. Возвращаем список товаров или текст ошибки для ответа 400.
// Один и тот же товар, пришедший несколько раз, складываем в одну позицию
const parseOrderItems = (body: unknown): IRequestedItem[] | string => {
  const items = (body as { items?: unknown } | null)?.items;

  if (!Array.isArray(items) || items.length === 0) {
    return "Нужен непустой массив items: [{ productId, count }]";
  }
  if (items.length > MAX_ORDER_ITEMS) {
    return `В заказе может быть не больше ${MAX_ORDER_ITEMS} позиций`;
  }

  const countById = new Map<string, number>();
  for (const item of items) {
    const { productId, count } = (item ?? {}) as { productId?: unknown; count?: unknown };

    if (typeof productId !== "string" || parseObjectId(productId) === null) {
      return `Неверный productId: ${JSON.stringify(productId)}`;
    }
    if (typeof count !== "number" || !Number.isInteger(count) || count < 1) {
      return `count должен быть целым числом от 1 (товар ${productId})`;
    }

    const total = (countById.get(productId) ?? 0) + count;
    if (total > MAX_ITEM_COUNT) {
      return `Одного товара можно купить не больше ${MAX_ITEM_COUNT} шт. (товар ${productId})`;
    }
    countById.set(productId, total);
  }

  return [...countById].map(([id, count]) => ({ productId: new ObjectId(id), count }));
};

// GET /api/orders — заказы текущего пользователя для личного кабинета, сначала новые.
//   ?page=2&limit=20 — пагинация
// Ответ: { items: IOrder[], total, page, limit, totalPages } (IOrder — types/order.ts)
// Ответ у каждого пользователя свой — НЕ кешируйте его на фронте (cache: "no-store")
export async function GET(request: NextRequest) {
  const pagination = parsePagination(request.nextUrl.searchParams);
  if (typeof pagination === "string") {
    return NextResponse.json({ error: pagination }, { status: 400 });
  }

  try {
    const userId = await getCurrentUserId();
    if (userId === null) {
      return NextResponse.json({ error: "Нужно войти в аккаунт" }, { status: 401 });
    }

    const orders = (await getDb()).collection<IOrderDocument>("orders");
    const filter = { userId };

    // Для этого запроса в миграции 20261010130000-orders.js сделан индекс { userId, createdAt }
    const [found, total] = await Promise.all([
      orders
        .find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .toArray(),
      orders.countDocuments(filter),
    ]);

    return NextResponse.json(toPaginatedResponse(found.map(toOrder), total, pagination));
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    return NextResponse.json({ error: "Не удалось получить заказы" }, { status: 500 });
  }
}

// POST /api/orders — оформить заказ: списать товары со склада, сохранить заказ с ценами в orders
// и записать товары в покупки пользователя («Покупали раньше»).
// Тело: { "items": [{ "productId": "…", "count": 2 }, …] }
// Ответы:
//   201 IOrder (types/order.ts)      — всё списано, заказ сохранён
//   400 { error }                    — неверное тело запроса
//   401 { error }                    — не вошёл в аккаунт
//   404 { error }                    — пользователя нет в базе
//   409 { error, problems: [{ productId, title, requested, available }] } — чего-то не хватило,
//       ничего не списано (покупатель может уменьшить количество и отправить заново)
// Всё делается в транзакции: либо списываются все товары и сохраняются заказ и покупки, либо ничего.
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Тело запроса должно быть JSON" }, { status: 400 });
  }

  const items = parseOrderItems(body);
  if (typeof items === "string") {
    return NextResponse.json({ error: items }, { status: 400 });
  }

  const session = (await getMongoClient()).startSession();

  try {
    const userId = await getCurrentUserId();
    if (userId === null) {
      return NextResponse.json({ error: "Нужно войти в аккаунт" }, { status: 401 });
    }

    const db = await getDb();
    const products = db.collection<IProductDocument>("products");
    const users = db.collection<IUserDocument>("users");
    const orders = db.collection<IOrderDocument>("orders");

    // Колбэк транзакции драйвер может запустить повторно (если параллельный заказ задел те же товары),
    // поэтому всё, что он делает, — только через session и без побочных эффектов снаружи
    const order = await session.withTransaction(async () => {
      // 1. Берём товары целиком: остатки — для проверки, названия и цены — для заказа
      const found = await products
        .find({ _id: { $in: items.map((i) => i.productId) } }, { session })
        .toArray();

      const problems: IOrderProblem[] = [];
      for (const { productId, count } of items) {
        const product = found.find((p) => p._id.equals(productId));
        const available = product?.quantity ?? 0;
        if (available < count) {
          problems.push({
            productId: productId.toString(),
            title: product?.title ?? null,
            requested: count,
            available,
          });
        }
      }
      if (problems.length > 0) throw new NotEnoughStockError(problems);

      // 2. Списываем. Условие quantity >= count стоит и в самом запросе: проверка и списание —
      //    одна операция, так что в минус остаток не уйдёт даже при одновременных заказах
      for (const { productId, count } of items) {
        const result = await products.updateOne(
          { _id: productId, quantity: { $gte: count } },
          { $inc: { quantity: -count } },
          { session },
        );
        if (result.modifiedCount === 0) {
          // Остаток успел измениться между шагами 1 и 2 — откатываем всё
          throw new NotEnoughStockError([
            { productId: productId.toString(), title: null, requested: count, available: 0 },
          ]);
        }
      }

      // 3. Сохраняем заказ. Название, картинку и цены копируем: товар потом может измениться,
      //    а в истории должно остаться, как было в момент покупки.
      //    Цены — те же, что на карточке (getProductPrices). Берём обычную цену: карты покупателя
      //    у пользователя пока нет. Когда появится — здесь выбирать cardPrice
      const date = new Date();
      const orderItems: IOrderItemDocument[] = items.map(({ productId, count }) => {
        // После шага 1 все товары точно найдены, иначе мы бы уже вышли с 409
        const product = toProduct(found.find((p) => p._id.equals(productId))!);
        const { price } = getProductPrices(product);
        return {
          productId,
          title: product.title,
          img: product.img,
          basePrice: product.basePrice,
          discountPercent: product.discountPercent ?? 0,
          price,
          count,
          sum: roundPrice(price * count),
          category: product.category
        };
      });

      const newOrder: IOrderDocument = {
        _id: new ObjectId(),
        userId,
        createdAt: date,
        status: "new",
        items: orderItems,
        total: roundPrice(orderItems.reduce((total, item) => total + item.sum, 0)),
      };
      await orders.insertOne(newOrder, { session });

      // 4. Записываем в покупки — отсюда их берёт GET /api/purchases («Покупали раньше»)
      const purchases: IPurchaseDocument[] = items.map(({ productId }) => ({ productId, date }));
      const userResult = await users.updateOne(
        { _id: userId },
        { $push: { purchases: { $each: purchases } } },
        { session },
      );
      // Пользователя нет — бросаем ошибку, чтобы транзакция откатила и списание товаров
      if (userResult.matchedCount === 0) throw new UserNotFoundError();

      return newOrder;
    });

    return NextResponse.json(toOrder(order), { status: 201 });
  } catch (error) {
    if (error instanceof NotEnoughStockError) {
      return NextResponse.json(
        { error: "Некоторых товаров не хватает", problems: error.problems },
        { status: 409 },
      );
    }
    if (error instanceof UserNotFoundError) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }
    console.error("Ошибка при оформлении заказа:", error);
    return NextResponse.json({ error: "Не удалось оформить заказ" }, { status: 500 });
  } finally {
    await session.endSession();
  }
}
