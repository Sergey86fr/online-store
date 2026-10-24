import Image from "next/image";
import Logo from "../../public/images/header/logo.svg";
import logoText from "../../public/images/header/logo-text.png";
import Link from "next/link";

const LogoBlock = () => {
  return (
    <Link href={"/"} className="flex items-center gap-3 cursor-pointer">
        <Logo className=" w-10 h-8 md:w-12 md:h-10 xl:w-10 xl:h-8" alt="логотип"/>
      <div className="relative hidden lg:block w-25 h-2.5  ">
        <Image src={logoText} alt="название бренда" fill  sizes="100px"  />
      </div>
    </Link>
  );
};

export default LogoBlock;
