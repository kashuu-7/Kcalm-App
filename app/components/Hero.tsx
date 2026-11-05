"use client";
import React, { useRef } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { Instrument_Serif } from "next/font/google";
import { Leaf, Soup, TrendingUp } from "lucide-react";
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

export default function Hero() {
  const MAX_TILT = 12;
  const tiltRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    tiltRef.current.style.transform = `perspective(1200px) rotateX(${-y * MAX_TILT}deg) rotateY(${x * MAX_TILT}deg)`;
  };

  const handleLeave = () => {
    if (!tiltRef.current) return;
    tiltRef.current.style.transform =
      "perspective(1200px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <main>
      <div className="py-[40px] sm:py-[64px] lg:py-[96px] grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-[clamp(32px,5vw,56px)] items-center">
        {/* LEFT: text */}
        <div>
          <span className="inline-flex items-center gap-[10px] py-[6px] pr-[14px] pl-[6px] rounded-full bg-[rgba(255,255,255,0.82)] border border-[rgba(29,42,34,0.08)] text-[12px] sm:text-[13px] text-[#5B665F] animate-[rise_.9s_cubic-bezier(.2,.8,.2,1)_both]">
            <b className="bg-[#E9F6EC] text-[#2E6B3E] font-[500] py-[3px] px-[10px] rounded-full text-[12px]">
              New
            </b>
            Animated recipes, now in beta
          </span>

          <h1
            className={`${bricolage.className} mt-[18px] text-[clamp(38px,9vw,86px)] lg:text-[clamp(44px,6.2vw,86px)] font-semibold tracking-[-0.035em] leading-[1.02]`}
          >
            A healthier you, without the
            <span
              className={`${serif.className} pl-[12px] pb-[4px] inline-block bg-[linear-gradient(100deg,var(--matcha)_0%,var(--apricot)_55%,var(--matcha)_100%)] bg-[length:200%_100%] bg-clip-text text-transparent animate-[sheen_6s_ease-in-out_infinite] pr-[.08em]`}
            >
              guesswork.
            </span>
          </h1>

          <p className="mt-[18px] sm:mt-[22px] text-[#5B665F] max-w-[620px] text-[clamp(16px,1.4vw,18px)]">
            Personalized diet plans, delicious recipes and expert guidance, all
            in one calm place. Simple. Sustainable. Real.
          </p>

          <div className="flex flex-wrap mt-[28px] sm:mt-[32px] gap-[12px]">
            <Link href="/signup"
              className="group flex-1 sm:flex-none justify-center py-[10px] pr-[12px] pl-[18px] text-[14px] bg-[#2E6B3E] text-[#ffffff] shadow-[0_10px_26px_-12px_rgba(46,107,62,0.55)] inline-flex items-center gap-[10px] rounded-full font-[500] whitespace-nowrap transition-[transform,box-shadow,background] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:shadow-[0_16px_34px_-12px_rgba(46,107,62,0.6)]"
            >
              Get started free
              <span className="w-[26px] h-[26px] rounded-full bg-[#FFEFE7] text-[#1D2A22] grid place-items-center transition-transform duration-[350ms] group-hover:rotate-[-45deg]">
                →
              </span>
            </Link>
            <a
              href="#how-it-works"
              className="flex-1 sm:flex-none justify-center whitespace-nowrap inline-flex items-center gap-[10px] rounded-full py-[13px] px-[22px] font-[500] text-[15px] transition-[transform,box-shadow,background] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] bg-transparent border border-[#1d2a2224]"
            >
              See how it works
            </a>
          </div>

          <div className="flex items-center gap-[14px] mt-[28px] sm:mt-[36px]">
            <div className="flex">
              <a
                href="#"
                className="bg-[#F1C9BA] w-[38px] h-[38px] rounded-full border-2 border-[#ffffff] grid place-items-center text-[13px] font-semibold text-[#2A2A20]"
              >
                AR
              </a>
              <a
                href="#"
                className="bg-[#DDE8CC] w-[38px] h-[38px] ml-[-10px] rounded-full border-2 border-[#ffffff] grid place-items-center text-[13px] font-semibold text-[#2A2A20]"
              >
                SK
              </a>
              <a
                href="#"
                className="bg-[#F1DB9C] w-[38px] h-[38px] ml-[-10px] rounded-full border-2 border-[#ffffff] grid place-items-center text-[13px] font-semibold text-[#2A2A20]"
              >
                MJ
              </a>
              <a
                href="#"
                className="bg-[#F8DCC8] w-[38px] h-[38px] ml-[-10px] rounded-full border-2 border-[#ffffff] grid place-items-center text-[13px] font-semibold text-[#2A2A20]"
              >
                UR
              </a>
            </div>
            <div>
              <strong
                className={`${bricolage.className} text-[22px] tracking-[-0.03em] block leading-none`}
              >
                <span>100</span>+
              </strong>
              <small className="text-[#8E978F] text-[13px]">
                happy customers and counting
              </small>
            </div>
          </div>
        </div>

        {/* RIGHT: phone */}
        <div
          className="relative w-full max-w-[560px] mx-auto h-[560px] sm:h-[620px] lg:h-[660px]"
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
        >
          <div className="absolute inset-[8%_10%] rounded-full bg-[radial-gradient(circle_at_50%_50%,#FFEFE7_0%,transparent_65%)] animate-[breathe_6s_ease-in-out_infinite]"></div>
          <div className="absolute inset-[6%_4%] border border-dashed border-[#1d2a2224] rounded-full animate-[spin_60s_linear_infinite]"></div>
          <div className="absolute inset-[18%_16%] border border-dashed border-[#1d2a2224] rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>

          <div
            ref={tiltRef}
            className="absolute left-1/2 top-1/2 w-[270px] h-[520px] sm:h-[560px] -mt-[260px] sm:-mt-[280px] -ml-[135px] [transform-style:preserve-3d] transition-transform duration-300 ease-out will-change-transform"
          >
            <div className="w-full h-full rounded-[44px] bg-white p-[10px] shadow-[0_40px_70px_-30px_rgba(29,42,34,0.25),0_0_0_1px_rgba(29,42,34,0.08)] animate-[rise_1s_.2s_cubic-bezier(.2,.8,.2,1)_both]">
              <div className="h-full rounded-[35px] bg-[#F8FAF9] overflow-hidden px-[16px] py-[18px] flex flex-col gap-[12px] text-[#1D2A22]">
                <div className="w-[90px] h-[24px] rounded-[20px] bg-[#EEF1EE] -mt-[8px] mx-auto mb-[2px]"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] tracking-[0.08em] uppercase text-[#8E978F]">
                      Wed · Sep 23
                    </span>
                    <h4 className="m-0 text-[18px] tracking-[-.03em] font-medium">
                      Good morning
                    </h4>
                  </div>
                  <div className="flex gap-[4px] bg-[#1d2a2214] p-[3px] rounded-full text-[11px]">
                    <span className="bg-[#ffffff] text-[#1D2A22] shadow-[0_2px_6px_rgba(0,0,0,0.08)] py-[5px] px-[10px] rounded-full">
                      Today
                    </span>
                    <span className="py-[5px] px-[10px] rounded-full text-[#5B665F]">
                      Week
                    </span>
                  </div>
                </div>
                <div className="relative grid place-items-center py-[6px] px-0">
                  <svg
                    className="w-[150px] h-[150px] sm:w-[170px] sm:h-[170px]"
                    viewBox="0 0 160 160"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#6E9A4C" />
                        <stop offset="1" stopColor="#EE9A68" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#E4E7E5"
                      strokeWidth="10"
                    />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="url(#rg)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray="439.8"
                      strokeDashoffset="202.4"
                      transform="rotate(-90 80 80)"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <b
                      className={`${bricolage.className} text-[38px] tracking-[-0.05em] block leading-none tabular-nums`}
                    >
                      850
                    </b>
                    <small className="text-[10px] tracking-[0.1em] text-[#8E978F] uppercase">
                      kcal left
                    </small>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-[6px]">
                  <div className="bg-[#ffffff] rounded-[14px] py-[9px] px-[8px] text-[10px] text-[#8E978F]">
                    Protein
                    <b className="block text-[14px] text-[#1D2A22] tracking-[-0.02em] mt-[2px]">
                      85g
                    </b>
                    <div className="h-[4px] rounded-[4px] bg-[#1d2a2214] mt-[6px] overflow-hidden">
                      <i className="block h-full rounded-[4px] bg-[#5FAE6E] w-[68%] animate-[progressFill_1.8s_.6s_cubic-bezier(.2,.8,.2,1)_both]"></i>
                    </div>
                  </div>
                  <div className="bg-[#ffffff] rounded-[14px] py-[9px] px-[8px] text-[10px] text-[#8E978F]">
                    Carbs
                    <b className="block text-[14px] text-[#1D2A22] tracking-[-0.02em] mt-[2px]">
                      140g
                    </b>
                    <div className="h-[4px] rounded-[4px] bg-[#1d2a2214] mt-[6px] overflow-hidden">
                      <i className="block h-full rounded-[4px] bg-[#FFF3CF] w-[68%] animate-[progressFill_1.8s_.6s_cubic-bezier(.2,.8,.2,1)_both]"></i>
                    </div>
                  </div>
                  <div className="bg-[#ffffff] rounded-[14px] py-[9px] px-[8px] text-[10px] text-[#8E978F]">
                    Fat
                    <b className="block text-[14px] text-[#1D2A22] tracking-[-0.02em] mt-[2px]">
                      45g
                    </b>
                    <div className="h-[4px] rounded-[4px] bg-[#1d2a2214] mt-[6px] overflow-hidden">
                      <i className="block h-full rounded-[4px] bg-[#F4A07E] w-[68%] animate-[progressFill_1.8s_.6s_cubic-bezier(.2,.8,.2,1)_both]"></i>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-[10px] bg-[#ffffff] rounded-[16px] p-[10px]">
                  <span className="w-[38px] h-[38px] rounded-[12px] grid place-items-center flex-none bg-[#E9F6EC]">
                    <Leaf className="w-[18px] h-[18px] text-[#1D2A22]" />
                  </span>
                  <div className="text-[12px] leading-[1.3]">
                    Greek yogurt bowl <br />
                    <small className="text-[#8E978F] text-[10px]">
                      Breakfast · 8 min
                    </small>
                  </div>
                  <span className="ml-auto whitespace-nowrap text-[10px] text-[#5B665F]">
                    320 kcal
                  </span>
                </div>
                <div className="flex items-center gap-[10px] bg-[#ffffff] rounded-[16px] p-[10px]">
                  <span className="w-[38px] h-[38px] rounded-[12px] grid place-items-center flex-none bg-[#FFEFE7]">
                    <Soup className="w-[18px] h-[18px] text-[#1D2A22]" />
                  </span>
                  <div className="text-[12px] leading-[1.3]">
                    Lemon chickpea salad <br />
                    <small className="text-[#8E978F] text-[10px]">
                      Lunch · 12 min
                    </small>
                  </div>
                  <span className="ml-auto whitespace-nowrap text-[10px] text-[#5B665F]">
                    480 kcal
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Daily calories (mobile pe bhi dikhega) */}
          <div className="float absolute bg-[#ffffffd1] backdrop-blur-[16px] border border-[#1d2a2214] rounded-[18px] py-[10px] px-[12px] sm:py-[12px] sm:px-[14px] shadow-[0_1px_2px_rgba(29,42,34,0.04),0_18px_40px_-22px_rgba(29,42,34,0.16)] top-[2%] sm:top-[6%] left-0 [animation-delay:-1s] text-[12px] animate-[bob_7s_ease-in-out_infinite] z-[3]">
            <span className="text-[10px] tracking-[.08em] uppercase text-[#8E978F]">
              Daily calories
            </span>
            <b
              className={`${bricolage.className} text-[20px] sm:text-[22px] tracking-[-0.04em] block leading-[1.1] tabular-nums`}
            >
              <span>1,850</span>
              <small className="text-[12px] tracking-[0]">kcal</small>
            </b>
            <svg
              className="block w-[90px] sm:w-[110px] h-[30px] mt-[4px]"
              viewBox="0 0 110 30"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="sparkGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#5FAE6E" />
                </linearGradient>
              </defs>
              <path
                className="fill-none stroke-[2px] [stroke-linecap:round]"
                stroke="url(#sparkGradient)"
                d="M2 24 C16 22, 22 12, 36 16 S58 26, 70 14 S92 4, 108 6"
              />
            </svg>
          </div>

          {/* Micronutrients (md se upar) */}
          <div className="hidden md:block absolute top-[16%] right-0 bg-[#ffffffd1] backdrop-blur-[16px] border border-[#1d2a2214] rounded-[18px] py-[12px] px-[14px] shadow-[var(--shadow)] text-[12px] animate-[bob_7s_ease-in-out_infinite] z-[3] [animation-delay:-3s]">
            <span className="text-[10px] tracking-[.08em] uppercase text-[#8E978F]">
              Micronutrients
            </span>
            <div className="grid grid-cols-2 gap-y-[8px] gap-x-[14px] mt-[6px]">
              <div className="text-[10px] text-[#8E978F]">
                Vitamin D <br />
                <b className="text-[13px] text-[#1D2A22] font-medium tracking-normal">
                  2,000 IU
                </b>
              </div>
              <div className="text-[10px] text-[#8E978F]">
                Calcium <br />
                <b className="text-[13px] text-[#1D2A22] font-medium tracking-normal">
                  1,000 mg
                </b>
              </div>
              <div className="text-[10px] text-[#8E978F]">
                Iron <br />
                <b className="text-[13px] text-[#1D2A22] font-medium tracking-normal">
                  18 mg
                </b>
              </div>
              <div className="text-[10px] text-[#8E978F]">
                Fiber <br />
                <b className="text-[13px] text-[#1D2A22] font-medium tracking-normal">
                  38 g
                </b>
              </div>
            </div>
          </div>

          {/* Water intake (md se upar) */}
          <div className="hidden md:block absolute bottom-[12%] left-0 bg-[#ffffffd1] backdrop-blur-[16px] border border-[#1d2a2214] rounded-[18px] py-[12px] px-[14px] shadow-[var(--shadow)] text-[12px] animate-[bob_7s_ease-in-out_infinite] z-[3] [animation-delay:-5s]">
            <span className="text-[10px] tracking-[.08em] uppercase text-[#8E978F]">
              Water Intake
            </span>
            <b
              className={`${bricolage.className} text-[22px] tracking-[-0.04em] block leading-[1.1] tabular-nums`}
            >
              2.1 L
            </b>
            <div className="w-[90px] h-[5px] rounded-[5px] bg-[#1d2a2214] mt-[6px] overflow-hidden">
              <i className="w-[84%] bg-[linear-gradient(90deg,#9CC6D6,#6E9A4C)] block h-full rounded-[5px]"></i>
            </div>
            <small className="text-[11px] text-[#8E978F]">of 2.5 L goal</small>
          </div>

          {/* Weight progress (mobile pe bhi dikhega) */}
          <div className="absolute right-0 bottom-0 flex items-center gap-[10px] bg-[#ffffffd1] backdrop-blur-[16px] border border-[#1d2a2214] rounded-[18px] py-[10px] px-[12px] sm:py-[12px] sm:px-[14px] shadow-[var(--shadow)] text-[12px] animate-[bob_7s_ease-in-out_infinite] z-[3] [animation-delay:-5s]">
            <span className="w-[34px] h-[34px] rounded-[11px] bg-[#F4A07E] grid place-items-center text-[#2A1C12]">
              <TrendingUp className="w-[16px] h-[16px] text-[#2A1C12]" />
            </span>
            <div>
              <span className="text-[10px] tracking-[.08em] uppercase text-[#8E978F]">
                Weight progress
              </span>
              <b
                className={`${bricolage.className} text-[20px] sm:text-[22px] tracking-[-0.04em] block leading-[1.1] tabular-nums`}
              >
                72 kg
              </b>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}