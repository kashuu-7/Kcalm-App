"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Droplet,
  Footprints,
  Moon,
  Apple,
  type LucideIcon,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import {
  fetchDailyMetrics,
  fetchSteps,
  isoLocal,
  saveDailyMetrics,
  setHabitDone,
  type DailyMetrics,
  type HabitKey,
} from "../../lib/api/tracking";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

// Goals
const WATER_GOAL = 8;
const STEPS_GOAL = 10000;
const SLEEP_GOAL = 8;
const VEG_GOAL = 5;

const MAX_COUNT = 99; // +/- wale cards ki upar ki hadd

type MetricCardProps = {
  label: string;
  icon: LucideIcon;
  iconSize: number;
  iconClass: string; // icon box ka bg + text color
  barClass: string; // bar ka color
  value: number;
  goal: number;
  unit?: string;
  mounted: boolean;
  onChange?: (next: number) => void; // diya ho to +/- buttons dikhte hain
};

function MetricCard({
  label,
  icon: Icon,
  iconSize,
  iconClass,
  barClass,
  value,
  goal,
  unit,
  mounted,
  onChange,
}: MetricCardProps) {
  const percent = Math.min(100, (value / goal) * 100);

  return (
    <div className="flex gap-[12px]  items-center bg-[#FFFFFF] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
      <span
        className={`${iconClass} w-[42px] h-[42px] rounded-[14px] grid place-items-center flex-none `}
      >
        <Icon size={iconSize} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline text-[12.5px] text-[#8E978F] ">
          <span>{label}</span>
          {onChange && (
            <div className="flex gap-[4px]">
              <button
                type="button"
                aria-label={`Decrease ${label}`}
                disabled={value <= 0}
                onClick={() => onChange(Math.max(0, value - 1))}
                className="w-[26px] h-[26px] rounded-[8px] border border-[#1d2a2224] grid place-items-center text-[14px] leading-[1] cursor-pointer transition-colors duration-200 hover:bg-[#f2f5f2] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                −
              </button>
              <button
                type="button"
                aria-label={`Increase ${label}`}
                disabled={value >= MAX_COUNT}
                onClick={() => onChange(Math.min(MAX_COUNT, value + 1))}
                className="w-[26px] h-[26px] rounded-[8px] border border-[#1d2a2224] grid place-items-center text-[14px] leading-[1] cursor-pointer transition-colors duration-200 hover:bg-[#f2f5f2] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                +
              </button>
            </div>
          )}
        </div>
        <b
          className={`${bricolage.className} text-[17px] tracking-[-.02em] tabular-nums `}
        >
          {value.toLocaleString("en-US")}{" "}
        </b>
        <span className="text-[12.5px] text-[#8E978F] ">
          / {goal.toLocaleString("en-US")}
          {unit ? ` ${unit}` : ""}
        </span>
        <div className="mt-[7px] h-[5px] rounded-[6px] bg-[#F2F5F2] overflow-hidden ">
          <i
            className={`${barClass} block h-full rounded-[6px] transition-[width] duration-[1200ms] ease-[var(--ease)]  `}
            style={{ width: mounted ? `${percent}%` : "0%" }}
          ></i>
        </div>
      </div>
    </div>
  );
}

export default function DashboardBottom() {
  // Water, Fruits & Veg aur Sleep aaj ka record backend se (record na ho to sab 0)
  const [metrics, setMetrics] = useState<DailyMetrics>({ water: 0, veg: 0, sleep: 0 });
  const [steps, setSteps] = useState(0);
  const [mounted, setMounted] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pending = useRef<DailyMetrics | null>(null);

  // Jo badlav baaki hai wo ab save karo (jaldi jaldi + dabane par ek hi baar bhejne ke liye)
  const flush = useCallback(() => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    const m = pending.current;
    pending.current = null;
        if (m) {
      void saveDailyMetrics(isoLocal(new Date()), m).catch((e) => {
        console.error("daily-metrics SAVE failed:", e);
      });
    }
  }, []);

  // Page chhodne par bhi baaki badlav save ho jaye
  useEffect(() => flush, [flush]);

  useEffect(() => {
    let cancelled = false;
    fetchDailyMetrics(isoLocal(new Date()))
      .then((m) => {
        if (!cancelled && m) setMetrics(m);
      })
            .catch((e) => {
        console.error("daily-metrics LOAD failed:", e);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Pehli baar bars 0 se apni value tak uthen
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Aaj ke steps backend se; goal poora ho to "Steps" habit done mark hoti hai
  useEffect(() => {
    let cancelled = false;
    const today = isoLocal(new Date());
    fetchSteps(today, today)
      .then((m) => {
        if (cancelled) return;
        const s = m[today] ?? 0;
        setSteps(s);
        if (s >= STEPS_GOAL) void setHabitDone("steps", today, true).catch(() => {});
      })
      .catch(() => {
        /* nahi aaye to 0 */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Ginti badlo; 0.5 sec baad backend mein save. Goal paar karne (ya wapas girne) par habit bhi badlo
  const update = (key: "water" | "veg", next: number, goal: number, habit: HabitKey) => {
    const prev = metrics[key];
    const nextMetrics = { ...metrics, [key]: next };
    setMetrics(nextMetrics);
    pending.current = nextMetrics;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flush, 500);
    if (prev >= goal !== next >= goal) {
      void setHabitDone(habit, isoLocal(new Date()), next >= goal).catch(() => {});
    }
  };

  return (
    <div className="grid grid-cols-4 max-[940px]:grid-cols-2 max-sm:grid-cols-1 gap-[18px] max-sm:gap-[14px] ">
      <MetricCard
        label="Water"
        icon={Droplet}
        iconSize={19}
        iconClass="bg-[#e7f3fc] text-[#3F8FC4]"
        barClass="bg-[#3F8FC4]"
        value={metrics.water}
        goal={WATER_GOAL}
        unit="glasses"
        mounted={mounted}
        onChange={(n) => update("water", n, WATER_GOAL, "water")}
      />
      <MetricCard
        label="Steps"
        icon={Footprints}
        iconSize={19}
        iconClass="bg-[#FFEFE7] text-[#E8895F]"
        barClass="bg-[#E8895F]"
        value={steps}
        goal={STEPS_GOAL}
        mounted={mounted}
      />
      <MetricCard
        label="Sleep"
        icon={Moon}
        iconSize={16}
        iconClass="bg-[#F0EDFD] text-[#6457B0]"
        barClass="bg-[#6457B0]"
        value={metrics.sleep}
        goal={SLEEP_GOAL}
        unit="hours"
        mounted={mounted}
      />
      <MetricCard
        label="Fruits & Veggies"
        icon={Apple}
        iconSize={16}
        iconClass="bg-[#E9F6EC] text-[#4E9E5C]"
        barClass="bg-[#4E9E5C]"
        value={metrics.veg}
        goal={VEG_GOAL}
        unit="servings"
        mounted={mounted}
        onChange={(n) => update("veg", n, VEG_GOAL, "veg")}
      />
    </div>
  );
}