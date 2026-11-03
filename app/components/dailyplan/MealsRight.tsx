"use client";

import { useEffect, useState } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import { useTargets } from "../profile/useTargets";
import { useMeals } from "../dashboard/MealsContext";
import {
  ArrowLeftRight,
  ChevronRight,
  Plus,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

// Ring ki geometry (r = 71.5)
const RADIUS = 71.5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // 449.25

export default function MealsRight() {
  const { calories: DAILY_TARGET } = useTargets();
  const { meals, logged, snacks, openSwapList, openSnack, regeneratePlan } = useMeals();
  const [mounted, setMounted] = useState(false);
  const [regenNote, setRegenNote] = useState<string | null>(null);

  // Pehli baar ring khali se apni value tak bhare
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Regenerate ka chhota message 2 second baad hat jaye
  useEffect(() => {
    if (!regenNote) return;
    const t = setTimeout(() => setRegenNote(null), 2200);
    return () => clearTimeout(t);
  }, [regenNote]);

  const handleRegenerate = () => {
    const n = regeneratePlan();
    setRegenNote(
      n > 0
        ? `${n} planned ${n === 1 ? "meal" : "meals"} refreshed`
        : "All meals are already eaten, nothing to refresh",
    );
  };

  // Tick hue meals + jo snacks add kiye (snack foran consumed hota hai)
  const consumed =
    meals.reduce((sum, meal, i) => (logged[i] ? sum + meal.kcal : sum), 0) +
    snacks.reduce((sum, s) => sum + s.kcal, 0);
  const remaining = Math.max(0, DAILY_TARGET - consumed);
  const over = Math.max(0, consumed - DAILY_TARGET);

  // 0 se 1 ke beech (target se zyada ho to bhi ring 100% pe ruk jati hai)
  const progress = Math.min(1, consumed / DAILY_TARGET);
  const dashOffset = mounted ? CIRCUMFERENCE * (1 - progress) : CIRCUMFERENCE;

  const actionClass =
    "flex items-center gap-[12px] p-[12px] rounded-[14px] border border-[#1d2a2214] w-full text-left font-[500] text-[14px] cursor-pointer transition-all duration-250 hover:bg-[#F2F5F2] hover:translate-x-[2px]";

  return (
    <div className="grid gap-[18px] ">
      <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
        <div className="flex items-center gap-[10px] mb-[16px]">
          <h3
            className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            Daily goal progress
          </h3>
        </div>
        <div className="grid place-items-center pb-[14px]">
          <div className="relative w-[156px] h-[156px] ">
            <svg
              className="w-[156px] h-[156px] rotate-[-90deg]"
              width="156"
              height="156"
              viewBox="0 0 156 156"
            >
              {/* Background ring */}
              <circle
                cx="78"
                cy="78"
                r={RADIUS}
                fill="none"
                stroke="#E9F6EC"
                strokeWidth="13"
              />

              {/* Progress ring */}
              <circle
                cx="78"
                cy="78"
                r={RADIUS}
                fill="none"
                stroke="#4E9E5C"
                strokeWidth="13"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{
                  opacity: progress === 0 ? 0 : 1, // 0 par round cap ka dot na dikhe
                  transition:
                    "stroke-dashoffset 1000ms cubic-bezier(.2,.8,.2,1), opacity 300ms",
                }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center ">
              <div>
                <span className="text-[10px] tracking-[.08em] uppercase text-[#8E978F] ">
                  Remaining
                </span>
                <div
                  className={`${bricolage.className} text-[32px] tracking-[-.05em] tabular-nums `}
                >
                  {remaining.toLocaleString("en-US")}
                </div>
                <small className="text-[#8E978F] ">
                  kcal of {DAILY_TARGET.toLocaleString("en-US")}
                </small>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-[8px] text-[13.5px] ">
          <div className="flex justify-between">
            <span>
              <span className="bg-[#4E9E5C] inline-block w-[8px] h-[8px]  rounded-[50%] mr-[8px] "></span>
              Consumed
            </span>
            <b className="tabular-nums">
              {consumed.toLocaleString("en-US")} kcal
            </b>
          </div>
          <div className="flex justify-between">
            <span>
              <span className="bg-[#D5EEDA] inline-block w-[8px] h-[8px]  rounded-[50%] mr-[8px] "></span>
              Remaining
            </span>
            <b className="tabular-nums">
              {remaining.toLocaleString("en-US")} kcal
            </b>
          </div>
          {over > 0 && (
            <div className="flex justify-between text-[#A4502B]">
              <span>
                <span className="bg-[#E8895F] inline-block w-[8px] h-[8px]  rounded-[50%] mr-[8px] "></span>
                Over target
              </span>
              <b className="tabular-nums">
                +{over.toLocaleString("en-US")} kcal
              </b>
            </div>
          )}
        </div>
      </article>

      <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
        <div className="flex items-center gap-[10px] mb-[16px]">
          <h3
            className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            Quick actions
          </h3>
        </div>
        <div className="grid gap-[8px] ">
          <button type="button" onClick={openSwapList} className={actionClass}>
            <span className="w-[34px] h-[34px] rounded-[11px] bg-[#e9f6ec] text-[#2e6b3e] grid place-items-center">
              <ArrowLeftRight size={16} />
            </span>
            Swap a meal
            <span className="text-[#8e978f] ml-auto ">
              <ChevronRight size={15} />
            </span>
          </button>
          <button type="button" onClick={openSnack} className={actionClass}>
            <span className="w-[34px] h-[34px] rounded-[11px] bg-[#ffefe7] text-[#A4502B] grid place-items-center">
              <Plus size={16} />
            </span>
            Add a snack
            <span className="text-[#8e978f] ml-auto ">
              <ChevronRight size={15} />
            </span>
          </button>
          <button
            type="button"
            onClick={handleRegenerate}
            className={actionClass}
          >
            <span className="w-[34px] h-[34px] rounded-[11px] bg-[#F0EDFD] text-[#6457B0] grid place-items-center">
              <RefreshCw size={16} />
            </span>
            Regenerate plan
            <span className="text-[#8e978f] ml-auto ">
              <ChevronRight size={15} />
            </span>
          </button>
          <Link href="/smart-grocery" className={actionClass}>
            <span className="w-[34px] h-[34px] rounded-[11px] bg-[#FFF4D8] text-[#A77B00] grid place-items-center">
              <ShoppingCart size={16} />
            </span>
            Open grocery list
            <span className="text-[#8e978f] ml-auto ">
              <ChevronRight size={15} />
            </span>
          </Link>
        </div>
        {regenNote && (
          <p
            role="status"
            className="text-[12.5px] text-[#2E6B3E] mt-[12px] animate-[fade_250ms]"
          >
            {regenNote}
          </p>
        )}
      </article>
    </div>
  );
}
