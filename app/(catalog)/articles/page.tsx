// import Link from "next/link";
// import Arrow from "../../../public/images/icons/arrow-rigth.svg";
// import { IArticle } from "@/types/article";
// import { IPaginatedResponse } from "@/lib/pagination";
// import Article from "@/components/article/article";

import ArticlesSectionRefactored from "@/components/articles-section/articles-section-refactored";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Статьи",
  description: "Статьи о продуктах, рецептах и здоровом питании от Северяночки",
};

// const getAllArticles = async (): Promise<IArticle[]> => {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles`,
//       { next: { revalidate: 3600 } },
//     );
//     if (!res.ok) throw new Error(`Сервер ответил статусом ${res.status}`);
//     const data:IPaginatedResponse<IArticle> = await res.json();
//     return data.items;
//   } catch (error) {
//     console.error("Ошибка при получении статей", error);
//     return [];
//   }
// };

const AllArticles = async ({ searchParams }: { searchParams: Promise<{ page?: string }> }) => {
  const { page } = await searchParams;
  // const articles = await getAllArticles();

  return (
    // <section>
    //   <div className="flex justify-between items-center mb-4">
    //     <h2 className="text-2xl xl:text-4xl font-bold">Статьи</h2>
    //     <Link
    //       className="flex gap-6 items-center cursor-pointer  text-[#606060] hover:text-[#bfbfbf] duration-300"
    //       href={"/"}
    //     >
    //       <span className="text-base ">Назад</span>
    //       <Arrow className="w-6 h-[13px] " />
    //     </Link>
    //   </div>

    //   {articles.length === 0 ? (
    //     <p className="text-base text-[#8F8F8F]">
    //       Статьи пока не загрузились. Попробуйте обновить страницу.
    //     </p>
    //   ) : (
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-5  md:gap-8  xl:gap-10">
    //       {articles.map((a) => (
    //         <Article article={a} key={a.id} />
    //       ))}
    //     </div>
    //   )}
    // </section>
    <ArticlesSectionRefactored variant="full" newPage={page === undefined ? undefined : Number(page)} />
  );
};

export default AllArticles;
