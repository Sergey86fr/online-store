import Link from "next/link";
import Burger from "../../public/images/header/burger-menu.svg";
import SearchInput from "./search-input";
import CatalogMenu from "./catalog-menu";

const SearchBlock = () => {
  return (
    <div className="flex gap-4 grow min-w-0">
      {/* group — наведение/фокус на кнопке открывает CatalogMenu */}
      <div className="group">
        <Link className="md:w-10 xl:w-35 hidden md:flex  p-2 bg-(--color-secondary) hover:shadow-(--shadow-secondary) active:shadow-(--shadow-button-active) duration-300 cursor-pointer rounded-sm   gap-4" href={"/catalog"}>
          <Burger alt="меню" className="w-6 h-6" />
          <span className="text-base hidden lg:block font-normal text-white leading-normal ">Каталог</span>
        </Link>
        <CatalogMenu />
      </div>
      <SearchInput />
    </div>
  );
};

export default SearchBlock;
