import User from "../../public/images/icons/user.svg";
import RatingRefactored from "../rating/rating-refactored";
import ReviewForm from "../review-form/review-form";
import { IReviewsResponse } from "@/types/review";

interface IProductReviewsProps {
  productId: string;
  reviews: IReviewsResponse;
}

const GRADES = [5, 4, 3, 2, 1] as const;

// 2026-10-11T… -> 11.10.2026
const formatDate = (iso: string) => new Date(iso).toLocaleDateString("ru-RU");

// «Отзывы»: слева сводка (средняя оценка и сколько отзывов с каждой оценкой), справа список и форма.
// Мобильный — всё в столбик; с md — две колонки, форма под списком (как в макете)
const ProductReviews = ({ productId, reviews }: IProductReviewsProps) => {
  const { items, total, average, distribution } = reviews;

  return (
    // id — сюда ведёт ссылка «3 отзыва» вверху страницы; scroll-mt — чтобы заголовок не прилипал к краю
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-4">
      <h2 id="reviews-title" className="text-2xl xl:text-[40px] font-bold mb-4 md:mb-8 xl:mb-10">
        Отзывы
      </h2>

      <div className="flex flex-col gap-4 md:grid md:grid-cols-[160px_1fr] md:gap-x-8 md:gap-y-8 xl:grid-cols-[168px_688px] xl:gap-x-36 xl:gap-y-10">
        <div className="flex flex-col gap-4">
          <div className="h-8 flex items-center gap-2 xl:gap-4">
            <RatingRefactored rating={average} size={16} />
            <span className="text-lg font-bold leading-normal text-[#414141]">
              {total > 0 ? `${average.toLocaleString("ru-RU")} из 5` : "Нет оценок"}
            </span>
          </div>
          <ul className="flex flex-col" aria-label="Оценки покупателей">
            {GRADES.map((grade) => (
              <li key={grade} className="h-8 flex items-center gap-2 xl:gap-4 text-base leading-normal text-[#414141]">
                <span className="w-5">{grade}</span>
                <RatingRefactored rating={grade} size={16} />
                <span className="w-5 text-right">{distribution[grade]}</span>
              </li>
            ))}
          </ul>
        </div>

        {items.length > 0 ? (
          <ul className="flex flex-col gap-4 md:gap-8 xl:gap-10">
            {items.map((review) => (
              <li key={review.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-2.5 rounded-full border border-[#F3F2F1]">
                    <User aria-hidden="true" className="w-4 h-4 text-[#414141]" />
                  </span>
                  <span className="text-lg leading-normal text-[#414141]">{review.userName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <RatingRefactored rating={review.rating} size={16} />
                  <time dateTime={review.createdAt} className="text-xs leading-normal text-[#8F8F8F]">
                    {formatDate(review.createdAt)}
                  </time>
                </div>
                <p className="text-base leading-normal text-[#414141] whitespace-pre-line wrap-break-word">{review.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-base leading-normal text-[#606060]">Отзывов пока нет — будьте первым!</p>
        )}

        <div className="md:col-start-2">
          <ReviewForm productId={productId} />
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
