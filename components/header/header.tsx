import LogoBlock from "./logo-block";
import SearchBlock from "./search-block";
import UserBlock from "./user-block";

const Header = () => {
  return (
    <header className="w-full relative   gap-5 xl:gap-10   flex flex-col md:flex-row justify-center items-center bg-white z-10 md:shadow-default">
      <div className="flex w-full  md:flex-1 py-2 px-4 md:py-4 md:px-5 items-center gap-5 xl:gap-10 shadow-default md:shadow-none">
        <LogoBlock />
        <SearchBlock />
      </div>
      <UserBlock />
    </header>
  );
};

export default Header;
//28.40