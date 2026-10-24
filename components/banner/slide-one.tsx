import Image from "next/image";
import products from "../../public/images/bg/products.png";

const SlideOne = () => {
  return (
    <div className="relative bg-[url('/images/bg/banner-bg.svg')] bg-repeat bg-contain overflow-hidden flex justify-center w-full h-full ">
      <div className="absolute inset-0 bg-white/70"></div>
      <div className="flex gap-2 xl:gap-4 items-center relative z-10">
        <div className="relative self-end hidden md:block md:w-50 md:h-33 xl:w-75 xl:h-50">
          <Image src={products} alt="слайд" fill />
        </div>
        <h2 className="text-lg md:text-2xl xl:text-5xl font-bold text-[#414141]">
          Доставка бесплатно от 1000 ₽
        </h2>
      </div>
    </div>
  );
};

export default SlideOne;
