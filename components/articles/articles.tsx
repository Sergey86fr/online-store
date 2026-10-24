// import Link from "next/link";
// import Arrow from "../../public/images/icons/arrow-rigth.svg";
// import Article from "../article/article";
// import { IArticle } from "@/types/article";
import ArticlesSectionRefactored from "../articles-section/articles-section-refactored";

// import { IPaginatedResponse } from "@/lib/pagination";

// const getArticles = async (): Promise<IArticle[]> => {
//   try {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles?limit=3`,
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

const Articles = () => {
  // const articles = await getArticles();

  return (
    // <section>
    //   <div className="flex justify-between items-center mb-4">
    //     <h2 className="text-2xl xl:text-4xl font-bold">Статьи</h2>
    //     <Link
    //       className="flex gap-6 items-center cursor-pointer  text-[#606060] hover:text-[#bfbfbf] duration-300"
    //       href={"/articles"}
    //     >
    //       <span className="text-base ">Все статьи</span>
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
    <ArticlesSectionRefactored variant="preview" />
  );
};

export default Articles;
