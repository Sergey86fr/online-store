import Image from "next/image";
import Link from "next/link";
import Cart from "../../public/images/header/shopping-cart.svg";
import Info from "../../public/images/icons/info.svg";
import RatingRefactored from "../rating/rating-refactored";
import ShareButton from "../share-button/share-button";
import SimilarProducts from "../similar-products/similar-products";
import {
  formatPrice,
  getProductPrices,
  LOYALTY_CARD_DISCOUNT,
  PRODUCT_CATEGORY_LABELS,
} from "@/lib/products";
import { formatReviewsCount } from "@/lib/reviews";
import { IProduct } from "@/types/product";

interface IProductDetailsProps {
  product: IProduct;
  rating: number; // средняя по отзывам, а если отзывов нет — rating из товара
  reviewsCount: number;
  similar: IProduct[];
}

// Верх страницы товара: название, оценка, картинка, цены, «В корзину», характеристики и «Похожие».
// Сетка: мобильный — всё в столбик; планшет — картинка | цены, «Похожие» строкой ниже;
// десктоп — картинка | цены | «Похожие» колонкой (584 + 376 + 168 + отступы = 1208, как в макете)
const ProductDetails = ({ product, rating, reviewsCount, similar }: IProductDetailsProps) => {
  const { title, img, category, description, discountPercent = 0, isNew, quantity, weight, volume } = product;
  const { price, cardPrice } = getProductPrices(product);
  const isOutOfStock = quantity === 0;

  const specs = [
    { label: "Категория", value: <Link href={`/catalog/${category}`} className="hover:text-(--color-primary)">{PRODUCT_CATEGORY_LABELS[category]}</Link> },
    { label: "Упаковка", value: weight ?? volume },
    { label: "Наличие", value: isOutOfStock ? "Нет в наличии" : "В наличии" },
  ].filter((spec) => spec.value);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl md:text-2xl font-bold leading-normal text-[#414141]">{title}</h1>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <a href="#reviews" className="h-8 flex items-center gap-2 text-[#414141] hover:text-(--color-primary) duration-300">
          <RatingRefactored rating={rating} size={16} />
          <span className="text-sm leading-normal underline">
            {reviewsCount > 0 ? formatReviewsCount(reviewsCount) : "Нет отзывов"}
          </span>
        </a>
        <ShareButton title={title} />
      </div>

      <div className="grid gap-4 md:grid-cols-[352px_1fr] md:gap-10 xl:grid-cols-[584px_376px_168px]">
        <div className="relative h-62 xl:h-124 bg-white rounded-sm shadow-[1px_2px_4px_0px_rgba(0,0,0,0.1)]">
          <Image
            src={img}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 352px, 584px"
            className={`object-contain ${isOutOfStock ? "opacity-40" : ""}`}
          />
          {discountPercent > 0 && (
            <span className="absolute top-2.5 right-2.5 xl:top-5 xl:right-5 px-2 py-1 rounded-sm bg-(--color-primary) text-xs md:text-base leading-normal text-white">
              -{discountPercent}%
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col gap-4">
            {/* Цены: слева обычная, справа крупно — по карте. На новинки карта не действует — одна цена */}
            <div className="flex justify-between items-start gap-4">
              {isNew ? (
                <p className="text-2xl xl:text-4xl font-bold leading-normal text-[#414141]">{formatPrice(price)} ₽</p>
              ) : (
                <>
                  <div className="pt-1 xl:pt-3">
                    <p className="text-xl md:text-lg xl:text-2xl leading-normal text-[#606060]">{formatPrice(price)} ₽</p>
                    <p className="text-[8px] md:text-xs leading-normal text-[#BFBFBF]">Обычная цена</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-2xl xl:text-4xl font-bold leading-normal text-[#414141]">{formatPrice(cardPrice)} ₽</p>
                    <div className="flex items-center gap-2 text-[8px] md:text-xs leading-normal text-[#BFBFBF]">
                      С картой Северяночки
                      {/* Подсказка по наведению и по фокусу с клавиатуры */}
                      <button type="button" aria-describedby="card-price-hint" className="group relative cursor-help text-[#414141]">
                        <Info aria-hidden="true" className="w-6 h-6" />
                        <span className="sr-only">Что за цена по карте</span>
                        <span
                          id="card-price-hint"
                          role="tooltip"
                          className="invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100 duration-200 absolute right-0 top-full z-10 mt-1 w-56 p-2 rounded-sm bg-white shadow-(--shadow-default) text-xs text-left text-[#414141]"
                        >
                          Скидка {LOYALTY_CARD_DISCOUNT}% по карте лояльности. На новинки не действует
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* TODO: корзины пока нет — кнопка ничего не делает, как и в ProductCard */}
            <button
              type="button"
              disabled={isOutOfStock}
              className="w-full h-10 md:h-15 flex items-center gap-2 px-4 rounded-sm bg-(--color-primary) text-base md:text-2xl leading-normal text-white enabled:hover:shadow-(--shadow-primary) enabled:active:shadow-(--shadow-button-active) duration-300 cursor-pointer disabled:bg-[#BFBFBF] disabled:cursor-not-allowed"
            >
              <Cart aria-hidden="true" className="w-6 h-6 md:w-8 md:h-8 shrink-0" />
              <span className="flex-1 text-center">{isOutOfStock ? "Товар временно закончился" : "В корзину"}</span>
            </button>
          </div>

          <dl className="flex flex-col gap-1 text-[8px] md:text-xs leading-normal text-[#414141]">
            {specs.map(({ label, value }) => (
              <div key={label} className="grid grid-cols-[161px_1fr] gap-10 px-2 py-1 odd:bg-[#F3F2F1]">
                <dt>{label}</dt>
                <dd className="font-bold">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="text-xs md:text-sm leading-normal text-[#606060]">{description}</p>
        </div>

        <div className="md:col-span-2 xl:col-span-1">
          <SimilarProducts products={similar} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
