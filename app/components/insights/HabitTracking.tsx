"use client";

import React, { useEffect, useState } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import {
  Apple,
  Droplet,
  Dumbbell,
  Footprints,
  Moon,
  type LucideIcon,
} from "lucide-react";
import {
  fetchHabitValues,
  fetchHabitWeek,
  isoLocal,
  weekDays,
  type HabitKey,
} from "../../lib/api/tracking";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const ROWS: { key: HabitKey; label: string; icon: LucideIcon }[] = [
  { key: "water", label: "Water", icon: Droplet },
  { key: "steps", label: "Steps", icon: Footprints },
  { key: "sleep", label: "Sleep", icon: Moon },
  { key: "veg", label: "Fruits & Veg", icon: Apple },
  { key: "workout", label: "Workout", icon: Dumbbell },
];

// Dashboard ke goals ke barabar (workout ka koi number nahi hota)
const GOALS: Partial<Record<HabitKey, { goal: number; unit: string }>> = {
  water: { goal: 8, unit: "glasses" },
  steps: { goal: 10000, unit: "steps" },
  sleep: { goal: 8, unit: "h" },
  veg: { goal: 5, unit: "servings" },
};

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CELL =
  "aspect-square rounded-lg max-h-[34px] transition-transform duration-200 hover:scale-110";
const DONE = `bg-[#4E9E5C] ${CELL}`;
const PARTIAL = `bg-[#9FD3A9] ${CELL}`;
const MISSED = `bg-[#F2F5F2] ${CELL}`;
// Aane wala din, ya wo din jis din habit thi hi nahi
const NO_DATA = `bg-[repeating-linear-gradient(45deg,#f2f5f2_0_3px,#fff_3px_6px)] ${CELL}`;

const CLASS_BY_STATUS = {
  done: DONE,
  partial: PARTIAL,
  missed: MISSED,
  none: NO_DATA,
} as const;

type Status = keyof typeof CLASS_BY_STATUS;
type WeekData = Record<HabitKey, Record<string, boolean>>;
type Values = Partial<Record<HabitKey, Record<string, number>>>;

const fmt = (n: number) => Number(n.toFixed(1)).toLocaleString("en-US");

export default function HabitTracking() {
  const [week, setWeek] = useState<WeekData | null>(null);
  const [values, setValues] = useState<Values | null>(null);

  useEffect(() => {
    let cancelled = false;
    const days = weekDays(0);

    fetchHabitWeek(days)
      .then((data) => {
        if (!cancelled) setWeek(data);
      })
      .catch(() => {
        /* nahi aaya to sab khali (hatched) dikhega */
      });

    fetchHabitValues(days)
      .then((v) => {
        if (!cancelled) setValues(v);
      })
      .catch(() => {
        /* nahi aaya to sirf done / missed dikhega */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const days = weekDays(0);
  const todayIso = isoLocal(new Date());

  const cellInfo = (key: HabitKey, date: string): { status: Status; label: string } => {
    if (date > todayIso) return { status: "none", label: "Upcoming" };

    const row = week?.[key];
    if (!row || !(date in row)) return { status: "none", label: "No data" };

    const g = GOALS[key];
    const value = values?.[key]?.[date] ?? 0;
    const detail = g ? ` (${fmt(value)} of ${fmt(g.goal)} ${g.unit})` : "";

    // Habit mark hui ho, ya goal poora ho gaya ho
    if (row[date] || (g && value >= g.goal)) {
      return { status: "done", label: `Done${detail}` };
    }
    // Goal se kam lekin kuch kiya hua
    if (g && value > 0) return { status: "partial", label: `Partial${detail}` };
    return { status: "missed", label: `Missed${detail}` };
  };

  return (
    <article className="bg-white border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
      <div className="flex items-center gap-[10px] mb-[16px]">
        <h3
          className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
        >
          Habit tracking
        </h3>
        <div className="ml-auto flex gap-[8px] items-center ">
          <span className="flex gap-[14px] flex-wrap text-[12.5px] text-[#8E978F] ">
            <span className="inline-flex items-center gap-[6px] ">
              <i className="bg-[#F2F5F2] w-[10px] h-[10px] rounded-[3px] "></i>
              Missed
            </span>
            <span className="inline-flex items-center gap-[6px] ">
              <i className="bg-[#9FD3A9] w-[10px] h-[10px] rounded-[3px] "></i>
              Partial
            </span>
            <span className="inline-flex items-center gap-[6px] ">
              <i className="bg-[#4E9E5C] w-[10px] h-[10px] rounded-[3px] "></i>
              Done
            </span>
          </span>
        </div>
      </div>
      <div className="grid grid-cols-[90px_repeat(7,1fr)] gap-1.5 items-center text-[12.5px]">
        <span></span>
        {DAY_LABELS.map((d) => (
          <span key={d} className="text-[10px] text-[#8E978F] text-center">
            {d}
          </span>
        ))}
        {ROWS.map((row) => {
          const Icon = row.icon;
          return (
            <React.Fragment key={row.key}>
              <span className="flex gap-[6px] items-center ">
                <Icon size={14} />
                {row.label}
              </span>
              {days.map((date, i) => {
                const { status, label } = cellInfo(row.key, date);
                const text = `${row.label}, ${DAY_LABELS[i]}: ${label}`;
                return (
                  <span
                    key={date}
                    role="img"
                    aria-label={text}
                    title={text}
                    className={CLASS_BY_STATUS[status]}
                  ></span>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </article>
  );
}