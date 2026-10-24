import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBoughtTogether, getProduct, getReviews } from "@/lib/get-product";
import { getProducts } from "@/lib/get-products";
import ProductBreadcrumbs from "@/components/product-breadcrumbs/product-breadcrumbs";
import ProductDetails from "@/components/product-details/product-details";
import ProductReviews from "@/components/product-reviews/product-reviews";
import ProductCard from "@/components/product-card/product-card";
import ProductsSection from "@/components/products-section/products-section";

// Сколько карточек в «Похожих» и «С этим товаром покупают» (как в макете)
const SIMILAR_LIMIT = 4;
const BOUGHT_TOGETHER_LIMIT = 4;
// На планшете в ряд помещается 3 карточки — четвёртую прячем, как в ProductsSection
const TABLET_COLUMNS = 3;

interface IProductPageProps {
  params: Promise<{ id: string }>;
}

// Заголовок вкладки — название товара. fetch с тем же адресом и настройками Next выполнит один раз
// на рендер, поэтому повторный getProduct в самой странице второго запроса не сделает
export const generateMetadata = async ({ params }: IProductPageProps): Promise<Metadata> => {
  const { id } = await params;
  const product = await getProduct(id);
  return { title: product?.title ?? "Товар не найден", description: product?.description };
};

// Страница товара: /product-refactored/<id>.
// Лежит вне группы (catalog): там общий Breadcrumbs строит крошки из адреса, а нам нужны
// категория и название товара — поэтому свои крошки ProductBreadcrumbs и своя обёртка <main>
const ProductPageRefactored = async ({ params }: IProductPageProps) => {
  const { id } = await params;
  const product = await getProduct(id);

  // Кривой id или товара нет — настоящая 404
  if (!product) notFound();

  // Всё остальное зависит только от товара — грузим одновременно.
  // Похожие: берём на один больше, потому что в выдачу категории попадёт и сам товар
  const [reviews, { items: categoryItems }, boughtTogether] = await Promise.all([
    getReviews(product.id),
    getProducts(`/api/products?category=${product.category}`, { next: { revalidate: 3600 } }, 1, SIMILAR_LIMIT + 1),
    getBoughtTogether(product.id, BOUGHT_TOGETHER_LIMIT),
  ]);
  const similar = categoryItems.filter((p) => p.id !== product.id).slice(0, SIMILAR_LIMIT);

  // Пока отзывов нет, показываем оценку из карточки товара, чтобы не было «0 звёзд»
  const rating = reviews.total > 0 ? reviews.average : product.rating;

  return (
    <main className="flex flex-col items-center">
      <ProductBreadcrumbs product={product} />

      <div className="w-[clamp(300px,95vw,1208px)] p-0 mobile:p-3 mt-2 md:mt-4 xl:mt-6 mb-20 flex flex-col gap-20 md:gap-25 xl:gap-30">
        <ProductDetails product={product} rating={rating} reviewsCount={reviews.total} similar={similar} />

        {boughtTogether.length > 0 && (
          <section aria-labelledby="bought-together-title">
            <h2 id="bought-together-title" className="text-2xl xl:text-[40px] font-bold mb-4 md:mb-8 xl:mb-10">
              С этим товаром покупают
            </h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4 md:gap-8 xl:gap-10">
              {boughtTogether.map((p, index) => (
                <li key={p.id} className={index >= TABLET_COLUMNS ? "md:hidden xl:block" : undefined}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </section>
        )}

        <ProductReviews productId={product.id} reviews={reviews} />

        <ProductsSection sectionName="promotions" variant="preview" />
      </div>
    </main>
  );
};

export default ProductPageRefactored;
