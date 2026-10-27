import ProductBreadcrumbs from "@/components/product-breadcrumbs/product-breadcrumbs";
import { getProduct } from "@/lib/get-product"

const ProductBreadcrumbsSlot = async ({params}:{params:Promise<{id:string}>}) => {

    const{id} = await params;
   const product = await getProduct(id);
   if (!product) return null;

   return (
    <ProductBreadcrumbs product={product} />
   )
}

export default ProductBreadcrumbsSlot