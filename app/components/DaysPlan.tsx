import React from 'react'
import { Bricolage_Grotesque } from "next/font/google";
import HowItWorks from './HowItWorks';
import TheApp from './TheApp';
import Different from './Different';

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function DaysPlan() {
  return (
    <div className="max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)]">
      <div className="grid grid-cols-4 max-[940px]:grid-cols-2 gap-0 mt-[clamp(40px,6vw,64px)] border border-[#1d2a2214] rounded-[28px] bg-[#FFFFFF] shadow-[0_1px_2px_rgba(29,42,34,0.04),0_18px_40px_-22px_rgba(29,42,34,0.16)] overflow-hidden transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-0">
        <div className="py-[26px] px-[28px] max-sm:py-[20px] max-sm:px-[18px]">
            <b className={`${bricolage.className} text-[clamp(34px,4vw,48px)] tracking-[-0.05em] leading-none block tabular-nums text-[#2E6B3E]`}>
                <span>
                    30
                </span>
                +
            </b>
            <p className="mt-[8px] text-[14px] max-sm:text-[13px] text-[#5B665F]">
                nutrients tracked, from protein to vitamin D
            </p>
        </div>
        <div className="py-[26px] px-[28px] max-sm:py-[20px] max-sm:px-[18px] border-l border-[#1d2a2214]">
            <b className={`${bricolage.className} text-[clamp(34px,4vw,48px)] tracking-[-0.05em] leading-none block tabular-nums text-[#6457B0]`}>
                <span>
                    12
                </span>
            </b>
            <p className="mt-[8px] text-[14px] max-sm:text-[13px] text-[#5B665F]">
                eating styles, from keto to vegetarian
            </p>
        </div>
        <div className="py-[26px] px-[28px] max-sm:py-[20px] max-sm:px-[18px] border-l border-[#1d2a2214] max-[940px]:border-l-0 max-[940px]:border-t">
            <b className={`${bricolage.className} text-[clamp(34px,4vw,48px)] tracking-[-0.05em] leading-none block tabular-nums text-[#C0683F]`}>
                <span>
                    15
                </span>
                <small className="text-[21px] max-sm:text-[17px] tracking-[-0.01em] ml-[4px] text-[#8E978F]">min</small>
            </b>
            <p className="mt-[8px] text-[14px] max-sm:text-[13px] text-[#5B665F]">
                average recipe, start to plate
            </p>
        </div>
        <div className="py-[26px] px-[28px] max-sm:py-[20px] max-sm:px-[18px] border-l border-[#1d2a2214] max-[940px]:border-t">
            <b className={`${bricolage.className} text-[clamp(34px,4vw,48px)] tracking-[-0.05em] leading-none block tabular-nums text-[#3A7AA3]`}>
                <span>
                    7
                </span>
                <small className="text-[21px] max-sm:text-[17px] tracking-[-0.01em] ml-[4px] text-[#8E978F]">days</small>
            </b>
            <p className="mt-[8px] text-[14px] max-sm:text-[13px] text-[#5B665F]">
                of meals planned for you every week
            </p>
        </div>
      </div>

      <HowItWorks />
      <TheApp />
      <Different />
    </div>
  )
}