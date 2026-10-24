import Link from "next/link";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/products";

// Категории по алфавиту — в выпадающем списке так проще найти нужную
const CATEGORIES = Object.entries(PRODUCT_CATEGORY_LABELS).sort(([, a], [, b]) =>
  a.localeCompare(b, "ru"),
);

// Выпадающее окно каталога. С md (планшет) и шире — там же, где видна кнопка «Каталог».
// На планшете два столбика, на xl — три. На касание наведения нет — там кнопка просто ведёт на /catalog.
// Открывается без JS: родитель с классом `group` (обёртка кнопки в SearchBlock) наведён мышью
// или внутри него фокус с клавиатуры. Позиционируется от <header> (у него `relative`), поэтому на всю ширину.
const CatalogMenu = () => {
  return (
    <div
      className="absolute inset-x-0 top-full hidden md:block bg-white shadow-[0px_8px_8px_rgba(0,0,0,0.15)]
        invisible opacity-0 transition-[opacity,visibility] duration-200 delay-150
        group-hover:visible group-hover:opacity-100 group-hover:delay-100
        group-has-focus-visible:visible group-has-focus-visible:opacity-100 group-has-focus-visible:delay-0"
    >
      <ul className="mx-auto w-[clamp(300px,95vw,1208px)] py-10 grid grid-flow-col grid-rows-5 xl:grid-rows-3 auto-cols-68 gap-x-10 gap-y-6">
        {CATEGORIES.map(([slug, label]) => (
          <li key={slug}>
            <Link
              href={`/catalog/${slug}`}
              className="font-bold leading-normal text-[#414141] hover:text-(--color-primary) focus-visible:text-(--color-primary) duration-300"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CatalogMenu;
