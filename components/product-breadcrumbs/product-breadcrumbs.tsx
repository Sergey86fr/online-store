import Link from "next/link";
import Arrow from "../../public/images/icons/arrow-rigth.svg";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/products";
import { IProduct } from "@/types/product";

// Крошки страницы товара: Главная › Каталог › Категория › Товар.
// Общий Breadcrumbs строит крошки из адреса, а в адресе товара (/product-refactored/<id>)
// нет ни категории, ни названия — поэтому собираем их из данных товара. Вид — как у Breadcrumbs
const ProductBreadcrumbs = ({ product }: { product: Pick<IProduct, "title" | "category"> }) => {
  const crumbs = [
    { href: "/", label: "Главная" },
    { href: "/catalog", label: "Каталог" },
    { href: `/catalog/${product.category}`, label: PRODUCT_CATEGORY_LABELS[product.category] },
  ];

  return (
    <nav aria-label="Хлебные крошки" className="w-[clamp(300px,95vw,1208px)] p-0 mobile:p-3">
      <ol className="mt-2 md:mt-4 xl:mt-6 flex flex-wrap items-center gap-2 text-[10px] md:text-xs">
        {crumbs.map((crumb) => (
          <li className="flex items-center gap-2" key={crumb.href}>
            <Link className="text-[#414141] hover:text-(--color-primary)" href={crumb.href}>
              {crumb.label}
            </Link>
            <Arrow aria-hidden="true" className="text-[#414141]" />
          </li>
        ))}
        <li>
          <span className="text-[#8F8F8F]" aria-current="page">
            {product.title}
          </span>
        </li>
      </ol>
    </nav>
  );
};

export default ProductBreadcrumbs;
