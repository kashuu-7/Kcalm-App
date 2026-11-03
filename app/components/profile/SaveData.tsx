"use client";

import { ChevronRight, Leaf } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { useProfile } from "./ProfileContext";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function SaveData() {
  const { openEdit } = useProfile();

  return (
    <div className="flex items-center gap-4 rounded-[24px] py-[18px] px-[22px] bg-[linear-gradient(120deg,#e9f6ec,#f0edfd)] flex-wrap">
      <span className="w-[44px] h-[44px] rounded-[14px] grid place-items-center bg-[#fff] text-[#2E6B3E]">
        <Leaf size={20} />
      </span>
      <div>
        <h3
          className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
        >
          Your health journey matters
        </h3>
        <p className="text-[#8E978F] text-[13.5px]">
          Keep your profile up to date for more accurate recommendations.
        </p>
      </div>
      <button
        type="button"
        onClick={openEdit}
        aria-haspopup="dialog"
        className="ml-auto inline-flex cursor-pointer items-center justify-center gap-2 rounded-full py-[11px] px-[20px] font-medium text-sm transition-[translate,box-shadow] duration-200 ease-out whitespace-nowrap bg-[#2e6b3e] text-white shadow-[0_10px_24px_-12px_rgba(46,107,62,0.6)] hover:-translate-y-[1px] hover:shadow-[0_14px_28px_-12px_rgba(46,107,62,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
      >
        Update profile
        <ChevronRight size={14} />
      </button>
    </div>
  );
}