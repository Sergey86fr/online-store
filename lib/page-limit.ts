// Общие настройки лимита карточек на страницу — импортируются и на сервере, и в браузере

// Кратно числу колонок в сетке, чтобы последний ряд был заполнен:
// мобильный — 2 колонки, планшет (md) — 3, десктоп (xl) — 4
export const PAGE_LIMITS = {
  mobile: 8,
  tablet: 12,
  desktop: 20,
} as const;

// Cookie, в которую браузер записывает лимит под текущую ширину экрана
export const PAGE_LIMIT_COOKIE = "page-limit";

// Те же границы, что у Tailwind: md = 768px, xl = 1280px
export const TABLET_QUERY = "(min-width: 768px)";
export const DESKTOP_QUERY = "(min-width: 1280px)";

export const isPageLimit = (value: number): boolean =>
  (Object.values(PAGE_LIMITS) as number[]).includes(value);
