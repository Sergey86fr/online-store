import { cookies, headers } from "next/headers";
import { userAgent } from "next/server";
import { PAGE_LIMITS, PAGE_LIMIT_COOKIE, isPageLimit } from "@/lib/page-limit";

// Лимит карточек на страницу для текущего посетителя.
// Ширину экрана сервер сам не знает, её сообщает браузер через cookie (см. PageLimitSync).
// При первом заходе cookie ещё нет — угадываем по User-Agent, браузер потом поправит
export const getPageLimit = async (): Promise<number> => {
  const fromCookie = Number((await cookies()).get(PAGE_LIMIT_COOKIE)?.value);
  if (isPageLimit(fromCookie)) return fromCookie;

  const { device } = userAgent({ headers: await headers() });
  if (device.type === "mobile") return PAGE_LIMITS.mobile;
  if (device.type === "tablet") return PAGE_LIMITS.tablet;
  return PAGE_LIMITS.desktop;
};
