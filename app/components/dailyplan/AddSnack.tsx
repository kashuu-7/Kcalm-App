"use client";

import { useEffect } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { X } from "lucide-react";
import type { Snack } from "../dashboard/MealsContext";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

type AddSnackProps = {
  options: Snack[];
  when: string; // "today", "yesterday" ...
  onPick: (snack: Snack) => void;
  onClose: () => void;
};

export default function AddSnack({
  options,
  when,
  onPick,
  onClose,
}: AddSnackProps) {
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
        aria-label="Add a snack"
        className="bg-white rounded-[26px] shadow-[var(--shadow-lg)] w-[min(560px,100%)] max-h-[86vh] overflow-auto p-6 max-sm:p-[18px] animate-[popin_350ms_var(--ease)]"
      >
        <div className="flex items-start gap-[12px] mb-[16px]">
          <div>
            <h3
              className={`${bricolage.className} text-[17px] font-semibold tracking-[-.02em] leading-[1.1] text-balance`}
            >
              Add a snack
            </h3>
            <p className="text-[13.5px] text-[#8E978F] mt-[4px]">
              Logged straight to {when}. Remaining calories update instantly.
            </p>
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
          {options.map((snack) => (
            <button
              key={snack.id}
              type="button"
              onClick={() => onPick(snack)}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-[14px] items-center p-2.5 rounded-2xl border-[1.5px] border-[#1d2a2214] text-left w-full cursor-pointer transition-all duration-200 hover:bg-[#E9F6EC] hover:border-[#4E9E5C] "
            >
              <span>
                <b className="text-[15px] block ">{snack.name}</b>
                <span className="mt-[6px] flex gap-[5px] flex-wrap ">
                  <span className="bg-[#e9f6ec] text-[#2e6b3e] text-[11px] py-[3px] px-[8px] rounded-[999px] ">
                    {snack.p}g P
                  </span>
                  <span className="bg-[#E7F3FC] text-[#2B6A93] text-[11px] py-[3px] px-[8px] rounded-[999px] ">
                    {snack.c}g C
                  </span>
                  <span className="bg-[#FFEFE7] text-[#A4502B] text-[11px] py-[3px] px-[8px] rounded-[999px] ">
                    {snack.f}g F
                  </span>
                </span>
              </span>
              <span>
                <b className="text-[15px] block tabular-nums ">{snack.kcal}</b>
                <small className="text-[12.5px] text-[#8E978F] ">kcal</small>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}