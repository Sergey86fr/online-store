import ProductCard from "@/components/product-card/product-card";
import ProductDetails from "@/components/product-details/product-details";
import ProductReviews from "@/components/product-reviews/product-reviews";
import ProductsSection from "@/components/products-section/products-section";
import { getBoughtTogether, getProduct, getReviews } from "@/lib/get-product";
import { getProducts } from "@/lib/get-products";
import { getProductHref } from "@/lib/products";
import { notFound, redirect } from "next/navigation";

const SIMILAR_LIMIT = 4;
const BOUGHT_TOGETHER_LIMIT = 4;
const TABLET_COLUMNS = 3;

interface IProductPageProps {
  params: Promise<{ category: string; id: string }>;
}

export const generateMetadata = async ({ params }: IProductPageProps) => {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: product?.title ?? "Товар не найден",
    description: product?.description,
  };
};

const ProductPage = async ({ params }: IProductPageProps) => {
  const { category, id } = await params;

  const product = await getProduct(id);
  if (!product) notFound();

  if (category !== product.category)
    redirect(getProductHref(product.category, product.id));

  const [reviews, { items: categoryItems }, boughtTogether] = await Promise.all(
    [
      getReviews(id),
      getProducts(
        `/api/products?category=${product.category}`,
        { next: { revalidate: 3600 } },
        1,
        SIMILAR_LIMIT + 1,
      ),
      getBoughtTogether(id, BOUGHT_TOGETHER_LIMIT),
    ],
  );

  const similar = categoryItems
    .filter((p) => p.id !== product.id)
    .slice(0, SIMILAR_LIMIT);

  const rating = reviews.total > 0 ? reviews.average : product.rating;

  return (
    <div className=" mb-20 flex flex-col gap-20 md:gap-25 xl:gap-30">
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
  )
};

export default ProductPage;
