import Link from "next/link";
import Arrow from "../../public/images/icons/arrow-rigth.svg"
import Article from "../article/article";
import { getArticles } from "@/lib/get-articles";
import Pagination from "../pagination/pagination";


const ArticlesSection = async ({limit, newPage}:{limit?:number, newPage?:number}) => {

    const {items,page, totalPages} = await getArticles(limit,newPage)

    const Heading= limit? "h2": "h1"
   return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <Heading className="text-2xl xl:text-4xl font-bold">Статьи</Heading>
        <Link
          className="flex gap-6 items-center cursor-pointer  text-[#606060] hover:text-[#bfbfbf] duration-300"
          href={limit?"/articles":"/"}
        >
          <span className="text-base ">{limit?"Все статьи":"Назад"}</span>
          <Arrow className="w-6 h-[13px] " />
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-base text-[#8F8F8F]">
          Статьи пока не загрузились. Попробуйте обновить страницу.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5  md:gap-8  xl:gap-10">
          {items.map((a) => (
            <Article article={a} key={a.id} />
          ))}
        </div>
      )}

  <Pagination page={page} totalPages={totalPages}  />
    </section>
  );
}

export default ArticlesSection