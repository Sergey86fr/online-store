import Image from "next/image";
import Link from "next/link";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/products";
import { ProductCategory } from "@/types/product";

interface ICategoryTile {
  slug: ProductCategory;
  wide?: boolean; // широкая плитка — на две колонки
}

// Порядок подобран так, чтобы ряды заполнялись без пробелов при 2, 3 и 4 колонках:
// 4 колонки: «Ш+1+1», «1+1+Ш», «1+Ш+1»; 3 колонки: «Ш+1» и «1+1+1» по очереди
const CATEGORY_TILES: ICategoryTile[] = [
  { slug: "dairy", wide: true },
  { slug: "bakery" },
  { slug: "vegetables-fruits" },
  { slug: "drinks" },
  { slug: "grocery" },
  { slug: "meat", wide: true },
  { slug: "canned" },
  { slug: "alcohol", wide: true },
  { slug: "fish" },
];

const Categories = () => {
  return (
    <ul className="grid grid-flow-row-dense grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 xl:gap-10">
      {CATEGORY_TILES.map(({ slug, wide }) => (
        <li key={slug} className={wide ? "col-span-2" : undefined}>
          <Link
            href={`/catalog/${slug}`}
            className="group relative block h-40 md:h-50 overflow-hidden rounded-sm bg-white shadow-[1px_2px_4px_0px_rgba(112,192,91,0.2)] hover:shadow-(--shadow-primary) duration-300"
          >
            <Image
              src={`/images/categories/${slug}.webp`}
              alt=""
              fill
              className="object-cover"
              sizes={
                wide
                  ? "(min-width: 1280px) 584px, (min-width: 768px) 66vw, 95vw"
                  : "(min-width: 1280px) 272px, (min-width: 768px) 33vw, 50vw"
              }
            />
            {/* Зелёный градиент снизу; при наведении поверх проявляется оранжевый */}
            <div className="absolute inset-x-0 bottom-0 h-30 bg-linear-to-b from-[rgba(112,192,91,0)] to-(--color-secondary) to-83%" />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-b from-[rgba(255,102,51,0)] to-(--color-primary) opacity-0 group-hover:opacity-100 duration-300" />
            <span className="absolute inset-x-2.5 bottom-2.5 text-sm md:text-lg font-bold leading-normal text-white">
              {PRODUCT_CATEGORY_LABELS[slug]}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Categories;
