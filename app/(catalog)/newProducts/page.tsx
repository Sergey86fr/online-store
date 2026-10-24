// import { IProduct } from "@/types/product";
// import Arrow from "../../../public/images/icons/arrow-rigth.svg";
// import { IPaginatedResponse } from "@/lib/pagination";
// import Link from "next/link";
// import ProductCard from "@/components/product-card/product-card";
// import ProductsSection from "@/components/products-section/products-section";

import ProductsSection from "@/components/products-section/products-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Новинки",
  description: "Новые товары в Северяночке",
};

// const getAllNewProducts = async (): Promise<IProduct[]> => {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?new=true`,
//       { next: { revalidate:3600 } },
//     );
//     if (!res.ok) {
//       throw new Error(`Ошибка загрузки данных! ${res.status}`);
//     }
//     const data: IPaginatedResponse<IProduct> = await res.json();
//     return data.items;
//   } catch (err) {
//     console.error("Ошибка получения продуктов", err);
//     return [];
//   }
// };

const AllNewProducts = async ({searchParams}: {searchParams:Promise<{page?:string}>}) => {
  // const newProducts = await getAllNewProducts();

  const{page} = await searchParams;

  return (
    // <div className="w-full">
    //   <div className="flex justify-between">
    //     <h2 className="text-2xl xl:text-[40px] font-bold">Новинки</h2>
    //     <Link href={'/'}
    //       className=" flex items-center gap-4 cursor-pointer  text-[#606060] hover:text-[#bfbfbf] 
    //         duration-300"
    //     >
    //       <span className="text-lg">Назад</span>
    //       <Arrow className="w-4 h-4" alt="кнопка" />
    //     </Link>
    //   </div>
    //   <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4 md:gap-8 xl:gap-10 mt-4 md:mt-8 xl:mt-10">
    //     {newProducts.map((p) => (
    //       <li
    //         key={p.id}
    //       >
    //         <ProductCard product={p} />
    //       </li>
    //     ))}
    //   </ul>
    // </div>
    <ProductsSection sectionName="newProducts" variant="full" newPage={Number(page) || undefined} />
  );
};

export default AllNewProducts;