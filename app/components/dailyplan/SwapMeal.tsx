"use client";

import { useEffect } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { ChevronRight, X } from "lucide-react";
import {
  mealBackground,
  type Meal,
  type MealSlot,
} from "../dashboard/mealData";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

type SwapMealProps = {
  slots: MealSlot[];
  meals: Meal[];
  onPick: (index: number) => void;
  onClose: () => void;
};

export default function SwapMeal({
  slots,
  meals,
  onPick,
  onClose,
}: SwapMealProps) {
  // Escape se band ho, aur box khula ho to peeche page scroll na ho
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-[#1d2a22]/[0.28] backdrop-blur-[4px] z-[90] grid place-items-center p-4 animate-[fade_250ms]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Which meal would you like to swap?"
        className="bg-white rounded-[26px] shadow-[var(--shadow-lg)] w-[min(560px,100%)] max-h-[86vh] overflow-auto p-6 max-sm:p-[18px] animate-[popin_350ms_var(--ease)]"
      >
        <div className="flex items-start gap-[12px] mb-[16px]">
          <div>
            <h3
              className={`${bricolage.className} text-[17px] font-semibold tracking-[-.02em] leading-[1.1] text-balance`}
            >
              Which meal would you like to swap?
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close popup"
            className="ml-auto w-[34px] h-[34px] rounded-[50%] border border-[#1d2a2224] grid place-items-center bg-[#ffffff] flex-none transition-colors duration-200 hover:bg-[#f2f5f2] cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <div className="grid gap-[10px]">
          {slots.map((slot, i) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => onPick(i)}
              className="grid grid-cols-[64px_minmax(0,1fr)_auto] max-sm:grid-cols-[52px_minmax(0,1fr)_auto] gap-[14px] max-sm:gap-[10px] items-center p-2.5 rounded-2xl border-[1.5px] border-[#1d2a2214] text-left w-full cursor-pointer transition-all duration-200 hover:bg-[#E9F6EC] hover:border-[#4E9E5C]"
            >
              <div
                className="w-[64px] h-[54px] max-sm:w-[52px] max-sm:h-[46px] rounded-xl relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_25%,_rgba(255,255,255,.55),_transparent_45%)]"
                style={{ background: mealBackground(meals[i].colors) }}
              />
              <span>
                <b className="text-[15px] block ">{slot.type}</b>
                <small className="text-[12.5px] text-[#8E978F] ">
                  {meals[i].name}
                </small>
              </span>
              <ChevronRight size={16} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}