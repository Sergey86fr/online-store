"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DESKTOP_QUERY, PAGE_LIMITS, PAGE_LIMIT_COOKIE, TABLET_QUERY } from "@/lib/page-limit";

// Ничего не рисует. Смотрит на ширину экрана, кладёт нужный лимит в cookie
// и просит сервер перерисовать страницу, если лимит не совпал с тем, что он использовал.
// Срабатывает и при первом заходе, и при изменении ширины окна (поворот планшета, ресайз)
const PageLimitSync = ({ currentLimit }: { currentLimit: number }) => {
  const router = useRouter();

  useEffect(() => {
    const tablet = window.matchMedia(TABLET_QUERY);
    const desktop = window.matchMedia(DESKTOP_QUERY);

    const sync = () => {
      const limit = desktop.matches
        ? PAGE_LIMITS.desktop
        : tablet.matches
          ? PAGE_LIMITS.tablet
          : PAGE_LIMITS.mobile;

      document.cookie = `${PAGE_LIMIT_COOKIE}=${limit}; path=/; max-age=31536000; samesite=lax`;
      if (limit !== currentLimit) router.refresh();
    };

    sync();
    tablet.addEventListener("change", sync);
    desktop.addEventListener("change", sync);
    return () => {
      tablet.removeEventListener("change", sync);
      desktop.removeEventListener("change", sync);
    };
  }, [currentLimit, router]);

  return null;
};

export default PageLimitSync;
