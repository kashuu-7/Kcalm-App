"use client";

import { useEffect, useState } from "react";
import { BarChart3, Flame, Leaf, Scale, Star, Target, Trophy, type LucideIcon } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import {
  fetchAchievements,
  fetchInsights,
  type Achievement,
  type InsightItem,
} from "../../lib/api/tracking";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

// Wahi 4 gol badge, wahi rang aur icon jo design mein the; sirf unlock hone ki halat backend se aati hai
const BADGES: {
  code: string;
  top: string;
  bottom: string;
  icon: LucideIcon;
  tone: string;
}[] = [
  { code: "nutrition_days_7", top: "7-day", bottom: "Streak", icon: Leaf, tone: "bg-[#E9F6EC] text-[#2E6B3E]" },
  { code: "first_recipe_completed", top: "First", bottom: "Recipe", icon: Star, tone: "bg-[#FFF3CF] text-[#C2912B]" },
  { code: "habit_completions_7", top: "7-Habit", bottom: "Getter", icon: Target, tone: "bg-[#E7F3FC] text-[#2B6A93]" },
  { code: "steps_10000", top: "10k", bottom: "Steps", icon: BarChart3, tone: "bg-[#F0EDFD] text-[#6457B0]" },
];
const LOCKED_TONE = "bg-[#F2F5F2] text-[#8E978F]";

const ROW_LOOK: Record<string, { icon: LucideIcon; tone: string }> = {
  recorded_steps: { icon: BarChart3, tone: "bg-[#E9F6EC] text-[#2E6B3E]" },
  recorded_nutrition: { icon: Flame, tone: "bg-[#FFEFE7] text-[#C2582B]" },
  nutrition_data_missing: { icon: Flame, tone: "bg-[#FFEFE7] text-[#C2582B]" },
  recorded_weight_change: { icon: Scale, tone: "bg-[#E7F3FC] text-[#2B6A93]" },
  recorded_habit_completions: { icon: Target, tone: "bg-[#E7F3FC] text-[#2B6A93]" },
};
const DEFAULT_LOOK = { icon: BarChart3, tone: "bg-[#E9F6EC] text-[#2E6B3E]" };

const n = (v: number | null | undefined) => Math.round(v ?? 0).toLocaleString("en-US");

// Backend ke numbers ko seedhi zabaan mein likho (backend ka message fallback hai)
function describe(item: InsightItem): string {
  const v = item.values;
  switch (item.code) {
    case "recorded_nutrition":
      return `On ${n(v.logged_days)} logged days you averaged ${n(v.average_calories)} kcal and ${n(v.average_protein_g)} g protein`;
    case "nutrition_data_missing":
      return "No meals or snacks were logged in the last 30 days";
    case "recorded_steps":
      return `You averaged ${n(v.average_steps)} steps a day across ${n(v.logged_days)} logged days`;
    case "recorded_weight_change": {
      const c = v.change_kg ?? 0;
      const sign = c > 0 ? "+" : c < 0 ? "−" : "";
      return `Weight change of ${sign}${Math.abs(c).toFixed(1)} kg across ${n(v.entries)} weigh-ins`;
    }
    case "recorded_habit_completions":
      return `${n(v.completions)} habit completions recorded`;
    default:
      return item.message;
  }
}

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; achievements: Achievement[]; items: InsightItem[] };

export default function Achievements() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchAchievements(), fetchInsights(30)])
      .then(([achievements, insights]) => {
        if (!cancelled) setState({ status: "ready", achievements, items: insights.items });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const achievements = state.status === "ready" ? state.achievements : [];
  const rows: { key: string; text: string; icon: LucideIcon; tone: string }[] =
    state.status === "ready"
      ? state.items.slice(0, 3).map((it) => ({
          key: it.code,
          text: describe(it),
          ...(ROW_LOOK[it.code] ?? DEFAULT_LOOK),
        }))
      : [];

  return (
    <div className="grid gap-[18px] max-[1050px]:col-span-full max-[1050px]:grid-cols-2 max-[940px]:grid-cols-1">
      <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
        <div className="flex items-center gap-[10px] mb-[16px]">
          <span className="text-[#E2B232]">
            <Trophy size={18} />
          </span>
          <h3
            className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            Achievements
          </h3>
        </div>
        <div className="grid grid-cols-4 gap-[8px] text-center text-[12px] ">
          {BADGES.map((b) => {
            const a = achievements.find((x) => x.code === b.code);
            const Icon = b.icon;
            return (
              <div
                key={b.code}
                title={a ? `${n(Math.min(a.current, a.target))} / ${n(a.target)} ${a.unit}` : undefined}
              >
                <div
                  className={`${
                    a?.unlocked ? b.tone : LOCKED_TONE
                  } w-[50px] h-[50px] rounded-full mx-auto mb-[6px] grid place-items-center transition-transform duration-[300ms] ease-[var(--ease)] hover:-translate-y-[3px] hover:-rotate-[6deg]`}
                >
                  <Icon size={15} />
                </div>
                <b className="font-[500]">{b.top}</b>
                <small className="text-[#8E978F] block text-[11px] ">{b.bottom}</small>
              </div>
            );
          })}
        </div>
      </article>

      <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
        <div className="flex items-center gap-[10px] mb-[16px]">
          <h3
            className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            Recent insights
          </h3>
        </div>
        {state.status === "error" && (
          <p role="alert" className="text-[13px] text-[#C2415C]">
            Couldn&apos;t load your insights.
          </p>
        )}
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.key}
              className="flex gap-[12px] py-[10px] border-b border-[#1d2a2214] text-[13.5px] "
            >
              <span className={`${r.tone} w-[30px] h-[30px] rounded-[10px] grid place-items-center `}>
                <Icon size={14} />
              </span>
              <div>
                {r.text}
                <small className="text-[#8E978F] block text-[12px] ">Last 30 days</small>
              </div>
            </div>
          );
        })}
      </article>
    </div>
  );
}