"use client";

import { useState } from "react";
import Share from "../../public/images/icons/share.svg";

// Сколько показываем «Ссылка скопирована»
const COPIED_MS = 2000;

// «Поделиться»: на телефоне открывает системное меню (navigator.share),
// на компьютере, где его обычно нет, — копирует ссылку на страницу в буфер обмена
const ShareButton = ({ title }: { title: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), COPIED_MS);
    } catch {
      // Пользователь закрыл меню «Поделиться» или браузер не дал доступ к буферу — ничего не делаем
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="h-8 flex items-center gap-2 p-2 rounded-sm text-xs leading-normal text-[#606060] hover:text-(--color-primary) duration-300 cursor-pointer"
    >
      <Share aria-hidden="true" className="w-6 h-6 shrink-0 text-[#414141]" />
      {/* aria-live: экранный диктор прочитает «Ссылка скопирована» */}
      <span aria-live="polite">{isCopied ? "Ссылка скопирована" : "Поделиться"}</span>
    </button>
  );
};

export default ShareButton;
