"use client";

import React, { useEffect, useState } from "react";
import { Leaf } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { useTargets } from "../profile/useTargets";
import {
  fetchNutritionSummary,
  fetchTodayNutrition,
  type TodayNutrition,
} from "../../lib/api/tracking";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

type Row = { label: string; value: number | null; bar: string; suffix?: string };

export default function Nutrition() {
  const t = useTargets();
  const [n, setN] = useState<TodayNutrition>({ protein: 0, fiber: 0, micro: 0, sugarG: null });
  // Aaj ka score backend nikalta hai (null = abhi nikal nahi sakta, jaise koi planned meal tick nahi hua)
  const [score, setScore] = useState<number | null>(null);

  // Aaj ka protein, fiber, micronutrients aur added sugar backend se
  useEffect(() => {
    if (!t.ready) return;
    let cancelled = false;
    fetchTodayNutrition(t.proteinG)
      .then((data) => {
        if (!cancelled) setN(data);
      })
      .catch(() => {
        /* nahi aaya to 0 rahega */
      });
    return () => {
      cancelled = true;
    };
  }, [t.ready, t.proteinG]);

  useEffect(() => {
    let cancelled = false;
    fetchNutritionSummary(1)
      .then((s) => {
        if (!cancelled) setScore(s.nutrition_score);
      })
      .catch(() => {
        /* nahi aaya to "-" */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const percent = score === null ? 0 : Math.round(score);
  const scoreText = score === null ? "–" : (score / 10).toFixed(1);

  // Added sugar ka koi target backend nahi deta, isliye bar khali aur gram likhe hote hain
  const rows: Row[] = [
    { label: "Protein", value: n.protein, bar: "bg-[#4E9E5C]" },
    { label: "Fiber", value: n.fiber, bar: "bg-[#4E9E5C]" },
    { label: "Micronutrients", value: n.micro, bar: "bg-[#3F8FC4]" },
    {
      label: "Added sugar",
      value: n.sugarG === null ? null : Math.round(n.sugarG),
      bar: "bg-[#E8895F]",
      suffix: " g",
    },
  ];

  const message =
    score === null
      ? "Log today's planned meals to see your nutrition score."
      : percent >= 80
        ? "Great job! Your meals are close to your targets."
        : "Keep going. Aim to stay close to your calorie and macro targets.";

  return (
    <article className="bg-white border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
      <div className="flex items-center gap-[10px] mb-[16px]">
        <span className="w-[30px] h-[30px] rounded-[10px] bg-[#E9F6EC] text-[#2E6B3E] grid place-items-center ">
            <Leaf size={15} />
        </span>
        <h3 className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}>
            Nutrition score
        </h3>
      </div>
      <div className={`${bricolage.className} text-[46px] tracking-[-.05em] tabular-nums `}>
        {scoreText}
        <span className="text-[#8E978F] text-[18px] "> / 10</span>
      </div>
      <p className="text-[13px] mt-[4px] mb-[12px] text-[#8E978F] ">
        {message}
      </p>
      <div className="h-[8px] rounded-[6px] bg-[#F2F5F2] overflow-hidden ">
        <i
          className="block h-full rounded-[6px] bg-[#4E9E5C] transition-[width] duration-[1200ms] ease-[var(--ease)]"
          style={{ width: `${percent}%` }}
        ></i>
      </div>
      <div className="grid gap-[8px] text-[13px] mt-[16px] ">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[100px_1fr_32px] gap-2 items-center">
            <span>{r.label}</span>
            <div className="h-[5px] rounded-[6px] bg-[#F2F5F2] overflow-hidden ">
                <i
                    className={`block h-full rounded-[6px] ${r.bar} transition-[width] duration-[1200ms] ease-[var(--ease)]`}
                    style={{ width: r.suffix ? "0%" : `${r.value ?? 0}%` }}
                ></i>
            </div>
            <span className="text-[#8E978F] text-right tabular-nums">
              {r.value === null ? "–" : `${r.value}${r.suffix ?? ""}`}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}