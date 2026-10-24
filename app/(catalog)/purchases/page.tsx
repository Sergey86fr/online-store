// import { IProduct } from "@/types/product";
// import Arrow from "../../../public/images/icons/arrow-rigth.svg"
// import { IPaginatedResponse } from "@/lib/pagination";
// import Link from "next/link";
// import ProductCard from "@/components/product-card/product-card";
import ProductsSection from "@/components/products-section/products-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Покупали раньше",
  description: "Товары, которые вы уже заказывали в Северяночке",
  // личная страница пользователя — поисковикам её индексировать незачем
  robots: { index: false },
};


// const getAllPurchases = async (): Promise<IProduct[]> => {
//  try {
//    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/purchases?page=1`, {cache:"no-store"});
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

const AllPurchases =async ({searchParams}: {searchParams:Promise<{page?:string}>}) => {

  const{page} = await searchParams;

    // const purchasesProducts = await getAllPurchases()

  return (
    // <div className="w-full">
    //   <div className="flex justify-between">
    //     <h2 className="text-2xl xl:text-[40px] font-bold">Покупали раньше</h2>
    //     <Link href={'/'} className=" flex items-center gap-4 cursor-pointer  text-[#606060] hover:text-[#bfbfbf] 
    //         duration-300">
    //         <span className="text-lg">Назад</span>
    //        <Arrow className="w-4 h-4" />
    //     </Link>

    //   </div>
    //     <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4 md:gap-8 xl:gap-10 mt-4 md:mt-8 xl:mt-10" >
    //      {
    //         purchasesProducts?.map((p) => (
    //             <li  key={p.id} >
    //               <ProductCard product={p}  />
    //             </li>
    //         ))
    //      }
    //     </ul>
    // </div>

    <ProductsSection sectionName="purchases" variant="full" newPage={Number(page) || undefined} />
  )
}

export default AllPurchases