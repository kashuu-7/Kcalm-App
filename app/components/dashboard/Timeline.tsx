"use client";

import { ArrowLeftRight, Check, ChevronRight, Clock, Play } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import { mealBackground } from "./mealData";
import { useMeals } from "./MealsContext";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function Timeline() {
  const { slots, meals, logged, activeIndex, toggleLogged, openSwap, error, retry } =
  useMeals("today");

  return (
    <div>
      <div className="flex items-center gap-[10px] mt-[8px] mb-[14px]">
        <div>
          <span className="text-[#8E978F] text-[11px] tracking-[.08em] uppercase">
            Paced nourishment
          </span>
          <h3
            className={`${bricolage.className} mt-[4px] text-[24px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            Today's meal timeline
          </h3>
        </div>
        <div className="ml-auto flex gap-[8px] items-center ">
          <Link
            href="/daily-plan"
            className="inline-flex items-center font-[500] gap-[4px] text-[#2E6B3E] text-[13.5px] hover:underline"
          >
            Full plan
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-[14px] rounded-[14px] bg-[#FFEFE7] px-[14px] py-[12px] text-[13px] text-[#A4502B]">
          <p>{error}</p>
          <button type="button" onClick={retry} className="mt-[8px] font-medium underline underline-offset-2">
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-4 max-[940px]:grid-cols-2 max-sm:grid-cols-1 gap-[16px] max-sm:gap-[22px]">
        {meals.map((meal, i) => {
          const slot = slots[i];
          const isLogged = logged[i];
          const isActive = i === activeIndex;

          return (
            <article
              key={slot.id}
              className={`rounded-[24px] p-[14px] flex flex-col gap-2.5 shadow-[var(--shadow)] relative transition-[transform,box-shadow] duration-[350ms] ease-[var(--ease)] hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(29,42,34,0.35)] ${
                isActive
                  ? "border-[1.5px] border-[#4e9e5c] bg-[linear-gradient(180deg,#e9f6ec,#ffffff_45%)]"
                  : "bg-white border border-[#1d2a2214]"
              }`}
            >
              {/* Up next badge */}
              {isActive && (
                <span className="absolute top-[-11px] left-1/2 -translate-x-1/2 bg-[#e8895f] text-white text-[11px] font-medium py-[3px] px-[11px] rounded-full whitespace-nowrap">
                  Up next · {slot.time}
                </span>
              )}

              {/* Top row: time + status */}
              <div className="flex items-center justify-between text-[11px] text-[#8E978F]">
                <span className="text-[10px] tracking-[.08em] uppercase text-[#8E978F]">
                  {slot.time} · {slot.type}
                </span>
                {isLogged && (
                  <span className="bg-[#E9F6EC] text-[#2E6B3E] inline-flex items-center gap-[6px] text-[12px] py-[4px] px-[10px] rounded-[999px] whitespace-nowrap ">
                    <Check size={11} />
                    Logged
                  </span>
                )}
                {!isLogged && !isActive && (
                  <span className="bg-[#F2F5F2] text-[#5B665F] inline-flex items-center gap-[6px] text-[12px] py-[4px] px-[10px] rounded-[999px] whitespace-nowrap ">
                    Planned
                  </span>
                )}
              </div>

              {/* Image area */}
              <div className="relative">
                <div
                  className="relative overflow-hidden h-[128px] rounded-[16px] after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_25%,#ffffff8c,transparent_45%)]"
                  style={{ background: mealBackground(meal.colors) }}
                ></div>
                <span className="absolute left-[10px] bottom-[10px] bg-[#1d2a22bf] text-white text-[10.5px] py-[3px] px-[8px] rounded-full z-[1]">
                  {meal.kcal} kcal
                </span>
                <span className="absolute right-[10px] top-[10px] bg-[#ffffffe6] text-[11px] py-[3px] px-[8px] rounded-full z-[1] flex gap-1 items-center">
                  <Clock size={11} />
                  {meal.mins} min
                </span>
              </div>

              <h4
                className={`${bricolage.className} text-[17px] font-semibold tracking-[-.02em] leading-[1.1] text-balance`}
              >
                {meal.name}
              </h4>
              <p className="text-[12.5px] text-[#8E978F] leading-[1.4] min-h-[35px]">
                {meal.desc}
              </p>

              <div className="flex flex-wrap gap-[5px]">
                <span className="text-[11px] py-[3px] px-[8px] rounded-[999px] bg-[#e9f6ec] text-[#2e6b3e] ">
                  {meal.p}g P
                </span>
                <span className="text-[11px] py-[3px] px-[8px] rounded-[999px] bg-[#E7F3FC] text-[#2B6A93] ">
                  {meal.c}g C
                </span>
                <span className="text-[11px] py-[3px] px-[8px] rounded-[999px] bg-[#FFEFE7] text-[#A4502B] ">
                  {meal.f}g F
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-[6px] mt-auto">
                <Link
                  href="/recipe-player"
                  className={`flex-1 py-[8px] px-[10px] text-[12.5px] inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[transform,box-shadow,background] duration-[250ms] ease-[var(--ease)] whitespace-nowrap cursor-pointer  ${
                    isActive
                      ? "text-[#ffffff] bg-[#2E6B3E] border border-transparent"
                      : "bg-white border border-[#1d2a2224] hover:bg-[#F2F5F2]"
                  }`}
                >
                  <Play size={13} />
                  {isActive ? "Cook now" : "Recipe"}
                </Link>
                <button
                  type="button"
                  onClick={() => openSwap(i)}
                  aria-label="Swap meal"
                  className="w-[34px] h-[34px] rounded-full grid place-items-center border border-[#1d2a2224] bg-white flex-none transition-colors duration-200 cursor-pointer hover:bg-[#F2F5F2]"
                >
                  <ArrowLeftRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => toggleLogged(i)}
                  aria-pressed={isLogged}
                  aria-label={isLogged ? "Mark as not eaten" : "Mark as eaten"}
                  className={`w-[34px] h-[34px] rounded-full grid place-items-center border flex-none transition-colors duration-200 cursor-pointer  ${
                    isLogged
                      ? "bg-[#4e9e5c] text-white border-transparent "
                      : "bg-white border-[#1d2a2224] hover:bg-[#F2F5F2]"
                  }`}
                >
                  <Check size={15} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
