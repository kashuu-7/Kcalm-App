"use client";

import { useEffect, useState } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { Sun, FlaskConical, Activity, Leaf } from "lucide-react";
import { useMeals } from "./MealsContext";
import { useTargets } from "../profile/useTargets";
import {
  fetchMicronutrientsToday,
  type MicroActual,
} from "../../lib/api/tracking";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const fmt = (n: number) => n.toLocaleString("en-US");
const CIRCUMFERENCE = 2 * Math.PI * 79; // 496.37

// 4 tiles ka design wahi; `code` backend ke micronutrient ka naam hai
const nutrients = [
  {
    code: "vitamin_d",
    title: "Vitamin D3",
    icon: Sun,
    bg: "#FFF3CF",
    iconColor: "#E2B232",
    barColor: "#E2B232",
  },
  {
    code: "calcium",
    title: "Calcium",
    icon: FlaskConical,
    bg: "#E7F3FC",
    iconColor: "#3F8FC4",
    barColor: "#3F8FC4",
  },
  {
    code: "iron",
    title: "Bioavailable iron",
    icon: Activity,
    bg: "#FCE4EA",
    iconColor: "#D0566B",
    barColor: "#D0566B",
  },
  {
    code: "fiber",
    title: "Prebiotic fiber",
    icon: Leaf,
    bg: "#E9F6EC",
    iconColor: "#4E9E5C",
    barColor: "#4E9E5C",
  },
];

export default function CenterLeft() {
  const { meals, logged, snacks } = useMeals("today");
  const { calories } = useTargets();
  const [mounted, setMounted] = useState(false);

  // Pehli baar ring 0 se apni value tak uthe
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Aaj ke micronutrients backend se. Meal tick ya snack badle to thodi der baad dobara
  // (backend ko log save karne ka waqt dene ke liye)
  const [micro, setMicro] = useState<Record<string, MicroActual>>({});
  const eatenKey = `${logged.join(",")}:${snacks.length}`;

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      fetchMicronutrientsToday()
        .then((rows) => {
          if (cancelled) return;
          const byCode: Record<string, MicroActual> = {};
          for (const r of rows) byCode[r.code] = r;
          setMicro(byCode);
        })
        .catch(() => {
          /* nahi aaya to "-" dikhega */
        });
    }, 700);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [eatenKey]);

  // Sirf tick kiye hue meals + add kiye hue snacks
  const eaten = [...meals.filter((_, i) => logged[i]), ...snacks];
  const consumed = eaten.reduce((sum, m) => sum + m.kcal, 0);

  const remaining = calories - consumed;
  const over = remaining < 0;
  const percent = calories > 0 ? Math.min(100, (consumed / calories) * 100) : 0;
  const offset = CIRCUMFERENCE * (1 - percent / 100);

  return (
    <article className="bg-white border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
      <div className="flex items-center gap-[10px] mb-[16px]">
        <div>
          <span className="text-[#8E978F] text-[11px] tracking-[.08em] uppercase">
            Metabolic pacing
          </span>
          <h3
            className={`${bricolage.className} mt-[4px] text-[18px] tracking-[-.03em] leading-[1.1] text-balance`}
          >
            Energy balance
          </h3>
        </div>
        <div className="ml-auto flex gap-[8px] items-center ">
          <span className="bg-[#E9F6EC] text-[#2E6B3E] inline-flex items-center gap-[6px] py-[4px] px-[10px] rounded-[999px] whitespace-nowrap ">
            <span className="bg-[#2e6b3e] w-[6px] h-[6px] rounded-[50%]"></span>
            Adaptive target
          </span>
        </div>
      </div>

      <div className="grid place-items-center pt-[6px] pb-[18px]">
        <div
          className="relative w-[172px] h-[172px]"
          role="img"
          aria-label={
            over
              ? `${fmt(-remaining)} kcal over your ${fmt(calories)} kcal target`
              : `${fmt(remaining)} kcal remaining of ${fmt(calories)}`
          }
        >
          <svg
            className="w-[172px] h-[172px] rotate-[-90deg]"
            width="172"
            height="172"
            viewBox="0 0 172 172"
            aria-hidden="true"
          >
            {/* Background Ring */}
            <circle
              cx="86"
              cy="86"
              r="79"
              fill="none"
              stroke="#E9F6EC"
              strokeWidth="14"
            />

            {/* Progress Ring: khaye hue kcal ka hissa */}
            <circle
              cx="86"
              cy="86"
              r="79"
              fill="none"
              stroke={over ? "#E8895F" : "#92cb68"}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={mounted ? offset : CIRCUMFERENCE}
              className="transition-[stroke-dashoffset,stroke] duration-[1400ms] ease-[var(--ease)] motion-reduce:transition-none"
            />
          </svg>

          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <span className="text-[10px] tracking-[.08em] uppercase text-[#8E978F]">
                {over ? "Over by" : "Remaining"}
              </span>
              <div
                className={`${bricolage.className} text-[38px] tracking-[-.05em] leading-[1.01] tabular-nums`}
              >
                {fmt(Math.abs(remaining))}
              </div>
              <small className="text-[#8E978F]">Kcal of {fmt(calories)}</small>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[10px]">
        {nutrients.map((item) => {
          const Icon = item.icon;
          const m = micro[item.code];
          // Value = roz ka target, bar = aaj ab tak kitna poora hua
          const value = m
            ? `${m.target.toLocaleString("en-US", { maximumFractionDigits: 1 })} ${m.unit}`
            : "–";
          const pct = m
            ? Math.min(100, Math.max(0, Math.round(m.percentage)))
            : 0;
          return (
            <div
              key={item.title}
              style={{ backgroundColor: item.bg }}
              className="flex items-center gap-2.5 p-3 rounded-[14px] text-xs text-[#5b665f]"
            >
              <span className="w-8 h-8 rounded-[10px] bg-[#ffffffbf] grid place-items-center flex-none">
                <Icon size={16} color={item.iconColor} />
              </span>
              <div className="flex-1 min-w-0">
                {item.title}
                <b
                  className={`${bricolage.className} block text-[#1d2a22] text-[15px] tracking-[.02em]`}
                >
                  {value}
                </b>
                <div className="bg-[#ffffffcc] h-[4px] mt-[5px] rounded-[6px] overflow-hidden">
                  <i
                    key={`${item.code}-${pct}`}
                    style={
                      {
                        "--nutrient-width": `${pct}%`,
                        backgroundColor: item.barColor,
                      } as React.CSSProperties
                    }
                    className="block h-full rounded-[6px] animate-[nutrientProgress_1.2s_var(--ease)_both]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}
