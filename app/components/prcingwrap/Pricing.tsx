"use client";

import { useState } from "react";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import { Check, X } from "lucide-react";
import Link from "next/link";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");

  const prices = {
    basic: 0,
    plus: 11.99,
    pro: 24.99,
  };

  const getPrice = (price: number) => {
    if (billing === "yearly") {
      return (price * 0.8).toFixed(2);
    }

    return price.toFixed(2);
  };

  return (
    <section id="pricing" className="pt-0 py-[clamp(72px,10vw,128px)]">
      <div className="flex flex-wrap items-end justify-between gap-[24px] max-sm:gap-[20px] mb-[clamp(36px,5vw,56px)] transition-[opacity,transform,translate,box-shadow] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-[80ms]">
        <div>
          <span className="block mb-[14px] text-[12px] tracking-[.08em] uppercase text-[#8E978F]">
            Pricing
          </span>
          <h2
            className={`${bricolage.className} text-[clamp(34px,5vw,60px)] font-semibold tracking-[-0.035em] leading-[1.02] m-0 text-balance`}
          >
            Simple, while we're
            <span className={`${serif.className} tracking-[-.01em] `}>
              {" "}
              in beta.
            </span>
          </h2>
        </div>
        <div className="inline-flex bg-[#ffffffd1] border border-[#1d2a2214] rounded-full p-1 relative">
          <span
            className={`absolute top-1 bottom-1 rounded-full bg-[#2E6B3E] transition-all duration-[450ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
              billing === "monthly"
                ? "left-1 w-[88px]"
                : "left-[92px] w-[104px]"
            }`}
          ></span>

          <button
          type="button"
  aria-pressed={billing === "monthly"}
  onClick={() => setBilling("monthly")}
            className={`border-0 bg-transparent py-[9px] px-[18px] rounded-full text-[14px] relative z-[1] transition-colors duration-300 ${
              billing === "monthly" ? "text-white" : "text-[#5B665F]"
            }`}
          >
            Monthly
          </button>

          <button
            type="button"
  aria-pressed={billing === "yearly"}
  onClick={() => setBilling("yearly")}
            className={`border-0 bg-transparent py-[9px] px-[18px] rounded-full text-[14px] relative z-[1] transition-colors duration-300 ${
              billing === "yearly" ? "text-white" : "text-[#5B665F]"
            }`}
          >
            Yearly
            <span>
              <em className="text-[10px] text-[#F4A07E] ml-[6px]">-20%</em>
            </span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 max-[940px]:grid-cols-1 max-[940px]:mx-auto gap-[18px] max-sm:gap-[14px] items-stretch ">
        <article className="transition-[opacity,transform,translate,box-shadow] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] rounded-[28px] max-sm:rounded-[24px] p-[30px] max-sm:p-[22px] bg-[#ffffffd1] border border-[#1d2a2214] flex flex-col gap-[20px] relative delay-[160ms] hover:translate-y-[-6px]">
          <div className="flex items-center justify-between">
            <h3
              className={`${bricolage.className} text-[24px] font-semibold tracking-[-.035em] leading-[1.02] m-0 text-balance`}
            >
              Basic
            </h3>
          </div>
          <div>
            <div
              className={`${bricolage.className} text-[56px] max-sm:text-[48px] leading-[1.02] tabular-nums`}
            >
              $<span>0</span>
              <small className=" text-[15px] tracking-0 text-[#8E978F] ml-[4px] ">
                /mo
              </small>
            </div>
            <p className="mt-[6px] text-[#8E978F] text-[14px] m-0 ">
              For getting a feel for your numbers.
            </p>
          </div>
          <ul className="list-none p-0 m-0 grid gap-[12px] text-[15px] max-sm:text-[14px]">
            <li className="flex items-center gap-[10px]">
              <Check className="w-[16px] h-[16px] text-[#5FAE6E] flex-none" />
              Calculate daily calories
            </li>
            <li className="flex items-center gap-[10px]">
              <Check className="w-[16px] h-[16px] text-[#5FAE6E] flex-none" />
              Track protein, carbs and fats
            </li>
            <li className="flex items-center gap-[10px]">
              <Check className="w-[16px] h-[16px] text-[#5FAE6E] flex-none" />
              Manually log your meals
            </li>
            <li className=" opacity-[.4] flex items-center gap-[10px]">
              <X className="w-[16px] h-[16px] text-[#8E978F] flex-none" />
              Personalized meal plans
            </li>
          </ul>
          <Link href="/signup?plan=basic"
            className="bg-[#e9f6ec] text-[#2E6B3E] justify-center mt-auto inline-flex items-center gap-[10px] border-0 rounded-full py-[13px] px-[22px] font-medium text-[15px] transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
          >
            Get access
          </Link>
        </article>
        <article className="glow-border transition-[opacity,transform,translate,box-shadow] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] rounded-[28px] max-sm:rounded-[24px] p-[30px] max-sm:p-[22px] bg-[linear-gradient(180deg,#E9F6EC,#ffffff)] shadow-[0_40px_80px_-40px_rgba(46,107,62,0.35)] border border-[#1d2a2214] flex flex-col gap-[20px] relative hover:-translate-y-[6px]">
          <div className="flex items-center justify-between">
            <h3
              className={`${bricolage.className} text-[24px] font-semibold tracking-[-.035em] leading-[1.02] m-0 text-balance`}
            >
              Plus
            </h3>
            <span className="text-[10px] tracking-[.08em] uppercase py-[5px] px-[10px] rounded-full bg-[#FFEFE7] text-[#A4502B]">
              Recommended
            </span>
          </div>
          <div>
            <div
              className={`${bricolage.className} text-[56px] max-sm:text-[48px] leading-[1.02] tabular-nums`}
            >
              $<span>{getPrice(prices.plus)}</span>
              <small className=" text-[15px] tracking-0 text-[#8E978F] ml-[4px] ">
                /mo
              </small>
            </div>
            <p className="mt-[6px] text-[#8E978F] text-[14px] m-0 ">
              Everything you need to stay on plan.
            </p>
          </div>
          <ul className="list-none p-0 m-0 grid gap-[12px] text-[15px] max-sm:text-[14px]">
            <li className="flex items-center gap-[10px]">
              <Check className="w-[16px] h-[16px] text-[#5FAE6E] flex-none" />
              Everything in Basic
            </li>
            <li className="flex items-center gap-[10px]">
              <Check className="w-[16px] h-[16px] text-[#5FAE6E] flex-none" />
              Personalized macro targets{" "}
            </li>
            <li className="flex items-center gap-[10px]">
              <Check className="w-[16px] h-[16px] text-[#5FAE6E] flex-none" />
              Weekly meal plans with swaps{" "}
            </li>
            <li className=" flex items-center gap-[10px]">
              <Check className="w-[16px] h-[16px] text-[#5FAE6E] flex-none" />
              Animated step-by-step recipes
            </li>
          </ul>
          <Link href="/signup?plan=plus"
            className="bg-[#2E6B3E] text-[#ffffff] justify-center mt-auto inline-flex items-center gap-[10px] border-0 rounded-full py-[13px] px-[22px] font-medium text-[15px] transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
          >
            Get access
          </Link>
        </article>
        <article className="transition-[opacity,transform,translate,box-shadow] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] rounded-[28px] max-sm:rounded-[24px] p-[30px] max-sm:p-[22px] bg-[#ffffffd1] border border-[#1d2a2214] flex flex-col gap-[20px] relative delay-[160ms] hover:translate-y-[-6px]">
          <div className="flex items-center justify-between">
            <h3
              className={`${bricolage.className} text-[24px] font-semibold tracking-[-.035em] leading-[1.02] m-0 text-balance`}
            >
              Premium
            </h3>
          </div>
          <div>
            <div
              className={`${bricolage.className} text-[56px] max-sm:text-[48px] leading-[1.02] tabular-nums`}
            >
              $<span>{getPrice(prices.pro)}</span>
              <small className=" text-[15px] tracking-0 text-[#8E978F] ml-[4px] ">
                /mo
              </small>
            </div>
            <p className="mt-[6px] text-[#8E978F] text-[14px] m-0 ">
              For precise goals and deep tracking.
            </p>
          </div>
          <ul className="list-none p-0 m-0 grid gap-[12px] text-[15px] max-sm:text-[14px]">
            <li className="flex items-center gap-[10px]">
              <Check className="w-[16px] h-[16px] text-[#5FAE6E] flex-none" />
              Everything in Plus
            </li>
            <li className="flex items-center gap-[10px]">
              <Check className="w-[16px] h-[16px] text-[#5FAE6E] flex-none" />
              Full micronutrient tracking{" "}
            </li>
            <li className="flex items-center gap-[10px]">
              <Check className="w-[16px] h-[16px] text-[#5FAE6E] flex-none" />
              Monitor daily nutrition intake{" "}
            </li>
            <li className=" flex items-center gap-[10px]">
              <Check className="w-[16px] h-[16px] text-[#5FAE6E] flex-none" />
              Progress reports and insights{" "}
            </li>
          </ul>
          <Link href="/signup?plan=premium"
            className="bg-[#e9f6ec] text-[#2E6B3E] justify-center mt-auto inline-flex items-center gap-[10px] border-0 rounded-full py-[13px] px-[22px] font-medium text-[15px] transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(.2,.8,.2,1)]"
          >
            Get access
          </Link>
        </article>
      </div>
      <p className="text-[#8E978F] text-center text-[13px] max-sm:text-[12px] mt-[22px]">
        Illustrative pricing, based on comparable apps. Subject to change before launch.
      </p>
    </section>
  );
}