import Image from "next/image";
import Heart from "../../public/images/icons/heart.svg";
import { IProduct } from "@/types/product";
import Rating from "../rating/rating";
import { getProductHref, LOYALTY_CARD_DISCOUNT } from "@/lib/products";
import Link from "next/link";

interface IProductCartProps {
  product: IProduct;
  className?: string;
}

const formatPrice = (price: number) => price.toFixed(2).replace(".", ",");

const ProductCard = ({ product, className = "" }: IProductCartProps) => {
  const {
    basePrice,
    discountPercent = 0,
    isNew,
    description,
    rating,
    img,
    title,
    quantity,
    id,
    category,
  } = product;
  const finalPrice = basePrice * (1 - discountPercent / 100);
  const isOutOfStock = quantity === 0;

  const cardPrice = isNew
    ? finalPrice
    : finalPrice * (1 - LOYALTY_CARD_DISCOUNT / 100);

  return (
    <div
      className={`w-full relative max-w-40 h-89 md:max-w-none md:w-56  xl:w-68 bg-white rounded-sm hover:shadow-(--shadow-primary) overflow-hidden flex flex-col  ${className}`}
    >
      <div className="w-full h-40 relative">
        <Image
          src={img}
          alt={title}
          className={`object-contain object-top ${isOutOfStock ? "opacity-40" : ""}`}
          fill
          sizes="(max-width: 768px) 160px, (max-width: 1200px) 224px, 272px"
        />

        {isOutOfStock && (
          <div className="absolute inset-0 flex justify-center items-center px-3">
            <span className="px-2 py-1 bg-white/90 rounded-sm text-xs md:text-base font-bold text-[#414141] text-center">
              Товар временно закончился
            </span>
          </div>
        )}

        <button className="bg-[#F3F2F1] z-10 hover:bg-[#FCD5BA] opacity-50 duration-300  w-8 h-8 absolute top-3 right-3 flex justify-center items-center rounded-sm cursor-pointer">
          <Heart className="w-6 h-6" alt="добавить в избранное" />
        </button>

        {discountPercent > 0 && (
          <div className="w-11.5 h-6 md:w-14 md:h-8  bg-(--color-primary) rounded-sm flex justify-center items-center absolute left-2.5 bottom-2.5">
            <span className="text-xs md:text-base text-white">
              -{discountPercent}%
            </span>
          </div>
        )}

        {isNew && (
          <div className="h-6 md:h-8 px-2 bg-(--color-secondary) rounded-sm flex justify-center items-center absolute left-2.5 top-2.5">
            <span className="text-xs md:text-base text-white">Новинка</span>
          </div>
        )}
      </div>
      <div className="p-2 flex flex-col h-[194px] ">
        <div className="flex justify-between">
          <div className="flex flex-col h-10  ">
            <span className="text-sm font-bold md:text-lg ">
              {formatPrice(cardPrice)} ₽
            </span>
            {!isNew && (
              <span className="text-[8px] text-[#BFBFBF]">С картой</span>
            )}
          </div>
          {!isNew && (
            <div className="flex flex-col   h-[33px] md:h-[40px]">
              <span className="text-xs font-normal md:text-base ">
                {formatPrice(finalPrice)} ₽
              </span>
              <span className="text-[8px] text-[#BFBFBF] text-right">
                Обычная
              </span>
            </div>
          )}
        </div>
        <Link className="after:absolute after:inset-0" href={getProductHref(category, id)}>
          <p className="mb-2  text-xs md:text-base  grow line-clamp-3">
            {description}
          </p>
        </Link>
        <div className="mt-auto flex flex-col gap-2 ">
          <Rating rating={rating} />
          {/* enabled: — ховер и нажатие работают только у активной кнопки, у disabled остаётся серая рамка */}
          <button
            type="button"
            disabled={isOutOfStock}
            className=" w-full z-10  h-10 text-base text-(--color-secondary) border border-(--color-secondary) bg-transparent rounded-sm enabled:hover:text-white enabled:hover:bg-(--color-primary) enabled:hover:border-transparent enabled:active:shadow-(--shadow-primary) transition-all duration-300 cursor-pointer select-none disabled:cursor-not-allowed disabled:text-[#BFBFBF] disabled:border-[#BFBFBF]"
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
