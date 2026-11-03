"use client";

import { useEffect, useState } from "react";
import { ChartLine, RotateCcw, Check } from "lucide-react";
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

const steps = [
  "Rinse and drain one can of chickpeas.",
  "Dice cucumber, tomato and red onion.",
  "Whisk lemon, olive oil and a pinch of sumac.",
  "Toss everything, top with feta and parsley.",
];

export default function Different() {
  const [time, setTime] = useState(120);
  const [activeStep, setActiveStep] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => (prev > 0 ? prev - 1 : 120));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // lines fill
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  // div active disactivate
  useEffect(() => {
    const timer = setInterval(() => {
      setIsDone((current) => !current);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-[clamp(72px,10vw,128px)] pt-0">
      <div className="flex flex-wrap items-end justify-between gap-[24px] max-sm:gap-[16px] mb-[clamp(36px,5vw,56px)] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-[80ms]">
        <div>
          <span className="block mb-[14px] text-[12px] tracking-[.08em] uppercase text-[#8E978F]">
            What makes it different
          </span>
          <h2
            className={`${bricolage.className} text-[clamp(34px,5vw,60px)] font-semibold tracking-[-0.035em] leading-[1.02] m-0 text-balance`}
          >
            Not another calculator with a recipe box
            <span className={`${serif.className} tracking-[-.01em] `}>
              {" "}
              bolted on.
            </span>
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-6 max-[940px]:grid-cols-2 max-sm:grid-cols-1 gap-[18px] max-sm:gap-[14px]">
        {/* 1. Precision */}
        <article className="col-span-4 max-[940px]:col-span-2 max-sm:col-span-1 min-h-[360px] grid grid-cols-2 max-sm:grid-cols-1 gap-[24px] items-center transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] bg-[#FAFBFA] shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)] relative rounded-[28px] border border-[#1d2a2214] p-[28px] max-sm:p-[20px] overflow-hidden isolate before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(420px_circle_at_691.5px_50%_26px_50%,#FFEFE7,transparent_60%)] before:opacity-0 before:transition-opacity after:duration-[400ms]">
          <div>
            <span className="inline-block text-[11px] tracking-[.08em] uppercase py-[5px] px-[10px] rounded-full border border-[#1d2a2224] mb-[18px]">
              Precision
            </span>
            <h3
              className={`${bricolage.className} text-[clamp(22px,2.2vw,28px)] tracking-[-.03em] font-semibold leading-[1.02] m-0 text-balance`}
            >
              Know what to eat, every single day
            </h3>
            <p className="text-[15px] max-w-[437px] text-[#5B665F] mt-[10px]">
              Your plan is built and updated daily. No guesswork, just open the
              app and know exactly what's next.
            </p>
            <a
              href="#"
              className="bg-[#2E6B3E] text-[#ffffff] mt-[26px] inline-flex items-center gap-[10px] border-0 rounded-full py-[13px] px-[22px] font-medium text-[15px] transition-[transform,box-shadow,background] duration-[300ms] ease-[cubic-bezier(.2,.8,.2,1)] shadow-[0_10px_26px_-12px_rgba(46,107,62,.55)]"
            >
              Start your plan
              <span className="w-[26px] h-[26px] rounded-full bg-[#FFEFE7] text-[#1D2A22] grid place-items-center transition-transform duration-[350ms]">
                →
              </span>
            </a>
          </div>
          <div className="grid gap-[12px]">
            <div className="bg-[#ffffff] border border-[#1d2a2214] rounded-[20px] py-[14px] px-[16px]">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] tracking-[.08em] uppercase text-[#8E978F]">
                  Today's target
                </span>
                <b
                  className={`${bricolage.className} text-[30px] max-sm:text-[26px] tracking-[-.04em] tabular-nums`}
                >
                  <span>1,850</span>
                  <small className="text-[#8E978F] ml-3px tracking-0 text-[13px]">
                    {" "}
                    kcal
                  </small>
                </b>
              </div>
            </div>
            <div className="bg-[#ffffff] border border-[#1d2a2214] rounded-[20px] py-[14px] px-[16px]">
              <span className="text-[11px] tracking-[.08em] uppercase text-[#8E978F]">
                Macros
              </span>
              <div className="grid grid-cols-[52px_1fr_44px] items-center gap-[10px] text-[12px] text-[#5b665f] mt-[8px]">
                <span>Protein</span>

                <div className=" h-[6px] rounded-[4px] bg-[#1d2a2214] overflow-hidden">
                  <i
                    data-w="72"
                    className="block h-full rounded-[4px] bg-[var(--matcha)] w-[72%] transition-[width] duration-[1800ms] delay-[600ms] ease-[cubic-bezier(.2,.8,.2,1)]"
                  ></i>
                </div>

                <span className="text-[11px] text-right ">125g</span>
              </div>
              <div className="grid grid-cols-[52px_1fr_44px] items-center gap-[10px] text-[12px] text-[#5b665f] mt-[8px]">
                <span>Carbs</span>

                <div className=" h-[6px] rounded-[4px] bg-[#1d2a2214] overflow-hidden">
                  <i
                    data-w="60"
                    className="block h-full rounded-[4px] bg-[var(--butter)] w-[60%] transition-[width] duration-[1800ms] delay-[600ms] ease-[cubic-bezier(.2,.8,.2,1)]"
                  ></i>
                </div>

                <span className="text-[11px] text-right ">180g</span>
              </div>
              <div className="grid grid-cols-[52px_1fr_44px] items-center gap-[10px] text-[12px] text-[#5b665f] mt-[8px]">
                <span>Fats</span>

                <div className=" h-[6px] rounded-[4px] bg-[#1d2a2214] overflow-hidden">
                  <i
                    data-w="48"
                    className="block h-full rounded-[4px] bg-[var(--apricot)] w-[48%] transition-[width] duration-[1800ms] delay-[600ms] ease-[cubic-bezier(.2,.8,.2,1)]"
                  ></i>
                </div>

                <span className="text-[11px] text-right ">60g</span>
              </div>
            </div>
          </div>
        </article>

        {/* 2. Step by step */}
        <article className="col-span-2 max-[940px]:col-span-2 max-sm:col-span-1 bg-[#F0EDFD] relative rounded-[28px] border border-[#1d2a2214] p-[28px] max-sm:p-[20px] overflow-hidden isolate transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] shadow-[0_1px_2px_rgba(29,42,34,0.04),0_18px_40px_-22px_rgba(29,42,34,0.16)] before:content-[''] before:absolute before:inset-0 before:z-[-1] before:bg-[radial-gradient(420px_circle_at_var(--mx,_50%)_var(--my,_50%),#FFEFE7,transparent_60%)] before:opacity-0 before:transition-opacity before:duration-[400ms]">
          <span className="inline-block text-[11px] tracking-[.08em] uppercase py-[5px] px-[10px] rounded-full border border-[#1d2a2224] mb-[18px]">
            Step by step
          </span>
          <h3
            className={`${bricolage.className} text-[clamp(22px,2.2vw,28px)] tracking-[-.03em] font-semibold leading-[1.02] m-0 text-balance`}
          >
            Cook with confidence
          </h3>
          <p className="text-[15px] max-w-[437px] text-[#5B665F] mt-[10px]">
            Recipes come to life with guided steps and built-in timers.
          </p>
          <div className="bg-[#ffffff] border border-[#1d2a2214] shadow-[var(--shadow)] rounded-[20px] p-[16px] mt-[22px]">
            <div className="flex justify-between items-center text-[11px] tracking-[.06em] uppercase opacity-75">
              <span>Lemon chickpea salad</span>
              <span className="flex items-center gap-[8px]">
                <span className="w-[8px] h-[8px] rounded-full bg-[var(--apricot)] animate-pulse"></span>
                <b>
                  {String(Math.floor(time / 60)).padStart(2, "0")}:
                  {String(time % 60).padStart(2, "0")}
                </b>
              </span>
            </div>
            <div
              key={activeStep}
              className={`${bricolage.className} text-[20px] tracking-[-0.02em] mt-[12px] min-h-[52px] leading-[1.25] animate-[stepText_.35s_ease-out]`}
            >
              {steps[activeStep]}
            </div>
            <div className="flex gap-[6px] mt-[14px]">
              {steps.map((_, index) => (
                <i
                  key={index}
                  className={`flex-1 h-[3px] rounded-[3px] overflow-hidden relative ${
                    index < activeStep
                      ? "bg-[var(--apricot)]"
                      : "bg-[#1d2a2224]"
                  }`}
                >
                  {index === activeStep && (
                    <span className="absolute inset-y-0 left-0 w-full bg-[var(--apricot)] origin-left animate-[fill_3.2s_linear_forwards]" />
                  )}
                </i>
              ))}
            </div>
          </div>
        </article>

        {/* 3. Chart line */}
        <article className="col-span-2 max-[940px]:col-span-1 max-sm:col-span-1 bg-[#E9F6EC] relative rounded-[28px] border border-[#1d2a2214] p-[28px] max-sm:p-[20px] overflow-hidden isolate transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] shadow-[0_1px_2px_rgba(29,42,34,0.04),0_18px_40px_-22px_rgba(29,42,34,0.16)] before:content-[''] before:absolute before:inset-0 before:z-[-1] before:bg-[radial-gradient(420px_circle_at_var(--mx,_50%)_var(--my,_50%),#FFEFE7,transparent_60%)] before:opacity-0 before:transition-opacity before:duration-[400ms]">
          <div className="w-[46px] h-[46px] rounded-[14px] grid place-items-center bg-[#ffffff] text-[#2E6B3E] mb-[22px]">
            <ChartLine size={22} />
          </div>
          <h3
            className={`${bricolage.className} text-[clamp(22px,2.2vw,28px)] tracking-[-.03em] font-semibold leading-[1.02] m-0 text-balance`}
          >
            Precision without the guesswork
          </h3>
          <p className="text-[15px] max-w-[437px] text-[#5B665F] mt-[10px]">
            Track macros, micros, fiber and vitamins with nutrition data built
            for accurate, informed planning.
          </p>
        </article>

        {/* 4. Adapt every meal */}
        <article className="col-span-2 max-[940px]:col-span-1 max-sm:col-span-1 bg-[#FFEFE7] relative rounded-[28px] border border-[#1d2a2214] p-[28px] max-sm:p-[20px] overflow-hidden isolate transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] shadow-[0_1px_2px_rgba(29,42,34,0.04),0_18px_40px_-22px_rgba(29,42,34,0.16)] before:content-[''] before:absolute before:inset-0 before:z-[-1] before:bg-[radial-gradient(420px_circle_at_var(--mx,_50%)_var(--my,_50%),#FFEFE7,transparent_60%)] before:opacity-0 before:transition-opacity before:duration-[400ms]">
          <div className="w-[46px] h-[46px] rounded-[14px] grid place-items-center bg-[#ffffff] text-[#7A3E1A] mb-[22px]">
            <RotateCcw size={22} />
          </div>
          <h3
            className={`${bricolage.className} text-[clamp(22px,2.2vw,28px)] tracking-[-.03em] font-semibold leading-[1.02] m-0 text-balance`}
          >
            Adapt every meal, instantly
          </h3>
          <p className="text-[15px] max-w-[437px] text-[#5B665F] mt-[10px]">
            Missing an ingredient or craving something different? Swap it
            without rebuilding your whole day.
          </p>
        </article>

        {/* 5. Swap card */}
        <article className="col-span-2 max-[940px]:col-span-2 max-sm:col-span-1 bg-[#E7F3FC] relative rounded-[28px] border border-[#1d2a2214] p-[28px] max-sm:p-[20px] overflow-hidden isolate transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] shadow-[0_1px_2px_rgba(29,42,34,0.04),0_18px_40px_-22px_rgba(29,42,34,0.16)] before:content-[''] before:absolute before:inset-0 before:z-[-1] before:bg-[radial-gradient(420px_circle_at_var(--mx,_50%)_var(--my,_50%),#FFEFE7,transparent_60%)] before:opacity-0 before:transition-opacity before:duration-[400ms]">
          <div className="grid gap-[10px]">
            <div
              className={`flex items-center gap-[12px] bg-[#ffffff] border border-[#1d2a2214] rounded-[16px] py-[12px] px-[14px] text-[14px] transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ${
                isDone ? "opacity-[0.35] line-through scale-[0.97]" : ""
              }`}
            >
              <span className="w-[36px] h-[36px] rounded-[11px] flex-none bg-[#FCE4EA] "></span>
              <div>
                Salmon rice bowl
                <small className="text-[#8E978F] block text-[12px] ">
                  Dinner
                </small>
              </div>
              <span className="ml-auto text-[12px] text-[#5B665F]">
                540 kcal
              </span>
            </div>
            <div className="text-[11px] text-[var(--apricot)] text-center tracking-[.08em]">
              ↓ swapped · macros rebalanced
            </div>
            <div className="flex items-center gap-[12px] bg-[#ffffff] border border-[#1d2a2214] rounded-[16px] py-[12px] px-[14px] text-[14px] transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)] ">
              <span className="w-[36px] h-[36px] rounded-[11px] flex-none bg-[#E9F6EC] "></span>
              <div>
                Tofu teriyaki bowl
                <small className="text-[#8E978F] block text-[12px] ">
                  Dinner
                </small>
              </div>
              <span className="ml-auto text-[12px] text-[#5B665F]">
                532 kcal
              </span>
            </div>
          </div>
        </article>

        {/* 6. Personalized nutrition */}
        <article className=" grid items-center grid-cols-[1.1fr_1fr] max-[940px]:grid-cols-1 max-[940px]:gap-[24px] col-span-6 max-[940px]:col-span-2 max-sm:col-span-1 bg-[linear-gradient(135deg,#E9F6EC,#F0EDFD_55%,#FFEFE7)] relative rounded-[28px] border border-[#1d2a2214] p-[28px] max-sm:p-[20px] overflow-hidden isolate transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] shadow-[0_1px_2px_rgba(29,42,34,0.04),0_18px_40px_-22px_rgba(29,42,34,0.16)] before:content-[''] before:absolute before:inset-0 before:z-[-1] before:bg-[radial-gradient(420px_circle_at_var(--mx,_50%)_var(--my,_50%),#FFEFE7,transparent_60%)] before:opacity-0 before:transition-opacity before:duration-[400ms]">
          <div>
            <span className="inline-block text-[11px] tracking-[.08em] uppercase py-[5px] px-[10px] rounded-full border border-[#1d2a2224] mb-[18px]">
              Personalized nutrition
            </span>
            <h3
              className={`${bricolage.className} text-[clamp(28px,3.4vw,44px)] max-sm:text-[28px] tracking-[-.03em] font-semibold leading-[1.02] m-0 text-balance`}
            >
              Built around your goals,
              <span className={`${serif.className} tracking-[-.01em] `}>
                {" "}
                made simple.
              </span>
            </h3>
            <p className="text-[15px] max-w-[437px] text-[#5B665F] mt-[10px]">
              Your lifestyle, food preferences and daily nutrition needs shape
              every plan.
            </p>
            <ul className="list-none p-0 mt-[22px] grid gap-[10px]">
              <li className=" flex items-center gap-[10px] text-[15px]">
                <i className="w-[22px] h-[22px] rounded-full bg-[#5FAE6E] text-[#ffffff] grid place-items-center flex-none">
                  <Check className="w-[12px] h-[12px] text-[#ffffff] fill-[#ffffff] " />
                </i>
                Personalized meal plans
              </li>
              <li className=" flex items-center gap-[10px] text-[15px]">
                <i className="w-[22px] h-[22px] rounded-full bg-[#5FAE6E] text-[#ffffff] grid place-items-center flex-none">
                  <Check className="w-[12px] h-[12px] text-[#ffffff] fill-[#ffffff] " />
                </i>
                Daily calorie and macro targets
              </li>
              <li className=" flex items-center gap-[10px] text-[15px]">
                <i className="w-[22px] h-[22px] rounded-full bg-[#5FAE6E] text-[#ffffff] grid place-items-center flex-none">
                  <Check className="w-[12px] h-[12px] text-[#ffffff] fill-[#ffffff] " />
                </i>
                Smart meal recommendations
              </li>
              <li className=" flex items-center gap-[10px] text-[15px]">
                <i className="w-[22px] h-[22px] rounded-full bg-[#5FAE6E] text-[#ffffff] grid place-items-center flex-none">
                  <Check className="w-[12px] h-[12px] text-[#ffffff] fill-[#ffffff] " />
                </i>
                Easy recipe suggestions
              </li>
              <li className=" flex items-center gap-[10px] text-[15px]">
                <i className="w-[22px] h-[22px] rounded-full bg-[#5FAE6E] text-[#ffffff] grid place-items-center flex-none">
                  <Check className="w-[12px] h-[12px] text-[#ffffff] fill-[#ffffff] " />
                </i>
                Track nutrition and progress
              </li>
            </ul>
          </div>
          <div className="grid gap-[12px]">
            <div className="bg-[#ffffff] border border-[#1d2a2214] rounded-[20px] py-[14px] px-[16px]">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] tracking-[.08em] uppercase text-[#8E978F]">
                  Water intake
                </span>
                <b
                  className={`${bricolage.className} text-[30px] max-sm:text-[26px] tracking-[-.04em] tabular-nums`}
                >
                  2.1
                  <small className="text-[#8E978F] ml-3px tracking-0 text-[13px]">
                    {" "}
                    of 2.5 L
                  </small>
                </b>
              </div>
              <div className="h-[6px] rounded-[4px] bg-[#1d2a2224] overflow-hidden mt-[6px]">
                <i className="bg-[linear-gradient(90deg,#9CC6D6,#5FAE6E)] w-[84%] block h-full rounded-[4px] transition-[width] duration-[1800ms] delay-[600ms] ease-[cubic-bezier(.2,.8,.2,1)]"></i>
              </div>
            </div>
            <div className="bg-[#ffffff] border border-[#1d2a2214] rounded-[20px] py-[14px] px-[16px]">
              <div className="flex items-baseline justify-between max-sm:flex-wrap max-sm:gap-x-[8px]">
                <span className="text-[12px] tracking-[.08em] uppercase text-[#8E978F]">
                  Weight
                </span>
                <b
                  className={`${bricolage.className} text-[30px] max-sm:text-[26px] tracking-[-.04em] tabular-nums`}
                >
                  72
                  <small className="text-[#8E978F] ml-3px tracking-0 text-[13px]">
                    {" "}
                    kg · −4 this month
                  </small>
                </b>
              </div>
              <svg
                viewBox="0 0 300 70"
                width="100%"
                height="70"
                aria-hidden="true"
                className="mt-[8px]"
              >
                <defs>
                  <linearGradient id="wa" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#6E9A4C" stopOpacity=".35" />
                    <stop offset="1" stopColor="#6E9A4C" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d="M0 14 C 40 12, 60 26, 100 28 S 160 36, 200 44 S 260 54, 300 58 L300 70 L0 70Z"
                  fill="url(#wa)"
                />

                <path
                  className="wline"
                  d="M0 14 C 40 12, 60 26, 100 28 S 160 36, 200 44 S 260 54, 300 58"
                  fill="none"
                  stroke="var(--matcha)"
                  strokeWidth="2.5"
                  strokeDasharray="340"
                  strokeDashoffset="0"
                  style={{
                    transition: "stroke-dashoffset 2s",
                  }}
                />

                <circle cx="300" cy="58" r="5" fill="var(--apricot)" />
              </svg>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}