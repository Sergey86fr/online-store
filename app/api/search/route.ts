import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/products";
import { escapeRegExp, SEARCH_MIN_LENGTH, SEARCH_PRODUCTS_LIMIT } from "@/lib/search";
import { IProductDocument, ProductCategory } from "@/types/product";
import { ISearchResponse } from "@/types/search";

// GET /api/search?q=моло — подсказки для поиска в шапке
// Ответ: { category, products } (см. ISearchResponse)
//   category — категория, в названии которой есть запрос («Молочная продукция»),
//              а если такой нет — категория первого найденного товара («йогурт» → молочная)
//   products — до SEARCH_PRODUCTS_LIMIT товаров, в названии которых есть запрос (в любом месте, без учёта регистра)
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (query.length < SEARCH_MIN_LENGTH) {
    return NextResponse.json(
      { error: `Запрос должен быть не короче ${SEARCH_MIN_LENGTH} символов` },
      { status: 400 },
    );
  }

  const lowerQuery = query.toLowerCase();

  try {
    const db = await getDb();
    const products = await db
      .collection<IProductDocument>("products")
      .find({ title: { $regex: escapeRegExp(query), $options: "i" } })
      .project<Pick<IProductDocument, "_id" | "title" | "category">>({ title: 1, category: 1 })
      .sort({ title: 1, _id: 1 })
      .limit(SEARCH_PRODUCTS_LIMIT)
      .toArray();

    const categorySlug =
      (Object.keys(PRODUCT_CATEGORY_LABELS) as ProductCategory[]).find((slug) =>
        PRODUCT_CATEGORY_LABELS[slug].toLowerCase().includes(lowerQuery),
      ) ?? products[0]?.category;

    const response: ISearchResponse = {
      category: categorySlug
        ? { slug: categorySlug, label: PRODUCT_CATEGORY_LABELS[categorySlug] }
        : null,
      products: products.map(({ _id, title, category }) => ({ id: _id.toString(), title, category })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Ошибка поиска товаров:", error);
    return NextResponse.json({ error: "Не удалось выполнить поиск" }, { status: 500 });
  }
}
