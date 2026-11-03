"use client";

import { Bricolage_Grotesque } from "next/font/google";
import { ChevronRight, Edit3 } from "lucide-react";
import Link from "next/link";
import { initials, useProfile } from "./ProfileContext";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function Profile() {
  const { profile, openEdit } = useProfile();

  return (
    <article className="bg-white border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
      <div className="flex items-center gap-[18px] flex-wrap">
        <span
          className={`${bricolage.className} w-[76px] h-[76px] rounded-full bg-[linear-gradient(135deg,#F7C9B4,#CFE9C8)] grid place-items-center font-semibold text-[26px] text-[#1D2A22] flex-none`}
        >
          {initials(profile.name)}
        </span>
        <div className="flex-1 min-w-[180px]">
          <h2
            className={`${bricolage.className} text-[24px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            {profile.name}
          </h2>
          <p className="text-[13.5px] text-[#8E978F]">{profile.email}</p>
          <div className="mt-[8px] flex flex-wrap gap-[6px]">
            <span className="bg-[#E9F6EC] text-[#2E6B3E] inline-flex items-center gap-[6px] text-[12px] py-[4px] px-[10px] rounded-full whitespace-nowrap">
              Premium member
            </span>
            <span className="bg-[#F2F5F2] text-[#5B665F] inline-flex items-center gap-[6px] text-[12px] py-[4px] px-[10px] rounded-full whitespace-nowrap">
              {profile.calories.toLocaleString("en-US")} kcal/day target
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={openEdit}
          aria-haspopup="dialog"
          className="inline-flex items-center justify-center gap-2 rounded-full font-medium cursor-pointer transition-[translate,box-shadow,background-color] duration-200 ease-out whitespace-nowrap bg-white border border-[#1d2a2224] py-[7px] px-[13px] text-[13px] hover:bg-[#F2F5F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
        >
          <Edit3 size={14} />
          Edit profile
        </button>
      </div>

      <div className="grid grid-cols-5 gap-[10px] mt-5 pt-[18px] border-t border-[#1d2a2214] max-[600px]:grid-cols-2">
        <div className="text-center">
          <b className={`${bricolage.className} text-[22px] tracking-[-.03em] block tabular-nums`}>
            {profile.age}
          </b>
          <small className="text-[#8E978F] text-[12px]">Age</small>
        </div>
        <div className="text-center">
          <b className={`${bricolage.className} text-[22px] tracking-[-.03em] block tabular-nums`}>
            {profile.sex}
          </b>
          <small className="text-[#8E978F] text-[12px]">Sex</small>
        </div>
        <div className="text-center">
          <b className={`${bricolage.className} text-[22px] tracking-[-.03em] block tabular-nums`}>
            {profile.height} cm
          </b>
          <small className="text-[#8E978F] text-[12px]">Height</small>
        </div>
        <div className="text-center">
          <b className={`${bricolage.className} text-[22px] tracking-[-.03em] block tabular-nums`}>
            {profile.weight} kg
          </b>
          <small className="text-[#8E978F] text-[12px]">Weight</small>
        </div>
        <Link
          href="/calibration/about"
          className="bg-[#E9F6EC] text-[#2E6B3E] rounded-[14px] p-[8px] text-left text-[12px] cursor-pointer"
        >
          <span className="flex justify-between">
            Your goal
            <ChevronRight size={13} />
          </span>
          <b className={`${bricolage.className} text-[14px] tracking-[-.03em] block`}>
            {profile.goal}
          </b>
        </Link>
      </div>
    </article>
  );
}