import Image from "next/image";
import avatar from "../../public/images/header/avatar.png";
import Arow from "../../public/images/header/arrow.svg";

const Profile = () => {
  return (
    <div className="flex  items-center gap-6 lg:min-w-55">
      <div className="flex gap-2.5 items-center cursor-pointer">
        <Image
          className="object-contain w-12.5 h-12.5"
          src={avatar}
          alt="аватар"
          width={50}
          height={50}
        />
        <span className="hidden lg:block">Алексей</span>
      </div>
      <button className="hidden lg:block cursor-pointer hover:text-[#bfbfbf] ">
        <Arow alt="Меню профиля" className="w-6 h-auto" />
      </button>
    </div>
  );
};

export default Profile;
