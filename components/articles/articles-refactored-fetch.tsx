import Link from "next/link";
import { headers } from "next/headers";
import Arrow from "@/public/images/icons/arrow-rigth.svg";
import Article from "@/components/article/article";
import { IArticle } from "@/types/article";

// На сервере fetch не понимает относительный путь "/api/articles",
// поэтому собираем полный адрес (http://localhost:3000) из заголовков запроса.
const getBaseUrl = async () => {
  const h = await headers();
  const host = h.get("host");
  const protocol = h.get("x-forwarded-proto") ?? "http";
  return `${protocol}://${host}`;
};

const getArticles = async (): Promise<IArticle[]> => {
  try {
    const baseUrl = await getBaseUrl();
    // Ответ кешируется на час (3600 секунд), потом Next.js запросит статьи заново
    const res = await fetch(`${baseUrl}/api/articles`, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error(`Сервер ответил статусом ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Ошибка при получении статей:", error);
    return [];
  }
};

const ArticlesRefactoredFetch = async () => {
  const articles = await getArticles();

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl xl:text-4xl font-bold">Статьи</h2>
        <Link className="flex gap-6 items-center cursor-pointer text-[#606060] hover:text-[#bfbfbf] duration-300" href={"/"}>
          <span className="text-base">Все статьи</span>
          <Arrow className="w-6 h-[13px]" aria-hidden="true" />
        </Link>
      </div>
      {articles.length === 0 ? (
        <p className="text-base text-[#8F8F8F]">Статьи пока не загрузились. Попробуйте обновить страницу.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 xl:gap-10">
          {articles.map((a) => (
            <Article article={a} key={a.id} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ArticlesRefactoredFetch;
