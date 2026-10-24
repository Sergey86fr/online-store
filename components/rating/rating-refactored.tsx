import Star from "../../public/images/icons/star.svg";

interface IRatingRefactoredProps {
  rating: number;
  // Размер звезды в px: 13 — карточка товара, 16 — страница товара (как в макете)
  size?: number;
}

const TOTAL_STARS = 5;

// Как Rating, но размер звёзд задаётся пропсом, а для экранных дикторов есть подпись «Оценка 4 из 5»
const RatingRefactored = ({ rating, size = 13 }: IRatingRefactoredProps) => {
  return (
    <div className="flex gap-1" role="img" aria-label={`Оценка ${rating} из ${TOTAL_STARS}`}>
      {Array.from({ length: TOTAL_STARS }, (_, index) => {
        // Сколько процентов звезды закрасить: 4.3 -> четыре полные, пятая на 30%
        const fillPercent = Math.min(Math.max(rating - index, 0), 1) * 100;
        return (
          <div className="relative shrink-0" style={{ width: size, height: size }} key={index}>
            <Star aria-hidden="true" className="text-[#BFBFBF] w-full h-full absolute inset-0" />
            <div className="absolute overflow-hidden inset-0" style={{ width: `${fillPercent}%` }}>
              <Star aria-hidden="true" className="text-(--color-primary)" style={{ width: size, height: size }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RatingRefactored;
