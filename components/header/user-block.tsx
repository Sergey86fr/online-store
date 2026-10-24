import Profile from "./profile";
import TopMenu from "./top-menu";

const UserBlock = () => {
  return (
    <nav
      aria-label="Основное меню"
      className="bg-white flex items-center justify-between   md:justify-center fixed bottom-0 left-0 right-0 md:static  shadow-default md:shadow-none text-[8px] md:text-[12px] gap-10 md:gap-6 py-1  px-4 md:py-2 xl:py-3 xl:px-5"
    >
      <TopMenu />
      <Profile />
    </nav>
  );
};

export default UserBlock;
