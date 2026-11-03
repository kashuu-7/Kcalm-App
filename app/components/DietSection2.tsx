import React from 'react'
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function DietSection2() {
  return (
    <section className="pt-0 py-[clamp(72px,10vw,128px)]">
      <div className="flex flex-wrap items-end justify-between gap-[24px] mb-[clamp(36px,5vw,56px)] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-[80ms]">
        <div>
          <span className="block mb-[14px] text-[12px] tracking-[.08em] uppercase text-[#8E978F]">
            Why Kcalm
          </span>
          <h2 className={`${bricolage.className} text-[clamp(34px,5vw,60px)] font-semibold tracking-[-0.035em] leading-[1.02] m-0 text-balance`}>
            More than counting. 
            <span className={`${serif.className} tracking-[-.01em] `}>
              {" "} Actually cooking.
            </span>
          </h2>
        </div>
        <p className="text-[clamp(16px,1.4vw,18px)] max-w-[620px] text-[#5B665F] mt-0">
          Most apps stop at a number or a recipe. Kcalm connects the two.
        </p>
      </div>
      <div className="overflow-x-auto rounded-[28px] border border-[#1d2a2214] bg-[#ffffff] shadow-[var(--shadow)] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-[160ms]">
        <table className="w-full border-collapse min-w-[620px] text-[15px]">
          <thead>
            <tr>
              <th className="py-[18px] px-[22px] text-left border-b border-[#1d2a2214] font-normal text-[11px] tracking-[0.08em] uppercase text-[#8e978f]">Feature</th>
              <th className={`${bricolage.className} text-[#2e6b3e] text-[18px] tracking-[-0.03em] normal-case bg-[#e9f6ec] text-center py-[18px] px-[22px] font-normal border-b border-[#1d2a2214]`}>Kcalm</th>
              <th className="py-[18px] px-[22px] text-left border-b border-[#1d2a2214] font-normal text-[11px] tracking-[0.08em] uppercase text-[#8e978f]">Calorie counters</th>
              <th className="py-[18px] px-[22px] text-left border-b border-[#1d2a2214] font-normal text-[11px] tracking-[0.08em] uppercase text-[#8e978f]">Recipe apps</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-[18px] px-[22px] text-left border-b border-[#1d2a2214]">Personalized daily meal plan</td>
              <td className="text-center w-[18%] py-[18px] px-[22px] bg-[#e9f6ec] border-b border-[#1d2a2214]"><span className="inline-grid place-items-center w-[26px] h-[26px] rounded-full bg-[#5fae6e] text-white">✓</span></td>
              <td className="py-[18px] px-[22px] w-[18%] text-center border-b border-[#1d2a2214]"><span className="text-[11px] text-[#8e978f]">Partial</span></td>
              <td className="py-[18px] px-[22px] w-[18%] text-center border-b border-[#1d2a2214]"><span className="text-[18px] text-[#8e978f]">—</span></td>
            </tr>
            <tr>
              <td className="py-[18px] px-[22px] text-left border-b border-[#1d2a2214]">Calorie, macro and micro targets</td>
              <td className="text-center w-[18%] py-[18px] px-[22px] bg-[#e9f6ec] border-b border-[#1d2a2214]"><span className="inline-grid place-items-center w-[26px] h-[26px] rounded-full bg-[#5fae6e] text-white">✓</span></td>
              <td className="py-[18px] px-[22px] w-[18%] text-center border-b border-[#1d2a2214]"><span className="inline-grid place-items-center w-[26px] h-[26px] rounded-full bg-[#5fae6e] text-white">✓</span></td>
              <td className="py-[18px] px-[22px] w-[18%] text-center border-b border-[#1d2a2214]"><span className="text-[18px] text-[#8e978f]">—</span></td>
            </tr>
            <tr>
              <td className="py-[18px] px-[22px] text-left border-b border-[#1d2a2214]">Meal swaps that rebalance your day</td>
              <td className="text-center w-[18%] py-[18px] px-[22px] bg-[#e9f6ec] border-b border-[#1d2a2214]"><span className="inline-grid place-items-center w-[26px] h-[26px] rounded-full bg-[#5fae6e] text-white">✓</span></td>
              <td className="py-[18px] px-[22px] w-[18%] text-center border-b border-[#1d2a2214]"><span className="text-[18px] text-[#8e978f]">—</span></td>
              <td className="py-[18px] px-[22px] w-[18%] text-center border-b border-[#1d2a2214]"><span className="text-[18px] text-[#8e978f]">—</span></td>
            </tr>
            <tr>
              <td className="py-[18px] px-[22px] text-left border-b border-[#1d2a2214]">Animated step-by-step recipes</td>
              <td className="text-center w-[18%] py-[18px] px-[22px] bg-[#e9f6ec] border-b border-[#1d2a2214]"><span className="inline-grid place-items-center w-[26px] h-[26px] rounded-full bg-[#5fae6e] text-white">✓</span></td>
              <td className="py-[18px] px-[22px] w-[18%] text-center border-b border-[#1d2a2214]"><span className="text-[18px] text-[#8e978f]">—</span></td>
              <td className="py-[18px] px-[22px] w-[18%] text-center border-b border-[#1d2a2214]"><span className="text-[11px] text-[#8e978f]">Video only recipes</span></td>
            </tr>
            <tr>
              <td className="py-[18px] px-[22px] text-left border-b border-[#1d2a2214]">Auto-generated grocery list</td>
              <td className="text-center w-[18%] py-[18px] px-[22px] bg-[#e9f6ec] border-b border-[#1d2a2214]"><span className="inline-grid place-items-center w-[26px] h-[26px] rounded-full bg-[#5fae6e] text-white">✓</span></td>
              <td className="py-[18px] px-[22px] w-[18%] text-center border-b border-[#1d2a2214]"><span className="text-[18px] text-[#8e978f]">—</span></td>
              <td className="py-[18px] px-[22px] w-[18%] text-center border-b border-[#1d2a2214]"><span className="text-[11px] text-[#8e978f]">Partial</span></td>
            </tr>
            <tr>
              <td className="py-[18px] px-[22px] text-left border-b border-[#1d2a2214]">Auto-generated grocery list</td>
              <td className="text-center w-[18%] py-[18px] px-[22px] bg-[#e9f6ec] border-b border-[#1d2a2214]"><span className="inline-grid place-items-center w-[26px] h-[26px] rounded-full bg-[#5fae6e] text-white">✓</span></td>
              <td className="py-[18px] px-[22px] w-[18%] text-center border-b border-[#1d2a2214]"><span className="text-[18px] text-[#8e978f]">—</span></td>
              <td className="py-[18px] px-[22px] w-[18%] text-center border-b border-[#1d2a2214]"><span className="text-[11px] text-[#8e978f]">Varies</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
