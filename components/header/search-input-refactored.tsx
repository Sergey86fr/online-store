"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Search from "../../public/images/header/search.svg";
import Menu from "../../public/images/header/menu.svg";
import { SEARCH_MIN_LENGTH, splitByMatch } from "@/lib/search";
import { ISearchResponse } from "@/types/search";

// Сколько ждём после последнего нажатия, прежде чем отправить запрос
const DEBOUNCE_MS = 300;

// Текст подсказки: совпавшая с запросом часть — жирным, как в макете («Коктейль **Моло**чный»)
const Highlight = ({ text, query }: { text: string; query: string }) =>
  splitByMatch(text, query).map((part, index) =>
    part.match ? (
      <b key={index} className="font-bold">
        {part.text}
      </b>
    ) : (
      part.text
    ),
  );

// Поиск в шапке с подсказками. От SEARCH_MIN_LENGTH символов под полем появляется окно:
// первой строкой — категория, ниже — товары с похожим названием.
// Запрос уходит не на каждое нажатие, а через DEBOUNCE_MS после того, как пользователь перестал печатать
const SearchInputRefactored = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  // Запоминаем, для какого запроса пришли подсказки: по нему подсвечиваем совпадения,
  // а пока печатается новый запрос — показываем старые подсказки, чтобы окно не мигало
  const [results, setResults] = useState<{ query: string; data: ISearchResponse } | null>(null);

  const trimmedQuery = query.trim();
  const isLongEnough = trimmedQuery.length >= SEARCH_MIN_LENGTH;

  // Дебаунс: каждое изменение запроса перезапускает таймер. Cleanup ниже срабатывает
  // перед следующим запуском эффекта — отменяет таймер и уже отправленный запрос.
  // Так ответ на устаревший запрос («мо») не перетрёт ответ на новый («моло»)
  useEffect(() => {
    if (trimmedQuery.length < SEARCH_MIN_LENGTH) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data: ISearchResponse = await response.json();
        setResults({ query: trimmedQuery, data });
      } catch (error) {
        // Отмена запроса — не ошибка, а наш собственный abort() из cleanup
        if (!controller.signal.aborted) console.error("Ошибка поиска:", error);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery]);

  const isDropdownVisible = isOpen && isLongEnough && results !== null;
  const isEmpty = results !== null && results.data.category === null && results.data.products.length === 0;

  const close = () => setIsOpen(false);

  // Enter или кнопка-лупа: страницы результатов поиска пока нет — ведём в найденную категорию
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const category = results?.query === trimmedQuery ? results.data.category : null;
    if (!category) return;
    close();
    router.push(`/catalog/${category.slug}`);
  };

  return (
    // Обёртка держит высоту поля в шапке, а само поле с подсказками — absolute:
    // раскрываясь, оно ложится поверх страницы и не раздвигает шапку
    <div className="relative w-full min-w-0 md:min-w-65 h-10">
      <form
        role="search"
        onSubmit={handleSubmit}
        // Фокус ушёл за пределы поиска (Tab дальше, клик мимо) — закрываем
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) close();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") close();
        }}
        className="absolute inset-x-0 top-0 z-20 flex flex-col gap-2.5 py-2 px-4 bg-white border border-(--color-secondary) rounded-sm focus-within:shadow-(--shadow-secondary)"
      >
        <div className="flex items-center h-6">
          <input
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            aria-label="Найти товар"
            placeholder="Найти товар"
            autoComplete="off"
            className="w-full text-base leading-normal text-[#333] placeholder:text-[#8F8F8F] outline-none"
          />
          <button type="submit" aria-label="Найти" className="cursor-pointer text-[#414141]">
            <Search aria-hidden="true" className="w-6 h-6" />
          </button>
        </div>

        {isDropdownVisible && (
          // preventDefault на mousedown: клик по подсказке не забирает фокус у поля,
          // поэтому onBlur не закрывает окно раньше, чем сработает переход по ссылке
          <ul className="flex flex-col gap-2.5" onMouseDown={(event) => event.preventDefault()}>
            {isEmpty && <li className="leading-normal text-[#8F8F8F]">Ничего не найдено</li>}

            {results.data.category && (
              <li>
                <Link
                  href={`/catalog/${results.data.category.slug}`}
                  onClick={close}
                  className="inline-flex items-center gap-4 leading-normal text-[#414141] hover:text-(--color-primary) focus-visible:text-(--color-primary) duration-300"
                >
                  <span>
                    <Highlight text={results.data.category.label} query={results.query} />
                  </span>
                  <Menu aria-hidden="true" className="w-6 h-6 shrink-0" />
                </Link>
              </li>
            )}

            {results.data.products.map((product) => (
              <li key={product.id}>
                {/* TODO: страницы товара пока нет — ведём в его категорию. Появится /product/[id] — поменять href */}
                <Link
                  href={`/catalog/${product.category}`}
                  onClick={close}
                  className="leading-normal text-[#414141] hover:text-(--color-primary) focus-visible:text-(--color-primary) duration-300"
                >
                  <Highlight text={product.title} query={results.query} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default SearchInputRefactored;
