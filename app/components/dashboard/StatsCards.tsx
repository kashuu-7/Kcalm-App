"use client";

import { useEffect, useState } from "react";
import { Flame, Wheat, Heart, Dumbbell } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { useMeals } from "./MealsContext";
import { useTargets } from "../profile/useTargets";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const fmt = (n: number) => n.toLocaleString("en-US");
const CIRCUMFERENCE = 2 * Math.PI * 25.5;

// Yahan sirf naam, icon aur rang hain. Numbers neeche component mein nikalte hain.
const STATS = [
  {
    key: "kcal",
    title: "Calories",
    unit: "Kcal",
    icon: Flame,
    iconBg: "#FFEFE7",
    iconColor: "#C2582B",
    progressColor: "#E8895F",
  },
  {
    key: "p",
    title: "Protein",
    unit: "g",
    icon: Dumbbell,
    iconBg: "#E9F6EC",
    iconColor: "#2E6B3E",
    progressColor: "#4E9E5C",
  },
  {
    key: "c",
    title: "Complex Carbs",
    unit: "g",
    icon: Wheat,
    iconBg: "#E7F3FC",
    iconColor: "#2B6A93",
    progressColor: "#3F8FC4",
  },
  {
    key: "f",
    title: "Healthy fats",
    unit: "g",
    icon: Heart,
    iconBg: "#FFF3CF",
    iconColor: "#9A7414",
    progressColor: "#E8895F",
  },
] as const;

export default function StatsCards() {
  const { meals, logged, snacks } = useMeals("today");
  const targets = useTargets();
  const [mounted, setMounted] = useState(false);

  // Pehli baar ring aur bars 0 se apni value tak uthen
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Sirf tick kiye hue meals + add kiye hue snacks
  const eaten = [...meals.filter((_, i) => logged[i]), ...snacks];
  const consumed = eaten.reduce(
    (sum, m) => ({
      kcal: sum.kcal + m.kcal,
      p: sum.p + m.p,
      c: sum.c + m.c,
      f: sum.f + m.f,
    }),
    { kcal: 0, p: 0, c: 0, f: 0 },
  );

  const goals = {
    kcal: targets.calories,
    p: targets.proteinG,
    c: targets.carbG,
    f: targets.fatG,
  };

  return (
    <div className="grid grid-cols-4 max-[1100px]:grid-cols-2 max-[600px]:grid-cols-1 gap-[18px] animate-[viewin_.5s_var(--ease)]">
      {STATS.map((stat) => {
        const Icon = stat.icon;
        const value = consumed[stat.key];
        const goal = goals[stat.key];

        const percentage = goal > 0 ? Math.round((value / goal) * 100) : 0;
        const shown = Math.min(100, percentage); // ring aur bar 100% se aage nahi jate
        const offset = CIRCUMFERENCE * (1 - shown / 100);
        const left = goal - value;

        const description =
          stat.key === "kcal"
            ? `of ${fmt(goal)} · ${fmt(Math.abs(left))} ${left >= 0 ? "left" : "over"}`
            : `of ${fmt(goal)} g target`;

        return (
          <article
            key={stat.title}
            className="flex flex-col gap-[12px] relative overflow-hidden transition-transform duration-[350ms] ease-[var(--ease)] bg-white border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0 hover:-translate-y-[3px]"
          >
            {/* Icon and title */}
            <div className="flex items-center gap-[10px] font-[500]">
              <span
                style={{
                  backgroundColor: stat.iconBg,
                  color: stat.iconColor,
                }}
                className="w-[34px] h-[34px] rounded-[11px] grid place-items-center flex-none"
              >
                <Icon size={17} />
              </span>
              {stat.title}
            </div>

            {/* Value and circular progress */}
            <div className="flex items-end justify-between gap-[12px]">
              <div className="min-w-0">
                <div
                  className={`${bricolage.className} text-[30px] tracking-[-.04em] leading-[1] tabular-nums`}
                >
                  {fmt(value)}
                  <small className="text-[#8E978F] text-[13px] tracking-normal ml-[3px]">
                    {stat.unit}
                  </small>
                </div>

                <div className="text-[12.5px] text-[#8E978F] mt-[4px]">
                  {description}
                </div>
              </div>

              {/* SVG ring */}
              <div className="relative w-[58px] h-[58px] flex-none">
                <svg
                  width="58"
                  height="58"
                  viewBox="0 0 58 58"
                  className="rotate-[-90deg]"
                  aria-hidden="true"
                >
                  <circle
                    cx="29"
                    cy="29"
                    r="25.5"
                    fill="none"
                    stroke="#F2F5F2"
                    strokeWidth="7"
                  />
                  <circle
                    cx="29"
                    cy="29"
                    r="25.5"
                    fill="none"
                    stroke={stat.progressColor}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={mounted ? offset : CIRCUMFERENCE}
                    className="transition-[stroke-dashoffset] duration-[1200ms] ease-[var(--ease)] motion-reduce:transition-none"
                  />
                </svg>

                <div className="absolute inset-0 grid place-items-center text-center">
                  <span className="text-[9px] tracking-[.08em] uppercase text-[#8E978F] tabular-nums">
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom progress bar */}
            <div
              className="h-[5px] rounded-[6px] bg-[#F2F5F2] overflow-hidden"
              role="progressbar"
              aria-label={`${stat.title} progress`}
              aria-valuenow={shown}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <i
                style={{
                  width: mounted ? `${shown}%` : "0%",
                  backgroundColor: stat.progressColor,
                }}
                className="block h-full rounded-[6px] transition-[width] duration-[1200ms] ease-[var(--ease)] motion-reduce:transition-none"
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}