import Link from "next/link";
import { redirect } from "next/navigation";
import Arrow from "../../public/images/icons/arrow-rigth.svg";
import ProductCard from "../product-card/product-card";
import { getProducts } from "@/lib/get-products";
import { getPageLimit } from "@/lib/get-page-limit";
import { PRODUCT_SECTIONS, ProductSectionName } from "./sections";
import Pagination from "../pagination/pagination";
import PageLimitSync from "../page-limit-sync/page-limit-sync";


interface IProductSectionProps {
  sectionName: ProductSectionName ;
  variant: "preview" | "full";
  className?: string;
  newPage?: number;
  limit?: number;
}

const TABLET_COLUMNS = 3;

const ProductsSection = async ({
  sectionName,
  variant,
  className,
  newPage,
  limit,
}: IProductSectionProps) => {
  const { title, href, linkLabel, previewPath, fullPath, fetchOptions } =
    PRODUCT_SECTIONS[sectionName];

  const isPreview = variant === "preview";

  const Heading = isPreview ? "h2" : "h1";

  // ?page=-3 или ?page=1.5 — такой страницы не бывает, отправляем на первую
  if (
    !isPreview &&
    newPage !== undefined &&
    (!Number.isInteger(newPage) || newPage < 1)
  ) {
    redirect(href);
  }

  // В превью лимит уже зашит в previewPath, а для полной страницы зависит от ширины экрана
  const pageLimit = isPreview ? limit : (limit ?? (await getPageLimit()));

  const { items, page, totalPages } = await getProducts(
    isPreview ? previewPath : fullPath,
    fetchOptions,
    newPage,
    pageLimit,
  );

  // ?page=999 — страниц меньше, отправляем на последнюю
  if (!isPreview && totalPages > 0 && page > totalPages) {
    redirect(`${href}?page=${totalPages}`);
  }

  return (
    <div className={`w-full ${className ?? ""}`}>
      <div className="flex justify-between">
        <Heading className="text-2xl xl:text-[40px] font-bold">{title}</Heading>
        {isPreview && (
          <Link
            href={href}
            className=" flex items-center gap-4 cursor-pointer  text-[#606060] hover:text-[#bfbfbf] 
            duration-300"
          >
            <span className="text-lg">{linkLabel}</span>
            <Arrow className="w-4 h-4" aria-hidden={true} />
          </Link>
        )}
      </div>
      {items.length > 0 ? (
        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4 md:gap-8 xl:gap-10 mt-4 md:mt-8 xl:mt-10">
          {items.map((p, index) => (
            <li
              key={p.id}
              className={
                isPreview && index >= TABLET_COLUMNS
                  ? "sm:hidden xl:block"
                  : undefined
              }
            >
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xl xl:text-[32px] font-bold">
          Карточки продуктов не загрузились
        </p>
      )}
      {!isPreview && <Pagination page={page} totalPages={totalPages} />}
      {/* Лимит подбирается под ширину экрана, только если его не задали явно */}
      {!isPreview && limit === undefined && pageLimit !== undefined && (
        <PageLimitSync currentLimit={pageLimit} />
      )}
    </div>
  );
};

export default ProductsSection;
