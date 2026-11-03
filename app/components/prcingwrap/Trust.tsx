import React from 'react'
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import { ShieldCheck, Database, Lock } from "lucide-react";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function Trust() {
  return (
    <section className="pt-0 py-[clamp(72px,10vw,128px)]">
      <div className="flex flex-wrap items-end justify-between gap-[24px] max-sm:gap-[16px] mb-[clamp(36px,5vw,56px)] transition-[opacity,transform,translate,box-shadow] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-[80ms]">
        <div>
          <span className="block mb-[14px] text-[12px] tracking-[.08em] uppercase text-[#8E978F]">
            Built on trust
          </span>
          <h2
            className={`${bricolage.className} text-[clamp(34px,5vw,60px)] font-semibold tracking-[-0.035em] leading-[1.02] m-0 text-balance`}
          >
            Grounded in science, 
            <span className={`${serif.className} tracking-[-.01em] `}>
              {" "}
              kind to your data.
            </span>
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-3 max-[940px]:grid-cols-1 gap-[18px] max-sm:gap-[14px]">
        <article className="rounded-[28px] max-sm:rounded-[24px] p-[28px] max-sm:p-[22px] border border-[#1d2a2214] bg-white shadow-[var(--shadow)] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-0">
            <div className="w-[46px] h-[46px] rounded-[14px] grid bg-[#E9F6EC] font-semibold mb-[40px] max-[940px]:mb-[28px] text-[#2E6B3E] place-items-center">
                <ShieldCheck className="w-[22px] h-[22px]" />
            </div>
            <h3 className={`${bricolage.className} text-[22px] max-sm:text-[20px] font-semibold tracking-[-.02em] leading-[1.02] m-0 text-balance`}>
                Dietitian-reviewed plans
            </h3>
            <p className="text-[#5B665F] text-[15px] max-sm:text-[14px] mt-[10px] ">
                Meal templates and targets are reviewed by nutrition professionals before they reach your plate.
            </p>
        </article>
        <article className="rounded-[28px] max-sm:rounded-[24px] p-[28px] max-sm:p-[22px] border border-[#1d2a2214] bg-white shadow-[var(--shadow)] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-0">
            <div className="w-[46px] h-[46px] rounded-[14px] grid bg-[#E7F3FC] font-semibold mb-[40px] max-[940px]:mb-[28px] text-[#3A7AA3] place-items-center">
                <Database className="w-[22px] h-[22px]" />
            </div>
            <h3 className={`${bricolage.className} text-[22px] max-sm:text-[20px] font-semibold tracking-[-.02em] leading-[1.02] m-0 text-balance`}>
                Verified nutrition data
            </h3>
            <p className="text-[#5B665F] text-[15px] max-sm:text-[14px] mt-[10px] ">
                Every ingredient maps to trusted food databases, so your numbers stay accurate down to the milligram.
            </p>
        </article>
        <article className="rounded-[28px] max-sm:rounded-[24px] p-[28px] max-sm:p-[22px] border border-[#1d2a2214] bg-white shadow-[var(--shadow)] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-0">
            <div className="w-[46px] h-[46px] rounded-[14px] grid bg-[#F0EDFD] font-semibold mb-[40px] max-[940px]:mb-[28px] text-[#6457B0] place-items-center">
                <Lock className="w-[22px] h-[22px]" />
            </div>
            <h3 className={`${bricolage.className} text-[22px] max-sm:text-[20px] font-semibold tracking-[-.02em] leading-[1.02] m-0 text-balance`}>
                Your data stays yours
            </h3>
            <p className="text-[#5B665F] text-[15px] max-sm:text-[14px] mt-[10px] ">
                Health details are encrypted and never sold. Export or delete them from settings anytime.
            </p>
        </article>
      </div>
    </section>
  )
}