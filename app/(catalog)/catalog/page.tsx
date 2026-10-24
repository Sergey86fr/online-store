import Categories from "@/components/categories/categories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Категории товаров Северяночки",
};

const CatalogPage = () => {
  return (
    <div className="w-full">
      {/* Как заголовки секций (ProductsSection): размер и отступ до сетки */}
      <h1 className="text-2xl xl:text-[40px] font-bold mb-4 md:mb-8 xl:mb-10">Каталог</h1>
      <Categories />
    </div>
  );
};

export default CatalogPage;
