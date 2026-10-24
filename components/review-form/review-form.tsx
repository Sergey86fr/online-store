"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Star from "../../public/images/icons/star.svg";
import { REVIEW_MAX_LENGTH, REVIEW_MAX_RATING } from "@/lib/reviews";

const STARS = Array.from({ length: REVIEW_MAX_RATING }, (_, index) => index + 1);

// Форма «Ваша оценка» + текст отзыва. Отправляет POST /api/products/:id/reviews,
// после успеха router.refresh() перерисовывает серверную страницу — новый отзыв появляется в списке
const ReviewForm = ({ productId }: { productId: string }) => {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  // Звезда под курсором: пока наводим — подсвечиваем до неё, ушли — снова выбранная оценка
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const canSubmit = rating > 0 && text.trim().length > 0 && !isSending;
  const shownRating = hovered || rating;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSending(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text }),
      });
      if (!response.ok) {
        const { error } = await response.json().catch(() => ({ error: null }));
        setMessage({ type: "error", text: error ?? "Не удалось отправить отзыв" });
        return;
      }
      setRating(0);
      setText("");
      setMessage({ type: "success", text: "Спасибо! Отзыв опубликован" });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Нет связи с сервером, попробуйте ещё раз" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:gap-4">
      {/* Оценка — обычные радиокнопки (стрелками работает и с клавиатуры), сами кружки спрятаны, видны звёзды */}
      <fieldset className="flex items-center gap-4 h-8">
        <legend className="float-left mr-4 text-lg font-bold leading-normal text-[#414141]">Ваша оценка</legend>
        <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
          {STARS.map((value) => (
            <label key={value} className="cursor-pointer has-focus-visible:outline-2 has-focus-visible:outline-(--color-primary) rounded-sm" onMouseEnter={() => setHovered(value)}>
              <input
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={() => setRating(value)}
                className="sr-only"
              />
              <span className="sr-only">{value} из {REVIEW_MAX_RATING}</span>
              <Star
                aria-hidden="true"
                className={`w-6 h-6 duration-200 ${value <= shownRating ? "text-(--color-primary)" : "text-[#BFBFBF]"}`}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <label className="sr-only" htmlFor="review-text">Текст отзыва</label>
      <textarea
        id="review-text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={REVIEW_MAX_LENGTH}
        placeholder="Отзыв"
        className="h-25 px-4 py-2 resize-y rounded-sm border border-[#BFBFBF] bg-white text-base leading-normal text-[#414141] placeholder:text-[#414141] outline-none focus:border-(--color-secondary) focus:shadow-(--shadow-secondary) duration-300"
      />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-47 p-2 rounded-sm bg-[#FCD5BA] text-base leading-normal text-(--color-primary) enabled:hover:bg-(--color-primary) enabled:hover:text-white enabled:active:shadow-(--shadow-button-active) duration-300 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSending ? "Отправляем…" : "Отправить отзыв"}
        </button>
        {message && (
          <p role="status" className={`text-sm ${message.type === "error" ? "text-(--color-primary)" : "text-(--color-secondary)"}`}>
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
