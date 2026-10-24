import Logo from "../../public/images/footer/logo.svg";
import Insta from "../../public/images/footer/instagram.svg";
import Vk from "../../public/images/footer/vkontakte.svg";
import FB from "../../public/images/footer/facebook.svg";
import OK from "../../public/images/footer/ok.svg";
import Phone from "../../public/images/footer/phone.svg";
import LogoDesign from "../../public/images/footer/logo-design.svg";

const Footer = () => {
  return (
    <footer className="mt-auto pb-14 md:pb-0">
      <div className="py-10 px-7 md:py-8 md:px-4 xl:py-6
       bg-[#F9F4E2] bg-[url('/images/footer/footer-bg.svg')] bg-repeat 
       bg-contain overflow-hidden w-full 
       grid [grid-template-areas:'logo_social'_'logo_phone'_'links_links'_'design_design']
       [grid-template-columns:1fr_1fr]
       md:[grid-template-areas:'logo_links_social_phone'_'logo_links_social_design'] 
       md:[grid-template-columns:64px_1fr_56px_152px]
       md:items-center
       xl:[grid-template-areas:'logo_links_social_phone'_'._._._design']
       xl:[grid-template-columns:64px_1fr_145px_152px]
        justify-center gap-y-6 md:gap-x-10 md:gap-y-2 ">
        <div className="[grid-area:logo]">
          <Logo className="w-[93px] h-[64px] md:w-[64px] md:h-[44px]" />
        </div>
        <div className="[grid-area:social] flex  md:flex-wrap  justify-between ">
          <a
            href={"https://www.instagram.com"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Insta />
          </a>
          <a
            href={"https://www.vk.ru"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Vk />
          </a>
          <a
            href={"https://www.facebook.com"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FB />
          </a>
          <a
            href={"https://www.ok.ru"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <OK />
          </a>
        </div>
        <div className="[grid-area:phone] flex items-center gap-2">
          <Phone />
          <span className="text-base">8 800 777 33 33</span>
        </div>

        <div className="[grid-area:links] ">
          <ul className="flex flex-wrap gap-4 xl:gap-8 text-xs">
            <li>
              <a href={""}>О компании</a>
            </li>
            <li>
              <a href={""}>Контакты</a>
            </li>
            <li>
              <a href={""}>Статьи</a>
            </li>
            <li>
              <a href={""}>Вакансии</a>
            </li>
            <li>
              <a href={""}>Политика обработки персональных данных</a>
            </li>
          </ul>
        </div>
        <div className="[grid-area:design] flex gap-2 items-center">
          <span className="text-xs">Дизайн</span>
          <LogoDesign />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
