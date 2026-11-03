"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { mealBackground, type Meal, type MealSlot } from "./mealData";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

type FilterKey = "quick" | "protein" | "veg";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "quick", label: "Under 15 min" },
  { key: "protein", label: "Higher protein" },
  { key: "veg", label: "Vegetarian" },
];

type SwapMealModalProps = {
  slot: MealSlot;
  options: Meal[];
  current: Meal;
  onSelect: (meal: Meal) => void;
  onClose: () => void;
};

export default function SwapMealModal({
  slot,
  options,
  current,
  onSelect,
  onClose,
}: SwapMealModalProps) {
  const [filters, setFilters] = useState<FilterKey[]>([]);

  // Escape se band ho, aur modal khula ho to peeche page scroll na ho
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const toggleFilter = (key: FilterKey) => {
    setFilters((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const matches = (m: Meal) =>
    filters.every((f) => {
      if (f === "quick") return m.mins < 15;
      if (f === "protein") return m.p > current.p; // abhi wale meal se zyada protein
      return m.veg;
    });

  // Current meal hamesha dikhta hai, baaki sirf filter ke hisab se
  const visible = options.filter((m) => m.id === current.id || matches(m));
  const nothingElse =
    filters.length > 0 && visible.every((m) => m.id === current.id);

  return (
    <div
      className="fixed inset-0 bg-[#1d2a2247] backdrop-blur-sm z-[90] grid place-items-center p-4 animate-[fade_250ms]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Swap ${slot.type.toLowerCase()}`}
        className="bg-white rounded-[26px] shadow-[var(--shadow-lg)] w-full max-w-[560px] max-h-[86vh] overflow-auto p-6 max-sm:p-[18px] animate-[popin_.35s_var(--ease)]"
      >
        <div className="flex items-start gap-[12px] mb-[16px]">
          <div>
            <h3
              className={`${bricolage.className} text-[17px] font-semibold tracking-[-.02em] leading-[1.1] text-balance`}
            >
              Swap {slot.type.toLowerCase()}
            </h3>
            <p className="text-[13.5px] text-[#8E978F] mt-[4px]">
              Pick a replacement. Portions rebalance so your day stays on
              target.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto w-[34px] h-[34px] rounded-[50%] border border-[#1d2a2224] grid place-items-center bg-[#ffffff] flex-none transition-colors duration-200 hover:bg-[#f2f5f2]"
            aria-label="Close popup"
          >
            <X size={15} />
          </button>
        </div>

        <div className="grid gap-[10px]">
          {visible.map((m) => {
            const isCurrent = m.id === current.id;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => (isCurrent ? onClose() : onSelect(m))}
                className={`grid grid-cols-[64px_minmax(0,1fr)_auto] max-sm:grid-cols-[52px_minmax(0,1fr)_auto] gap-[14px] max-sm:gap-[10px] items-center p-2.5 rounded-2xl border-[1.5px] text-left w-full cursor-pointer transition-all duration-200 hover:border-[#4E9E5C] hover:bg-[#E9F6EC] ${
                  isCurrent
                    ? "border-[#4E9E5C] bg-[#E9F6EC]"
                    : "border-[#1d2a2214]"
                }`}
              >
                <div
                  className="w-16 h-[54px] max-sm:w-[52px] max-sm:h-[46px] rounded-xl relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_25%,_rgba(255,255,255,.55),_transparent_45%)]"
                  style={{ background: mealBackground(m.colors) }}
                ></div>
                <span>
                  <b className="text-[15px] block ">{m.name}</b>
                  <small className="text-[12.5px] text-[#8E978F] ">
                    {m.desc}
                  </small>
                  <span className="mt-[6px] flex gap-[5px] flex-wrap ">
                    <span className="text-[11px] py-[3px] px-[8px] rounded-[999px] bg-[#e9f6ec] text-[#2e6b3e] ">
                      {m.p}g P
                    </span>
                    <span className="text-[11px] py-[3px] px-[8px] rounded-[999px] bg-[#E7F3FC] text-[#2B6A93] ">
                      {m.c}g C
                    </span>
                    <span className="text-[11px] py-[3px] px-[8px] rounded-[999px] bg-[#FFEFE7] text-[#A4502B] ">
                      {m.f}g F
                    </span>
                  </span>
                </span>
                <span className="text-right">
                  <b className="text-[15px] block tabular-nums ">{m.kcal}</b>
                  <small className="text-[12.5px] text-[#8E978F] whitespace-nowrap">
                    kcal · {m.mins} min
                  </small>
                  {isCurrent && (
                    <>
                      <br />
                      <span className="mt-[4px] bg-[#E9F6EC] text-[#2E6B3E] inline-flex items-center gap-[6px] text-[12px] py-[4px] px-[10px] rounded-[999px] whitespace-nowrap ">
                        Current
                      </span>
                    </>
                  )}
                </span>
              </button>
            );
          })}

          {nothingElse && (
            <p className="text-[13px] text-[#8E978F] text-center py-[8px]">
              No other meals match these filters.
            </p>
          )}
        </div>

        <div className="flex gap-[8px] flex-wrap mt-[14px] ">
          <span className="w-full text-[12.5px] ">Quick filters</span>
          {FILTERS.map((f) => {
            const on = filters.includes(f.key);

            return (
              <button
                key={f.key}
                type="button"
                onClick={() => toggleFilter(f.key)}
                aria-pressed={on}
                className={`py-[7px] px-[12px] rounded-[999px] border-[1.5px] inline-flex items-center gap-[7px] cursor-pointer transition-all duration-200 ${
                  on
                    ? "border-[#4E9E5C] bg-[#E9F6EC] text-[#2E6B3E]"
                    : "border-[#1d2a2214] bg-[#ffffff] hover:border-[#1d2a2224]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}