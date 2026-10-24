"use client";

import { ReactNode, useId, useRef, useState } from "react";
import Form from "next/form";
import Minus from "../../public/images/icons/minus.svg";
import X from "../../public/images/icons/x.svg";
import { IPriceRange } from "@/lib/get-price-range";

interface ICategoryFilterProps {
  action: string; // путь страницы категории — форма отправляется туда же с новыми ?minPrice&maxPrice&inStock
  bounds: IPriceRange; // самая низкая и самая высокая цена в категории
  minPrice?: number;
  maxPrice?: number;
  inStock: boolean;
  activeFilters?: ReactNode; // плашки применённых фильтров (серверный ActiveFilters) — показываем в панели на мобильном
}

// Кружок ползунка (как в макете: зелёный, белая обводка, мягкая зелёная тень).
// У <input type="range"> кружок стилизуется только псевдоэлементами, у Chrome и Firefox они разные
const thumbClass =
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-(--color-secondary) [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[2px_4px_8px_0px_#70c05b33] [&::-webkit-slider-thumb]:cursor-pointer " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-(--color-secondary) [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-[2px_4px_8px_0px_#70c05b33] [&::-moz-range-thumb]:cursor-pointer " +
  "[&:focus-visible::-webkit-slider-thumb]:ring-2 [&:focus-visible::-webkit-slider-thumb]:ring-(--color-primary) [&:focus-visible::-moz-range-thumb]:ring-2 [&:focus-visible::-moz-range-thumb]:ring-(--color-primary)";

// Два ползунка лежат друг на друге. Сам input прозрачный и не ловит клики — их ловят только кружки
const rangeClass = `absolute inset-0 w-full h-6 appearance-none bg-transparent pointer-events-none outline-none ${thumbClass}`;

const priceInputClass =
  "w-0 flex-1 h-10 px-4 bg-white border border-[#bfbfbf] rounded-sm text-base text-(--color-foreground) focus:border-(--color-secondary) outline-none " +
  // прячем стрелочки «вверх/вниз» у type="number" — в макете их нет
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

// Панель на мобильном/планшете выезжает слева (как в макете «Категория 768 — открыт фильтр»).
// starting:open: — с какого положения начинается анимация появления; transition-discrete — чтобы
// анимировалось и закрытие (иначе display: none срабатывает мгновенно).
// На десктопе (xl) тот же <dialog> — обычная колонка слева: display, позицию и анимацию переопределяем
const dialogClass =
  "fixed inset-y-0 left-0 m-0 h-full max-h-none w-full max-w-90 p-0 bg-transparent text-inherit backdrop:bg-black/20 " +
  "-translate-x-full open:translate-x-0 starting:open:-translate-x-full transition-[translate,display,overlay] transition-discrete duration-300 " +
  "xl:static xl:block xl:h-auto xl:max-w-none xl:translate-x-0 xl:transition-none";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const CategoryFilter = ({ action, bounds, minPrice, maxPrice, inStock, activeFilters }: ICategoryFilterProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const priceLabelId = useId();

  // В полях — строки, чтобы можно было стереть число и набрать новое
  const [min, setMin] = useState(String(minPrice ?? bounds.min));
  const [max, setMax] = useState(String(maxPrice ?? bounds.max));

  const minValue = clamp(Number(min) || bounds.min, bounds.min, bounds.max);
  const maxValue = clamp(Number(max) || bounds.max, bounds.min, bounds.max);

  const hasPriceRange = bounds.max > bounds.min;
  const span = bounds.max - bounds.min || 1;
  const toPercent = (value: number) => ((value - bounds.min) / span) * 100;

  // Поле потеряло фокус — приводим числа в порядок: в пределах категории и «от» не больше «до»
  const normalize = () => {
    setMin(String(Math.min(minValue, maxValue)));
    setMax(String(Math.max(minValue, maxValue)));
  };

  const resetPrice = () => {
    setMin(String(bounds.min));
    setMax(String(bounds.max));
  };

  // Цена на границе категории — это «без ограничения», такой параметр в URL не отправляем (у поля нет name)
  const minName = minValue > bounds.min ? "minPrice" : undefined;
  const maxName = maxValue < bounds.max ? "maxPrice" : undefined;

  const openDrawer = () => {
    dialogRef.current?.showModal();
    // Пока панель открыта, страница под ней не прокручивается
    document.documentElement.style.overflow = "hidden";
  };
  const closeDrawer = () => dialogRef.current?.close();

  return (
    <>
      {/* Мобильный и планшет: зелёная кнопка над товарами открывает панель */}
      <button
        type="button"
        onClick={openDrawer}
        className="xl:hidden w-32 h-8 bg-(--color-secondary) hover:opacity-80 rounded-sm text-xs text-white duration-300 cursor-pointer"
      >
        Фильтр
      </button>

      {/* <dialog> + showModal(): фокус остаётся внутри панели, Esc закрывает, страница под ней недоступна */}
      <dialog
        ref={dialogRef}
        aria-label="Фильтр"
        onClose={() => (document.documentElement.style.overflow = "")}
        // Клик мимо панели попадает в сам <dialog> (его затемнённый фон) — закрываем
        onClick={(e) => e.target === e.currentTarget && closeDrawer()}
        className={dialogClass}
      >
        <div className="flex flex-col gap-10 min-h-full p-5 bg-white rounded-sm shadow-[0px_8px_16px_0px_rgba(255,102,51,0.5)] xl:p-0 xl:bg-transparent xl:shadow-none">
          <div className="flex items-center justify-between p-2.5 bg-[#f3f2f1] rounded-sm font-bold">
            Фильтр
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Закрыть фильтр"
              className="xl:hidden -m-1 cursor-pointer"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Плашки применённых фильтров: на мобильном и планшете — здесь, на десктопе — над товарами */}
          {activeFilters && <div className="xl:hidden">{activeFilters}</div>}

          <Form action={action} scroll={false} onSubmit={closeDrawer} className="flex flex-col gap-10">
            {hasPriceRange && (
              <div role="group" aria-labelledby={priceLabelId} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span id={priceLabelId}>Цена</span>
                  <button
                    type="button"
                    onClick={resetPrice}
                    className="h-8 px-2 w-21 bg-[#f3f2f1] hover:bg-[#e6e5e3] rounded-sm text-xs text-[#606060] duration-300 cursor-pointer"
                  >
                    Очистить
                  </button>
                </div>

                <div className="flex items-center">
                  <input
                    type="number"
                    inputMode="numeric"
                    name={minName}
                    value={min}
                    min={bounds.min}
                    max={bounds.max}
                    onChange={(e) => setMin(e.target.value)}
                    onBlur={normalize}
                    aria-label="Цена от"
                    className={priceInputClass}
                  />
                  <Minus className="w-6 h-6 shrink-0 text-(--color-foreground)" aria-hidden="true" />
                  <input
                    type="number"
                    inputMode="numeric"
                    name={maxName}
                    value={max}
                    min={bounds.min}
                    max={bounds.max}
                    onChange={(e) => setMax(e.target.value)}
                    onBlur={normalize}
                    aria-label="Цена до"
                    className={priceInputClass}
                  />
                </div>

                <div className="relative h-6">
                  {/* Серая дорожка и зелёный отрезок между кружками.
                      Центр кружка ходит от 12px до (ширина - 12px), поэтому проценты считаем от ширины без 24px */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-xs bg-[#f3f2f1]" />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-1 bg-(--color-secondary)"
                    style={{
                      left: `calc(12px + (100% - 24px) * ${toPercent(minValue) / 100})`,
                      right: `calc(12px + (100% - 24px) * ${(100 - toPercent(maxValue)) / 100})`,
                    }}
                  />
                  <input
                    type="range"
                    min={bounds.min}
                    max={bounds.max}
                    value={minValue}
                    onChange={(e) => setMin(String(Math.min(Number(e.target.value), maxValue)))}
                    aria-label="Цена от"
                    // Оба кружка у правого края — левый должен быть сверху, иначе его не сдвинуть
                    className={`${rangeClass} ${minValue === maxValue && toPercent(minValue) > 50 ? "z-10" : ""}`}
                  />
                  <input
                    type="range"
                    min={bounds.min}
                    max={bounds.max}
                    value={maxValue}
                    onChange={(e) => setMax(String(Math.max(Number(e.target.value), minValue)))}
                    aria-label="Цена до"
                    className={rangeClass}
                  />
                </div>
              </div>
            )}

            <label className="flex items-center gap-2.5 w-fit cursor-pointer select-none">
              <input type="checkbox" name="inStock" value="true" defaultChecked={inStock} className="peer sr-only" />
              {/* Переключатель: серый → зелёный, кружок уезжает вправо */}
              <span
                aria-hidden="true"
                className="relative w-11.5 h-6 shrink-0 rounded-full bg-[#bfbfbf] peer-checked:bg-(--color-secondary) peer-focus-visible:ring-2 peer-focus-visible:ring-(--color-primary) duration-300 after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow-[0px_2px_6px_0px_rgba(0,0,0,0.15)] after:duration-300 peer-checked:after:translate-x-5.5"
              />
              В наличии
            </label>

            <button
              type="submit"
              className="h-10 w-full bg-(--color-primary) hover:shadow-(--shadow-primary) active:shadow-(--shadow-button-active) rounded-sm text-white duration-300 cursor-pointer"
            >
              Применить
            </button>
          </Form>
        </div>
      </dialog>
    </>
  );
};

export default CategoryFilter;
