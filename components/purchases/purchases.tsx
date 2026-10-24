// import { IProduct } from "@/types/product";
// import Arrow from "../../public/images/icons/arrow-rigth.svg"
// import data from "../../data/database.json"
// import ProductCard from "../product-card/product-card"
// import { IPaginatedResponse } from "@/lib/pagination";
// import Link from "next/link";
import ProductsSection from "../products-section/products-section";


// const getPurchases = async (): Promise<IProduct[]> => {
//  try {
//    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/purchases?limit=4`, {cache:"no-store"});
//    if(!res.ok) {
//     throw new Error(`Ошибка получения данных о покупках, ${res.status}`)
//    }
//    const data:IPaginatedResponse<IProduct> = await res.json();
//    return data.items
//  } catch (error) {
//   console.error(error)
//   return []
//  }
     
// }

const Purchases = () => {
    // const purchasesProducts = data.users[0].purchases.map((purchase) => {
    //     const product = data.products.find((p) => p.id === purchase.id)
    //     if(!product) return;
    //     const{discountPercent, ...rest} = product
    //     void discountPercent
    //     return rest
    // }).filter((p) => p !== undefined);

    // const purchasesProducts = await getPurchases()

  return (
    // <div className="w-full">
    //   <div className="flex justify-between">
    //     <h2 className="text-2xl xl:text-[40px] font-bold">Покупали раньше</h2>
    //     <Link href={'/purchases'} className=" flex items-center gap-4 cursor-pointer  text-[#606060] hover:text-[#bfbfbf] 
    //         duration-300">
    //         <span className="text-lg">Все покупки</span>
    //        <Arrow className="w-4 h-4" />
    //     </Link>

    //   </div>
    //     <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4 md:gap-8 xl:gap-10 mt-4 md:mt-8 xl:mt-10" >
    //      {
    //         purchasesProducts?.map((p, index) => (
    //             <li  key={p.id} className={`${index >= 3 ? "sm:hidden xl:block":""}`} >
    //               <ProductCard product={p}  />
    //             </li>
    //         ))
    //      }
    //     </ul>
    // </div>
    <ProductsSection sectionName="purchases" variant="preview" />
  )
}

export default Purchases