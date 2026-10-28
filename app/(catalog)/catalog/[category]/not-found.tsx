import Link from "next/link";

const CatalogNotFound = () => {
  return (
    <div className="flex flex-col gap-10 items-center mt-20 ">
      <h2 className="text-2xl  xl:text-[40px] font-semibold text-center">
        Такой категории товара нет!
      </h2>
      <Link
        className="text-sm md:text-base xl:text-lg text-[#606060] hover:text-[#bfbfbf]"
        href={"/catalog"}
      >
        Перейти в категории
      </Link>
    </div>
  );
};

export default CatalogNotFound;
