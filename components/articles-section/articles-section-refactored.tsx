import Link from "next/link";
import { redirect } from "next/navigation";
import Arrow from "../../public/images/icons/arrow-rigth.svg";
import Article from "../article/article";
import { getArticles } from "@/lib/get-articles";
import { getPageLimit } from "@/lib/get-page-limit";
import { PAGE_LIMITS } from "@/lib/page-limit";
import Pagination from "../pagination/pagination";
import PageLimitSync from "../page-limit-sync/page-limit-sync";

interface IArticlesSectionProps {
  variant: "preview" | "full";
  newPage?: number;
}

// На главной всегда три статьи — по одной на колонку
const PREVIEW_LIMIT = 3;

// Статья крупнее карточки товара, поэтому на странице их меньше.
// Ключ — лимит товаров из cookie (по нему понятно, какой экран), значение — лимит статей.
// Мобильный: 1 колонка, статья во всю ширину — 4 штуки, чтобы не листать бесконечно.
// Планшет и десктоп: 3 колонки — 6 и 9, последний ряд всегда полный
const ARTICLE_LIMITS: Record<number, number> = {
  [PAGE_LIMITS.mobile]: 4,
  [PAGE_LIMITS.tablet]: 6,
  [PAGE_LIMITS.desktop]: 9,
};

const ArticlesSectionRefactored = async ({
  variant,
  newPage,
}: IArticlesSectionProps) => {
  const isPreview = variant === "preview";
  const Heading = isPreview ? "h2" : "h1";

  // ?page=-3 или ?page=1.5 — такой страницы не бывает, отправляем на первую
  if (
    !isPreview &&
    newPage !== undefined &&
    (!Number.isInteger(newPage) || newPage < 1)
  ) {
    redirect("/articles");
  }

  // Для превью лимит фиксированный, для полной страницы — под ширину экрана
  const deviceLimit = isPreview ? undefined : await getPageLimit();
  const limit =
    deviceLimit === undefined ? PREVIEW_LIMIT : ARTICLE_LIMITS[deviceLimit];

  const { items, page, totalPages } = await getArticles(
    limit,
    isPreview ? undefined : newPage,
  );

  // ?page=999 — страниц меньше, отправляем на последнюю
  if (!isPreview && totalPages > 0 && page > totalPages) {
    redirect(`/articles?page=${totalPages}`);
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <Heading className="text-2xl xl:text-4xl font-bold">Статьи</Heading>
        {isPreview && (
          <Link
            className="flex gap-6 items-center cursor-pointer  text-[#606060] hover:text-[#bfbfbf] duration-300"
            href="/articles"
          >
            <span className="text-base ">Все статьи</span>
            <Arrow className="w-6 h-[13px] " aria-hidden="true" />
          </Link>
        )}
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

      {!isPreview && <Pagination page={page} totalPages={totalPages} />}
      {/* PageLimitSync работает с лимитом товаров — от него мы и считали лимит статей */}
      {deviceLimit !== undefined && (
        <PageLimitSync currentLimit={deviceLimit} />
      )}
    </section>
  );
};

export default ArticlesSectionRefactored;
