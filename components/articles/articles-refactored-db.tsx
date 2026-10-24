import Link from "next/link";
import Arrow from "@/public/images/icons/arrow-rigth.svg";
import Article from "@/components/article/article";
import { getDb } from "@/lib/mongodb";
import { toArticle } from "@/lib/articles";
import { IArticle, IArticleDocument } from "@/types/article";

// Серверный компонент: выполняется на сервере, поэтому может быть async
// и ходить в базу напрямую — без fetch("/api/articles").
// Ручка /api/articles нужна для клиента (браузер, мобильное приложение),
// а серверу незачем отправлять HTTP-запрос самому себе.
const getArticles = async (): Promise<IArticle[]> => {
  try {
    const db = await getDb();
    const articles = await db
      .collection<IArticleDocument>("articles")
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    return articles.map(toArticle);
  } catch (error) {
    console.error("Ошибка при получении статей:", error);
    return [];
  }
};

const ArticlesRefactoredDb = async () => {
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

export default ArticlesRefactoredDb;
