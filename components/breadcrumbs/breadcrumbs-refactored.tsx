"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Arrow from "@/public/images/icons/arrow-rigth.svg";

// Подписи для сегментов URL. Ключ — сегмент без слэшей, как он есть в адресе.
export const SEGMENT_LABELS: Record<string, string> = {
  catalog: "Каталог",
  articles: "Статьи",
  promotions: "Акции",
  newProducts: "Новинки",
  purchases: "Покупки",
};

interface ICrumb {
  href: string;
  label: string;
}

const HOME_CRUMB: ICrumb = { href: "/", label: "Главная" };

// "/catalog/milk" → [Главная "/", Каталог "/catalog", milk "/catalog/milk"]
const getCrumbs = (pathname: string): ICrumb[] => {
  // filter(Boolean) убирает пустые строки: "/a/b".split("/") → ["", "a", "b"]
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => ({
    href: "/" + segments.slice(0, index + 1).join("/"),
    // decodeURIComponent — чтобы кириллица в адресе не показывалась как %D0%BC...
    label: SEGMENT_LABELS[segment] ?? decodeURIComponent(segment),
  }));

  return [HOME_CRUMB, ...crumbs];
};

const BreadcrumbsRefactored = () => {
  const pathname = usePathname();
  const crumbs = getCrumbs(pathname);

  // На главной крошки не нужны: там была бы одна «Главная»
  if (crumbs.length < 2) return null;

  return (
    <nav aria-label="Хлебные крошки">
      <ol className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={crumb.href} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="text-gray-400">
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.href}
                    className="text-gray-700 hover:text-(--color-primary)"
                  >
                    {crumb.label}
                  </Link>
                  <Arrow aria-hidden="true" className="text-gray-700" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadcrumbsRefactored;
