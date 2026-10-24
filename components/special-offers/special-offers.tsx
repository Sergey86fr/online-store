import Image from "next/image";
import Card from "../../public/images/special-offers/loyalty-card.png";
import Cart from "../../public/images/special-offers/shopping-cart.png";
import Plus from "../../public/images/special-offers/plus.svg";
import Ruble from "../../public/images/special-offers/ruble.svg";
import { ReactNode } from "react";


type OfferCardProps = {
  title: string;
  text: string;
  className: string;
  textClassName?: string;
  children: ReactNode;
};

const OfferCard = ({
  title,
  text,
  className,
  textClassName = "",
  children,
}: OfferCardProps) => (
  <div
    className={`relative flex flex-1 overflow-hidden rounded-sm p-5 min-h-[170px] xl:min-h-[200px] ${className}`}
  >
    <div className={`relative z-20 flex-1 ${textClassName}`}>
      <h3 className="text-xl font-bold md:text-lg xl:text-2xl">{title}</h3>
      <p className="mt-1.5 text-xs xl:text-base">{text}</p>
    </div>
    {children}
  </div>
);

const SpecialOffers = () => {

  
  const decor = [
  { Icon: Plus, className: "size-2.5 left-5 bottom-4" },
  { Icon: Plus, className: "size-3 left-[35%] top-5" },
  { Icon: Plus, className: "size-4 left-[55%] bottom-5" },
  { Icon: Plus, className: "size-4 bottom-4 right-1" },
  { Icon: Plus, className: "size-5 right-15 bottom-5" },
  { Icon: Plus, className: "size-5 top-7 right-24" },
  { Icon: Plus, className: "size-8 top-[55%] right-12" },
  { Icon: Plus, className: "size-10 top-[52%] right-[35%]" },
  { Icon: Ruble, className: "size-7 bottom-6 right-[30%]" },
  { Icon: Ruble, className: "size-8 bottom-5 right-15" },
  { Icon: Ruble, className: "size-13 top-7 right-[30%]" },
  { Icon: Ruble, className: "size-14 top-2 right-[10%]" },
];


  return (
    <section className="w-full">
      <h2 className="text-2xl font-bold xl:text-4xl mb-4 md:mb-8 xl:mb-10">
        Специальные предложения
      </h2>
      <div className="flex flex-col gap-4 md:flex-row md:gap-8 xl:gap-10">
         <OfferCard
          title="Оформите карту «Северяночка»"
          text="И получайте бонусы при покупке в магазинах и на сайте"
          className="bg-[#FCD5BA] hover:shadow-(--shadow-primary)"
          textClassName="min-w-[180px]"
        >
          <div className="shrink-0 overflow-hidden">
            <Image
              src={Card}
              alt=""
              sizes="(min-width: 1280px) 250px, 220px"
              className="h-[160px] w-[220px] object-cover xl:h-[200px] xl:w-[250px]"
            />
          </div>
        </OfferCard>

        <OfferCard
          title="Покупайте акционные товары"
          text="И получайте вдвое больше бонусов"
          className="bg-[#E5FFDE] hover:shadow-(--shadow-secondary)"
        >
          <div className="relative z-10 h-[126px] w-[132px] shrink-0 xl:h-[186px] xl:w-[193px]">
            <Image
              src={Cart}
              alt=""
              fill
              sizes="(min-width: 1280px) 193px, 132px"
              className="object-contain"
            />
          </div>

          {decor.map(({ Icon, className }, i) => (
            <Icon
              key={i}
              aria-hidden="true"
              className={`pointer-events-none absolute ${className}`}
            />
          ))}
        </OfferCard>
        
      </div>
    </section>
  );
};

export default SpecialOffers;
