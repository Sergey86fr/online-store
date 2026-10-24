import { isProductCategory } from "@/lib/products";
import { getProducts } from "@/lib/get-products";
import ProductCard from "@/components/product-card/product-card";
import { notFound, redirect } from "next/navigation";
import { IProductFilters, parsePrice } from "@/lib/product-filters";
import Pagination from "@/components/pagination/pagination";

interface ICategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    inStock?: string;
  }>;
}

const LIMIT = 6;

const CategoryPage = async ({ params, searchParams }: ICategoryPageProps) => {
  const { category } = await params;
  const { page: pageParam, ...filterParams } = await searchParams;

  if (!isProductCategory(category)) notFound();

  const newPage = pageParam !== undefined ? Number(pageParam) : undefined;
  const searchFilter: IProductFilters = {
    minPrice: parsePrice(filterParams.minPrice),
    maxPrice: parsePrice(filterParams.maxPrice),
    inStock: filterParams.inStock === "true",
  };

  const toFiltersQuery = (search: IProductFilters) => {
    const params = new URLSearchParams();
    if (search.minPrice !== undefined)
      params.set("minPrice", String(search.minPrice));
    if (search.maxPrice !== undefined)
      params.set("maxPrice", String(search.maxPrice));
    if (search.inStock) params.set("inStock", "true");
    return params.toString();
  };

  const filterQuery = toFiltersQuery(searchFilter);

  const apiQuery = `category=${category}${filterQuery ? `&${filterQuery}` : ""}`;
  const basePath = `/catalog/${category}`;

  if (newPage !== undefined && (!Number.isInteger(newPage) || newPage < 1))
    redirect(filterQuery ? `${basePath}?${filterQuery}` : basePath);

  const { items, page, totalPages } = await getProducts(
    `/api/products?${apiQuery}`,
    { next: { revalidate: 3600 } },
    newPage,
    LIMIT,
  );

  if (totalPages > 0 && page > totalPages)
    redirect(
      `${basePath}?${[filterQuery, `page=${totalPages}`].filter(Boolean).join("&")}`,
    );

  const getHref = (page: number) => {
    const params = new URLSearchParams(filterQuery);
    if (page > 1) {
      params.set("page", String(page));
    }

    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <div>
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            <ProductCard product={i} />
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={totalPages} getHref={getHref} />
    </div>
  );
};

export default CategoryPage;


