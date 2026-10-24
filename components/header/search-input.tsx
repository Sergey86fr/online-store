import Search from "../../public/images/header/search.svg";

const SearchInput = () => {
  return (
    <div className="w-full min-w-0 md:min-w-65 h-10 border py-2 px-4 border-(--color-secondary) rounded-sm flex items-center focus-within:shadow-(--shadow-secondary) ">
      <input type="text" className="text-base outline-none text-[#8F8F8F] leading-normal placeholder:text-[#8F8F8F] w-full" placeholder="Найти товар" />
      <button className="cursor-pointer">
        <Search alt="Поиск" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SearchInput;
