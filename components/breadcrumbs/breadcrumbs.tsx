"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Arrow from "../../public/images/icons/arrow-rigth.svg"
import { PRODUCT_CATEGORY_LABELS } from "@/lib/products";

export const SEGMENT_LABELS: Record<string, string> = {
  catalog: "Каталог",
  articles: "Статьи",
  promotions: "Акции",
  newProducts: "Новинки",
  purchases: "Покупки",
  orders: "Заказы",
  // /catalog/dairy → «Молочная продукция» и т.д.
  ...PRODUCT_CATEGORY_LABELS,
};

interface IBreadCrumb {
  href: string;
  label: string;
}
const HOME_CRUMB: IBreadCrumb = {
  href: "/",
  label: "Главная",
};

const getCrumbs = (pathname: string): IBreadCrumb[] => {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((s, index) => ({
    href: `/${segments.slice(0, index + 1).join("/")}`,
    label: SEGMENT_LABELS[s] ?? decodeURIComponent(s),
  }));

  return [HOME_CRUMB, ...crumbs];
};

const Breadcrumbs = () => {
  const pathname = usePathname();

  const crumbs = getCrumbs(pathname);

  if (crumbs.length < 2) return null;

  return (
    <nav aria-label="Хлебные крошки" className=" w-[clamp(300px,95vw,1208px)] p-0 mobile:p-3">
      <ol  className="mt-2 md:mt-4 xl:mt-6 flex flex-wrap items-center gap-2 text-[10px] md:text-xs">
        {crumbs.map((c, index) => {
          const isLast = index === crumbs.length - 1;

          return (

          <li className="flex items-center gap-2" key={c.href}>
           {
            isLast? <span className="text-[#8F8F8F]" aria-current="page">{c.label}</span>: <><Link className="text-[#414141] hover:text-(--color-primary)" href={c.href}>{c.label}</Link>< Arrow aria-hidden="true" className='text-[#414141]' /></>
           }
          </li>
          )
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
