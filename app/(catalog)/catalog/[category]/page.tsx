import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { isProductCategory, PRODUCT_CATEGORY_LABELS } from "@/lib/products";
import { getProducts } from "@/lib/get-products";
import { getPriceRange } from "@/lib/get-price-range";
import { IProductFilters, parsePrice, toFiltersQuery } from "@/lib/product-filters";
import CategoryFilter from "@/components/category-filter/category-filter";
import ActiveFilters from "@/components/active-filters/active-filters";
import CategoryProducts from "@/components/category-products/category-products";

// Как в макете: 2 ряда по 3 карточки. 6 делится и на 2 колонки (мобильный), и на 3 — без дыр в сетке
const LIMIT = 6;

// Next передаёт в страницу ОДИН объект props, а params и searchParams — его поля (оба Promise)
interface ICategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string; minPrice?: string; maxPrice?: string; inStock?: string }>;
}

// Заголовок вкладки: «Молочная продукция», а для неизвестной категории — «Страница не найдена»
export const generateMetadata = async ({ params }: ICategoryPageProps): Promise<Metadata> => {
  const { category } = await params;
  return {
    title: isProductCategory(category) ? PRODUCT_CATEGORY_LABELS[category] : "Страница не найдена",
  };
};

const CategoryPageRefactored = async ({ params, searchParams }: ICategoryPageProps) => {
  const { category } = await params;

  // /catalog/pizza — такой категории нет: notFound() отдаёт настоящую 404
  if (!isProductCategory(category)) notFound();

  const { page: pageParam, ...filterParams } = await searchParams;
  const newPage = pageParam === undefined ? undefined : Number(pageParam);

  // console.log(filterParams, 'params из строки 1');
  

  // Кривые значения (?minPrice=abc) просто игнорируем — фильтр не применяется
  const filters: IProductFilters = {
    minPrice: parsePrice(filterParams.minPrice),
    maxPrice: parsePrice(filterParams.maxPrice),
    inStock: filterParams.inStock === "true",
  };
  const filtersQuery = toFiltersQuery(filters);

  // console.log(filtersQuery, 'фильтры преобразованные 2 ');
  
  const apiQuery = `category=${category}${filtersQuery ? `&${filtersQuery}` : ""}`;
  const basePath = `/catalog/${category}`;
  const withFilters = (extra = "") =>
    `${basePath}${filtersQuery || extra ? "?" : ""}${[filtersQuery, extra].filter(Boolean).join("&")}`;

  // ?page=-3 или ?page=abc — на первую страницу (фильтры сохраняем)
  if (newPage !== undefined && (!Number.isInteger(newPage) || newPage < 1)) {
    redirect(withFilters());
  }

  // Товары и границы цен независимы — грузим одновременно
  const [{ items, page, totalPages }, priceRange] = await Promise.all([
    getProducts(`/api/products?${apiQuery}`, { next: { revalidate: 3600 } }, newPage, LIMIT),
    getPriceRange(category),
  ]);

  // ?page=999 — страниц меньше, отправляем на последнюю
  if (totalPages > 0 && page > totalPages) {
    redirect(withFilters(`page=${totalPages}`));
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl xl:text-[40px] font-bold mb-4 md:mb-8 xl:mb-10">
        {PRODUCT_CATEGORY_LABELS[category]}
      </h1>

      {/* Мобильный/планшет: фильтр (свёрнут) над товарами; десктоп: колонка 272px слева, как в макете */}
      <div className="flex flex-col xl:flex-row gap-6 xl:gap-10">
        <aside className="xl:w-68 xl:shrink-0">
          {/* key: при смене фильтров (например, крестик на плашке) поля формы сбрасываются под новый URL */}
          <CategoryFilter
            key={filtersQuery}
            action={basePath}
            bounds={priceRange}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            inStock={filters.inStock}
          />
        </aside>

        <div className="flex-1 min-w-0 flex flex-col gap-6 xl:gap-10">
          <ActiveFilters basePath={basePath} filters={filters} />
          <CategoryProducts
            key={`${filtersQuery}|${page}`}
            initialItems={items}
            page={page}
            totalPages={totalPages}
            limit={LIMIT}
            basePath={basePath}
            apiQuery={apiQuery}
            filtersQuery={filtersQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryPageRefactored;
