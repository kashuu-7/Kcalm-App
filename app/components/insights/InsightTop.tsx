"use client";

import { BarChart3, Flame, Target, type LucideIcon } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { useProfile } from "../profile/ProfileContext";
import Avatar from "../profile/Avatar";
import { useEffect, useState } from "react";
import { fetchNutritionSummary } from "../../lib/api/tracking";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const R = 31;
const C = 2 * Math.PI * R;

type StatCardProps = {
  title: string;
  value: number;
  caption: string;
  color: string;
  Icon: LucideIcon;
};

function StatCard({ title, value, caption, color, Icon }: StatCardProps) {
  
  return (
    <article className="flex justify-between items-center gap-[10px] bg-white border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
      <div>
        <div className="flex items-center gap-[8px] font-[500] text-[14px]">
          <span className="w-[28px] h-[28px] rounded-[9px] text-[#4E9E5C] bg-[#E9F6EC] grid place-items-center">
            <Icon size={14} />
          </span>
          {title}
        </div>
        <div className={`${bricolage.className} text-[30px] tracking-[-.03em] mt-[10px] tabular-nums`}>
          {value}%
        </div>
        <small className="text-[#8E978F]">{caption}</small>
      </div>
      <svg className="w-[70px] h-[70px] -rotate-90" viewBox="0 0 70 70" fill="none">
        <circle cx="35" cy="35" r={R} stroke="#F2F5F2" strokeWidth="8" />
        <circle
          cx="35"
          cy="35"
          r={R}
          stroke={color}
          strokeWidth="8"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - value / 100)}
          strokeLinecap="round"
        />
      </svg>
    </article>
  );
}

export default function InsightTop() {
  const { profile } = useProfile(); 
      const [stats, setStats] = useState({ weekly: 0, adherence: 0, macro: 0 });

  // Pichle 7 din ka hisaab backend se (score nikal na saken to 0 dikhta hai)
  useEffect(() => {
    let cancelled = false;
    fetchNutritionSummary(7)
      .then((s) => {
        if (cancelled) return;
        setStats({
          weekly: Math.round(s.data_completeness.percentage),
          adherence: Math.round(s.calorie_adherence.score ?? 0),
          macro: Math.round(s.macro_balance.score ?? 0),
        });
      })
      .catch(() => {
        /* nahi aaya to 0% rahega */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.3fr)] gap-[18px] max-[1050px]:grid-cols-3 max-[600px]:grid-cols-1">
      <StatCard title="Weekly progress" value={stats.weekly} caption="of days logged" color="#4E9E5C" Icon={BarChart3} />
<StatCard title="Calorie adherence" value={stats.adherence} caption="target alignment" color="#E8895F" Icon={Flame} />
<StatCard title="Macro balance" value={stats.macro} caption="macro alignment" color="#3F8FC4" Icon={Target} />
      
{/* Article 4 */}
      <article className="flex flex-wrap max-[1050px]:col-span-full items-center gap-[16px] bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
                <Avatar
          name={profile.name}
          className="w-[60px] h-[60px]"
          textClass={`${bricolage.className} text-[20px]`}
        />
        <div className="flex-1 min-w-[140px] ">
            <h3 className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}>
                {profile.name}
            </h3>
            <div className="mt-[6px]">
                <span className="  bg-[#E9F6EC] text-[#2E6B3E] inline-flex items-center gap-1.5 text-xs py-1 px-2.5 rounded-full whitespace-nowrap ">
                    Premium member
                </span>
            </div>
        </div>
        <div className="flex gap-[16px] text-[12px] text-[#8E978F] text-center ">
            <div>
                <b className={`${bricolage.className} block text-[18px] text-[#1D2A22] tabular-nums `}>{profile.age}</b>
                Age
            </div>
            <div>
                <b className={`${bricolage.className} block text-[18px] text-[#1D2A22] tabular-nums `}>{profile.height} cm</b>
                Height
            </div>
            <div>
                <b className={`${bricolage.className} block text-[18px] text-[#1D2A22] tabular-nums `}>{profile.weight} kg</b>
                Weight
            </div>
        </div>
      </article>
    </div>
  );
}

