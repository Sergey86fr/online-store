import ProductBreadcrumbs from "@/components/product-breadcrumbs/product-breadcrumbs";
import { getProduct } from "@/lib/get-product"
import { notFound } from "next/navigation";

const ProductBreadcrumbsSlot = async ({params}:{params:Promise<{id:string}>}) => {

    const{id} = await params;
   const product = await getProduct(id);
   if(!product) notFound()

   return (
    <ProductBreadcrumbs product={product} />
   )
}

export default ProductBreadcrumbsSlot