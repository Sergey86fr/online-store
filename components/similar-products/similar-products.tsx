import Image from "next/image";
import Link from "next/link";
import { formatPrice, getProductHref, getProductPrices } from "@/lib/products";
import { IProduct } from "@/types/product";

// «Похожие» на странице товара: маленькие карточки (картинка + цена) из той же категории.
// Мобильный и планшет — строка из 4 карточек под товаром, десктоп — колонка справа (как в макете)
const SimilarProducts = ({ products }: { products: IProduct[] }) => {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="similar-title" className="flex flex-col gap-2 xl:h-full">
      <h2 id="similar-title" className="text-xs md:text-base leading-normal text-[#606060]">
        Похожие
      </h2>
      <ul className="grid grid-cols-4 xl:grid-cols-1 xl:grid-rows-4 gap-2 md:gap-4 xl:flex-1">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={getProductHref(product.id)}
              className="h-15.5 md:h-39.5 xl:h-full flex flex-col bg-white rounded-sm overflow-hidden shadow-[1px_2px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-(--shadow-primary) duration-300"
            >
              <div className="relative flex-1 min-h-0">
                <Image src={product.img} alt="" fill sizes="(max-width: 768px) 80px, 172px" className="object-contain" />
              </div>
              {/* Название — для экранных дикторов: в карточке видна только цена */}
              <span className="sr-only">{product.title}</span>
              <span className="px-1 py-0.5 md:p-2.5 text-[10px] md:text-lg font-bold leading-normal text-[#414141]">
                {formatPrice(getProductPrices(product).price)} ₽
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SimilarProducts;
