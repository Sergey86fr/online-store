
import FavoritesList from "@/components/favorites-list/favorites-list";
import ProductCard from "@/components/product-card/product-card";
import useFavorites from "@/hooks/useFavorites";
import { getProducts } from "@/lib/get-products";
import {
  IProductFilters,
  parsePrice,
  toFiltersQuery,
} from "@/lib/product-filters";
import { Metadata } from "next";

const LIMIT = 6;

export const metadata: Metadata = {
  title: "Избранное",
  description: "Товары, которые вы отметили сердечком",
  robots: { index: false },
};

interface IFavoritesPageProps {
  searchParams: Promise<{
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
  }>;
}

const FavoritesPage = async ({ searchParams }: IFavoritesPageProps) => {
  const { page: pageParam, ...filterParams } = await searchParams;
  const newPage = pageParam === undefined ? undefined : Number(pageParam);

  const filters: IProductFilters = {
    minPrice: parsePrice(filterParams.minPrice),
    maxPrice: parsePrice(filterParams.maxPrice),
    inStock: filterParams.inStock === "true",
  };

  const filtersQuery = toFiltersQuery(filters);

  const { items, total, page, limit, totalPages } = await getProducts(
    `/api/favorites?${filtersQuery}`,
    { cache: "no-store" },
    newPage,
    LIMIT,
  );

  

  // console.log(items, total, page, limit, totalPages, 'favorites');

  return (
    <div>
      <h2>Избранное</h2>
      <div>
        <aside></aside>
        <FavoritesList key={`${page}`} initialItems={items} />
      </div>
    </div>
  );
};

export default FavoritesPage;
