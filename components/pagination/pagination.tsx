import Link from "next/link";
import ArrowLeft from "../../public/images/icons/arrow-left.svg";
import ArrowDoubleLeft from "../../public/images/icons/arrow-double-left.svg";
import ArrowDoubleRight from "../../public/images/icons/arrow-double-rigth.svg";

interface IPaginationProps {
  page: number;
  totalPages: number;
  // Как собрать ссылку на страницу. По умолчанию — "?page=N" (текущий путь сохраняется).
  // Для статей или страниц с фильтрами можно передать свою функцию.
  getHref?: (page: number) => string;
  className?: string;
}

// Сколько ячеек (номера + троеточия) показываем максимум.
// Нечётное число, чтобы текущая страница стояла по центру
const MOBILE_SLOTS = 5;
const DESKTOP_SLOTS = 7;

type PageItem = number | "ellipsis-left" | "ellipsis-right";

const range = (from: number, to: number): number[] =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

// Собирает список номеров для отображения. Для 7 ячеек:
// 1 2 3 4 5 … 20  |  1 … 9 10 11 … 20  |  1 … 16 17 18 19 20
const getPageItems = (page: number, totalPages: number, maxSlots: number): PageItem[] => {
  if (totalPages <= maxSlots) {
    return range(1, totalPages);
  }

  // Первая и последняя страницы видны всегда, ещё 2 ячейки уходят на троеточия,
  // остальное — текущая страница и соседи слева/справа
  const siblings = Math.floor((maxSlots - 5) / 2); // 7 → 1 сосед, 5 → 0
  const edge = maxSlots - 2; // сколько номеров подряд показываем у края

  // Близко к началу — троеточие слева спрятало бы всего одну страницу, поэтому его не ставим
  if (page <= siblings + 3) {
    return [...range(1, edge), "ellipsis-right", totalPages];
  }

  if (page >= totalPages - siblings - 2) {
    return [1, "ellipsis-left", ...range(totalPages - edge + 1, totalPages)];
  }

  return [
    1,
    "ellipsis-left",
    ...range(page - siblings, page + siblings),
    "ellipsis-right",
    totalPages,
  ];
};

// Компактный вариант для мобильного: без первой и последней страницы
// (до них достают кнопки « и »), зато соседи текущей видны всегда:
// 1 2 3 4 …  |  … 3 4 5 …  |  … 17 18 19 20
const getCompactPageItems = (page: number, totalPages: number, maxSlots: number): PageItem[] => {
  if (totalPages <= maxSlots) {
    return range(1, totalPages);
  }

  const edge = maxSlots - 1; // номеров у края, когда троеточие только одно

  if (page <= edge - 1) {
    return [...range(1, edge), "ellipsis-right"];
  }

  if (page >= totalPages - edge + 2) {
    return ["ellipsis-left", ...range(totalPages - edge + 1, totalPages)];
  }

  const siblings = Math.floor((maxSlots - 2) / 2); // 5 ячеек → по 1 соседу
  return ["ellipsis-left", ...range(page - siblings, page + siblings), "ellipsis-right"];
};

// На мобильном ячейки 32px, с планшета — 40px
const cellClass =
  "flex items-center justify-center min-w-8 h-8 md:min-w-10 md:h-10 px-1 md:px-2 rounded text-base md:text-lg select-none";
const iconClass = "w-8 h-8 md:w-10 md:h-10";

interface INavButtonProps {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}

// Кнопка-стрелка. Ссылку нельзя «выключить», поэтому неактивная кнопка — просто span
const NavButton = ({ href, disabled, label, children }: INavButtonProps) =>
  disabled ? (
    <span aria-disabled="true" aria-label={label} className={`${cellClass} opacity-30 cursor-not-allowed`}>
      {children}
    </span>
  ) : (
    <Link
      href={href}
      aria-label={label}
      className={`${cellClass} hover:bg-black/5 duration-300`}
    >
      {children}
    </Link>
  );

const Pagination = ({
  page,
  totalPages,
  getHref = (p) => `?page=${p}`,
  className,
}: IPaginationProps) => {
  // Все элементы помещаются на одну страницу — пагинация не нужна
  if (totalPages <= 1) return null;

  // Защита от ?page=999 или ?page=0 в адресной строке
  const current = Math.min(Math.max(page, 1), totalPages);
  const isFirst = current === 1;
  const isLast = current === totalPages;

  // Ширину экрана сервер не знает, поэтому рисуем оба набора номеров,
  // а лишний прячем через CSS: liClass = "md:hidden" или "hidden md:block"
  const renderItems = (items: PageItem[], liClass: string, keyPrefix: string) =>
    items.map((item) =>
      typeof item === "number" ? (
        <li key={`${keyPrefix}-${item}`} className={liClass}>
          {item === current ? (
            <span
              aria-current="page"
              className={`${cellClass} bg-(--color-primary) text-white font-bold`}
            >
              {item}
            </span>
          ) : (
            <Link href={getHref(item)} className={`${cellClass} hover:bg-black/5 duration-300`}>
              {item}
            </Link>
          )}
        </li>
      ) : (
        <li key={`${keyPrefix}-${item}`} aria-hidden="true" className={liClass}>
          <span className={cellClass}>…</span>
        </li>
      )
    );

  return (
    <nav aria-label="Пагинация" className={`flex justify-center mt-8 xl:mt-10 ${className ?? ""}`}>
      <ul className="flex items-center justify-center gap-0.5 md:gap-1 text-(--color-foreground)">
        <li>
          <NavButton href={getHref(1)} disabled={isFirst} label="Первая страница">
            <ArrowDoubleLeft className={iconClass} aria-hidden="true" />
          </NavButton>
        </li>
        <li>
          <NavButton href={getHref(current - 1)} disabled={isFirst} label="Предыдущая страница">
            <ArrowLeft className={iconClass} aria-hidden="true" />
          </NavButton>
        </li>

        {renderItems(getCompactPageItems(current, totalPages, MOBILE_SLOTS), "md:hidden", "m")}
        {renderItems(getPageItems(current, totalPages, DESKTOP_SLOTS), "hidden md:block", "d")}

        <li>
          <NavButton href={getHref(current + 1)} disabled={isLast} label="Следующая страница">
            {/* Отдельной иконки «вправо» в размере 40×40 нет — разворачиваем левую */}
            <ArrowLeft className={`${iconClass} rotate-180`} aria-hidden="true" />
          </NavButton>
        </li>
        <li>
          <NavButton href={getHref(totalPages)} disabled={isLast} label="Последняя страница">
            <ArrowDoubleRight className={iconClass} aria-hidden="true" />
          </NavButton>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
