// import { IProduct } from "@/types/product";
// import Arrow from "../../public/images/icons/arrow-rigth.svg";
// import data from "../../data/database.json"
// import ProductCard from "../product-card/product-card";
// import { IPaginatedResponse } from "@/lib/pagination";
// import Link from "next/link";
import ProductsSection from "../products-section/products-section";

// const getNewProducts = async (): Promise<IProduct[]> => {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?sort=new&limit=4`,
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

const NewProducts =  () => {
  // const newProducts = await getNewProducts();
  // const newProducts = data.products.filter((p) => p.isNew === true)
  return (
    // <div className="w-full">
    //   <div className="flex justify-between">
    //     <h2 className="text-2xl xl:text-[40px] font-bold">Новинки</h2>
    //     <Link href={'/newProducts'}
    //       className=" flex items-center gap-4 cursor-pointer  text-[#606060] hover:text-[#bfbfbf] 
    //         duration-300"
    //     >
    //       <span className="text-lg">Все новинки</span>
    //       <Arrow className="w-4 h-4" alt="кнопка" />
    //     </Link>
    //   </div>
    //   <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4 md:gap-8 xl:gap-10 mt-4 md:mt-8 xl:mt-10">
    //     {newProducts.map((p, index) => (
    //       <li
    //         key={p.id}
    //         className={`${index >= 3 ? "sm:hidden xl:block" : ""}`}
    //       >
    //         <ProductCard product={p} />
    //       </li>
    //     ))}
    //   </ul>
    // </div>
    <ProductsSection sectionName="newProducts" variant="preview"/>
  );
};

export default NewProducts;
