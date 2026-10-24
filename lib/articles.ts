import { IArticle, IArticleDocument } from "@/types/article";

// Документ из MongoDB -> статья для API: _id становится строковым id
export const toArticle = ({ _id, createdAt, ...rest }: IArticleDocument): IArticle => ({
  ...rest,
  id: _id.toString(),
  createdAt: createdAt.toISOString(),
});
