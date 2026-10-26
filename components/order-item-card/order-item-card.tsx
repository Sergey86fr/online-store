import Image from "next/image";
import Link from "next/link";
import Heart from "../../public/images/icons/heart.svg";
import Cart from "../../public/images/icons/cart.svg";
import { IOrderItem } from "@/types/order";
import { formatPrice, getProductHref } from "@/lib/products";

interface IOrderItemCardProps {
  item: IOrderItem;
}

// Карточка товара внутри заказа. В отличие от ProductCard, цена — та, что была на момент покупки,
// а в левом верхнем углу — сколько штук купили.
// Рейтинга в снимке заказа нет, поэтому звёзд из макета здесь нет
const OrderItemCard = ({ item }: IOrderItemCardProps) => {
  const { productId, title, img, price, count,category  } = item;

  return (
    <div className="w-full h-full bg-white rounded-sm shadow-[1px_2px_4px_0px_rgba(0,0,0,0.1)] hover:shadow-(--shadow-primary) duration-300 overflow-hidden flex flex-col">
      <div className="w-full h-40 relative">
        <Image
          src={img}
          alt=""
          className="object-contain"
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 272px"
        />

        <div className="absolute top-2 left-2 h-8 p-1 flex items-center gap-1 bg-white/80 rounded-sm text-[#414141]">
          <Cart className="w-6 h-6" aria-hidden="true" />
          <span className="text-lg font-bold">
            {count}
            <span className="sr-only"> шт.</span>
          </span>
        </div>

        <button
          type="button"
          aria-label="Добавить в избранное"
          className="bg-[#F3F2F1] hover:bg-[#FCD5BA] opacity-50 duration-300 w-8 h-8 absolute top-2 right-2 flex justify-center items-center rounded-sm cursor-pointer"
        >
          <Heart className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>

      <div className="p-2 flex flex-col gap-2 grow">
        <span className="text-sm md:text-lg font-bold">{formatPrice(price)} ₽</span>
        <Link
          href={getProductHref(category,productId)}
          className="text-xs md:text-base line-clamp-3 grow hover:text-(--color-primary) duration-300"
        >
          {title}
        </Link>
        <button
          type="button"
          className="w-full h-10 text-base text-(--color-secondary) border border-(--color-secondary) rounded-sm hover:text-white hover:bg-(--color-primary) hover:border-transparent active:shadow-(--shadow-primary) transition-all duration-300 cursor-pointer select-none"
        >
          В корзину
        </button>
      </div>
    </div>
  );
};

export default OrderItemCard;
