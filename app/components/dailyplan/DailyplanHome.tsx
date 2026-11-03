"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DailyMeals from "./DailyMeals";
import {
  useDayNav,
  resetView,
  dateForOffset,
  dayLabel,
} from "../dashboard/MealsContext";
import HealthyHabits from "./HealthyHabits";

export default function DailyplanHome() {
  const { offset, canPrev, canNext, goPrev, goNext, goToday } = useDayNav();

  // Is page par aate aur jaate waqt din "Today" par reset, taake dashboard hamesha aaj dikhaye
  useEffect(() => {
    resetView();
    return () => resetView();
  }, []);

  const dateText = dateForOffset(offset).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main>
      <div className="grid gap-[18px] animate-[viewin_500ms_var(--ease)]">
        {/* Dates  */}
        <div className="flex flex-wrap gap-[12px] items-center justify-between">
          <div>
            <span
              suppressHydrationWarning
              className="text-[11px] tracking-[.08em] uppercase text-[#8E978F] "
            >
              {dateText}
              {Math.abs(offset) <= 1 && ` · ${dayLabel(offset)}`}
            </span>
          </div>
          <div className="flex gap-[8px] items-center ">
            <button
              type="button"
              onClick={goPrev}
              disabled={!canPrev}
              aria-label="Previous day"
              className="w-[34px] h-[34px] rounded-full grid place-items-center border border-[#1d2a2224] bg-white flex-none transition-colors duration-200 cursor-pointer hover:bg-[#f2f5f2] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={goToday}
              className={`py-[7px] px-[13px] text-[13px] inline-flex items-center justify-center gap-[8px] rounded-[999px] font-[500] transition-[transform,box-shadow,background-color] duration-[250ms] ease-[var(--ease)] whitespace-nowrap cursor-pointer ${
                offset === 0
                  ? "bg-[#E9F6EC] text-[#2E6B3E]"
                  : "bg-white border border-[#1d2a2224] hover:bg-[#f2f5f2]"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!canNext}
              aria-label="Next day"
              className="w-[34px] h-[34px] rounded-full grid place-items-center border border-[#1d2a2224] bg-white flex-none transition-colors duration-200 cursor-pointer hover:bg-[#f2f5f2] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <DailyMeals />
        <HealthyHabits />
      </div>
    </main>
  );
}