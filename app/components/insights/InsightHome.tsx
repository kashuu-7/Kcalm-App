import React from "react";
import InsightTop from "./InsightTop";
import InsightLeft from "./InsightLeft";
import InsightRight from "./InsightRight";
import Nutrition from "./Nutrition";
import HabitTracking from "./HabitTracking";
import Achievements from "./Achievements";
import { ChevronRight, Target } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function InsightHome() {
  return (
    <main>
      <div className="grid gap-[18px] animate-[viewin_.5s_var(--ease)]">
        <InsightTop />
        <div className="grid grid-cols-2 gap-[18px] max-[940px]:grid-cols-1">
          <InsightLeft />
          <InsightRight />
        </div>
        <div className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)_minmax(0,1fr)] max-[1050px]:grid-cols-2 max-[940px]:grid-cols-1 gap-[18px] ">
          <Nutrition />
          <HabitTracking />
          <Achievements />
        </div>
        {/* Banner */}
        <div className="flex items-center gap-4 rounded-3xl py-[18px] px-[22px] bg-[linear-gradient(120deg,#e9f6ec,#f0edfd)] flex-wrap">
          <span className="text-[#2E6B3E] w-[44px] h-[44px] rounded-[14px] bg-[#fff] grid place-items-center ">
            <Target size={20} />
          </span>
          <div>
            <h3
              className={`${bricolage.className} text-[16px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
            >
              You're making great progress
            </h3>
            <p className="text-[13.5px] text-[#8E978F] ">
              Keep up the consistent effort. Small steps lead to big results.
            </p>
          </div>
          <Link
            href="/daily-plan"
            className="ml-auto inline-flex items-center justify-center gap-2 rounded-full py-[11px] px-[20px] font-medium text-sm whitespace-nowrap bg-[#2e6b3e] text-white shadow-[0_10px_24px_-12px_rgba(46,107,62,0.6)] transition-[translate,box-shadow,background] duration-200 ease-[var(--ease)] hover:-translate-y-[1px] hover:shadow-[0_14px_28px_-12px_rgba(46,107,62,0.6)] "
          >
            View my plan
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}
