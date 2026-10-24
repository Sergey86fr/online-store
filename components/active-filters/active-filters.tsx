import Link from "next/link";
import X from "../../public/images/icons/x.svg";
import { IProductFilters, toFiltersQuery } from "@/lib/product-filters";

interface IActiveFiltersProps {
  basePath: string; // путь страницы без query, например "/catalog/dairy"
  filters: IProductFilters;
}

const chipClass = "flex items-center gap-2 h-8 pl-2 pr-1 rounded-sm text-xs duration-300";

const getPriceLabel = ({ minPrice, maxPrice }: IProductFilters) => {
  if (minPrice !== undefined && maxPrice !== undefined) return `Цена от ${minPrice} до ${maxPrice} ₽`;
  if (minPrice !== undefined) return `Цена от ${minPrice} ₽`;
  return `Цена до ${maxPrice} ₽`;
};

// Плашки применённых фильтров над товарами: крестик убирает один фильтр, «Очистить фильтры» — все.
// Это обычные ссылки: состояние фильтров живёт в URL, как и номер страницы
const ActiveFilters = ({ basePath, filters }: IActiveFiltersProps) => {
  const toHref = (next: IProductFilters) => {
    const query = toFiltersQuery(next);
    return query ? `${basePath}?${query}` : basePath;
  };

  const chips: { label: string; href: string }[] = [];
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    chips.push({
      label: getPriceLabel(filters),
      href: toHref({ ...filters, minPrice: undefined, maxPrice: undefined }),
    });
  }
  if (filters.inStock) {
    chips.push({ label: "В наличии", href: toHref({ ...filters, inStock: false }) });
  }

  if (chips.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-4 xl:gap-6">
      {chips.map(({ label, href }) => (
        <li key={label}>
          <Link
            href={href}
            scroll={false}
            aria-label={`Убрать фильтр «${label}»`}
            className={`${chipClass} bg-(--color-secondary) text-white hover:opacity-80`}
          >
            {label}
            <X className="w-6 h-6" aria-hidden="true" />
          </Link>
        </li>
      ))}
      <li>
        <Link
          href={basePath}
          scroll={false}
          className={`${chipClass} bg-[#f3f2f1] text-[#606060] hover:bg-[#e6e5e3]`}
        >
          Очистить фильтры
          <X className="w-6 h-6 text-(--color-foreground)" aria-hidden="true" />
        </Link>
      </li>
    </ul>
  );
};

export default ActiveFilters;
