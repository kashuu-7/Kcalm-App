"use client";

import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import { ONBOARDING_STEPS } from "../dashboard/onboarding";
import { useTargets } from "./useTargets";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function Targets() {
  const t = useTargets();
const v = (s: string) => (t.ready ? s : "—");

const rows = [
  ["Calories", v(`${t.calories.toLocaleString("en-US")} kcal`)],
  ["Protein", v(`${t.proteinG} g`)],
  ["Carbs", v(`${t.carbG} g`)],
  ["Fat", v(`${t.fatG} g`)],
  ["Activity", v(t.activity)],
  ["Cooking time", v(t.cookTime)],
];

  return (
    <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
      <div className="flex items-center gap-[10px] mb-[16px]">
        <h3
          className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
        >
          Your targets
        </h3>
        <div className="ml-auto flex items-center gap-[8px]">
          <Link
            href={ONBOARDING_STEPS[0].href}
            className="inline-flex items-center gap-[4px] text-[13.5px] font-[500] text-[#2E6B3E] hover:underline"
          >
            Recalibrate
          </Link>
        </div>
      </div>

      {rows.map(([label, value]) => (
        <div
          key={label}
          className="py-[9px] px-[4px] flex items-center gap-[12px] border-b border-[#1d2a2214] text-[14px] w-full text-left"
        >
          {label}
          <span className="text-[#1D2A22] font-[500] ml-auto flex items-center gap-[8px] text-[12.5px]">
            {value}
          </span>
        </div>
      ))}
    </article>
  );
}