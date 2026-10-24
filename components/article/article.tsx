import { IArticle } from "@/types/article";
import Image from "next/image";

interface IArticleProps {
  article: IArticle;
}

const Article = ({ article }: IArticleProps) => {
  const date = new Date(article.createdAt);
  return (
    <div className="flex flex-col h-[300px] md:h-[420px] rounded-sm bg-white shadow-(--shadow-default) overflow-hidden hover:shadow-(--shadow-primary)">
      <div  className="w-full relative min-h-[96px] md:min-h-[156px] xl:min-h-[162px] aspect-[336/96] md:aspect-[224/156] lg:aspect-[376/162] overflow-hidden">
        <Image className="object-cover"   fill src={article.img} alt=""   sizes="(min-width: 1280px) 376px, (min-width: 768px) 224px, 336px" />
      </div>
      <div className="p-2.5 flex flex-col  h-full gap-2.5">
        <span className="text-[8px] text-[#8F8F8F] xl:text-xs">{date.toLocaleDateString("ru-Ru")}</span>
        <h3 className="text-base font-bold xl:text-lg">{article.title}</h3>
        <p className="text-xs xl:text-base line-clamp-3 md:line-clamp-5 xl:line-clamp-4 grow">{article.description}</p>
        <button className="self-start w-[150px] h-10 text-base text-(--color-secondary) rounded-sm bg-[#E5FFDE]  hover:bg-(--color-secondary) hover:text-white transition-colors duration-300">Подробнее</button>
      </div>
    </div>
  );
};

export default Article;
