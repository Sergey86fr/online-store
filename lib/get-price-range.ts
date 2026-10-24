import { ProductCategory } from "@/types/product";

export interface IPriceRange {
  min: number;
  max: number;
}

// Границы цен в категории для ползунка фильтра.
// При ошибке возвращает { min: 0, max: 0 } — фильтр цены тогда просто не показывается
export const getPriceRange = async (category: ProductCategory): Promise<IPriceRange> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/price-range?category=${category}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) {
      throw new Error(`Ошибка загрузки диапазона цен: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(error);
    return { min: 0, max: 0 };
  }
};
