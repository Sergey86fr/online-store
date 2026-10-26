import { getProduct } from "@/lib/get-product";
import { getProductHref } from "@/lib/products";
import { log } from "console";
import { notFound, redirect } from "next/navigation";

interface IProductPageProps {
  params: Promise<{ urlCategory: string; id: string }>;
}

const ProductPage = async ({ params }: IProductPageProps) => {
  const { urlCategory, id } = await params;

  const product = await getProduct(id);
  if (!product) notFound();

  if (urlCategory !== product?.category)
    redirect(getProductHref(product.category, product.id));

  
  return <div></div>;
};

export default ProductPage;
