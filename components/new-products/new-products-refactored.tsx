import Arrow from "@/public/images/icons/arrow-rigth.svg";
import data from "@/data/database.json";
import { IProduct } from "@/types/product";
import ProductCard from "../product-card/product-card";

const MAX_PRODUCTS = 4;

// Карточки начиная с этого индекса скрываются на планшете (3 колонки),
// чтобы последняя строка сетки не оставалась неполной
const HIDDEN_ON_TABLET_FROM = 3;

const newProducts: IProduct[] = data.products
  .filter((product) => product.isNew)
  .slice(0, MAX_PRODUCTS);

const NewProductsRefactored = () => {
  return (
    <section className="w-full">
      <div className="flex justify-between">
        <h2 className="text-2xl xl:text-[40px] font-bold">Новинки</h2>
        <button
          type="button"
          className="flex items-center gap-4 cursor-pointer text-[#606060] hover:text-[#bfbfbf] duration-300"
        >
          <span className="text-lg">Все новинки</span>
          <Arrow className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4 md:gap-8 xl:gap-10 mt-4 md:mt-8 xl:mt-10">
        {newProducts.map((product, index) => (
          <li
            key={product.id}
            className={index >= HIDDEN_ON_TABLET_FROM ? "sm:hidden xl:block" : undefined}
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default NewProductsRefactored;
