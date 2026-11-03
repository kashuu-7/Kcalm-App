"use client";
import React, { useState, useEffect, useRef } from "react";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import { Target, Soup, ChefHat } from 'lucide-react';

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function HowItWorks() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !trackRef.current) return;

      const windowHeight = window.innerHeight;
      const containerRect = containerRef.current.getBoundingClientRect();
      const trackRect = trackRef.current.getBoundingClientRect();

      // Track se container ke end tak ka fixed distance
      const totalDistance = containerRect.bottom - trackRect.top;

      // Track jab screen ke bottom pe aaye tab 0, uske baad jitna scroll hua
      const scrolled = windowHeight - trackRect.top;

      let progress = (scrolled / totalDistance) * 100;
      progress = Math.max(0, Math.min(100, progress));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <section id="how-it-works"
      ref={containerRef}
      className="py-[clamp(72px,10vw,128px)]"
    >
      <div className="flex flex-wrap items-end justify-between gap-6 max-sm:gap-4 mb-[clamp(36px,5vw,56px)]">
        <div>
          <span className="block mb-[14px] text-[12px] tracking-[.08em] uppercase text-[#8E978F]">
            How it works
          </span>
          <h2
            className={`${bricolage.className} text-[clamp(34px,5vw,60px)] font-semibold tracking-[-0.035em] leading-[1.02] m-0 text-balance`}
          >
            From your goal to your plate in{" "}
            <span className={serif.className}>three steps.</span>
          </h2>
        </div>
        <p className="text-[#5B665F] text-[clamp(16px,1.4vw,18px)] max-w-[620px]">
          Simple steps. Real food. A plan designed around your goals, your
          lifestyle and your taste.
        </p>
      </div>

      <div 
          ref={trackRef}
      className="grid grid-cols-3 max-[940px]:grid-cols-1 gap-[18px] max-[940px]:gap-[14px] relative">
        <div
          className="absolute left-0 right-0 -top-[28px] h-[2px] bg-[#1d2a2214] rounded-[2px] overflow-hidden"
        >
          <i
            className="block h-full bg-[linear-gradient(90deg,var(--matcha,),var(--apricot))]"
            style={{ width: `${scrollProgress}%` }}
          ></i>
        </div>
        <article className="relative p-[28px] max-lg:p-[22px] rounded-[28px] bg-[#E9F6EC] border border-[#1d2a2214] overflow-hidden shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-[160ms]">
            <span className={`${bricolage.className} text-[120px] max-lg:text-[96px] leading-[.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_#1d2a2224] absolute right-[18px] max-sm:right-[14px] top-[18px] max-sm:top-[14px]`}>
                1
            </span>
            <div className="w-[56px] h-[56px] rounded-[18px] grid place-items-center mb-[56px] max-lg:mb-[44px] max-sm:mb-[36px] bg-[#ffffff] text-[#2E6B3E] ">
                <Target className="w-[26px] h-[26px] text-[#2E6B3E] " />
            </div>
            <h3 className={`${bricolage.className} text-[26px] max-lg:text-[22px] font-semibold tracking-[-.03em] leading-[1.02] m-0 text-balance`}>
                Tell us your goal
            </h3>
            <p className="mt-[10px] text-[15px] max-sm:text-[14px] text-[#5B665F]">
                Share your lifestyle, health data and routine. Lose, maintain or build: we start where you are.
            </p>
        </article>
        <article className="relative p-[28px] max-lg:p-[22px] rounded-[28px] bg-[#FFF3CF] border border-[#1d2a2214] overflow-hidden shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-[160ms]">
            <span className={`${bricolage.className} text-[120px] max-lg:text-[96px] leading-[.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_#1d2a2224] absolute right-[18px] max-sm:right-[14px] top-[18px] max-sm:top-[14px]`}>
                2
            </span>
            <div className="w-[56px] h-[56px] rounded-[18px] grid place-items-center mb-[56px] max-lg:mb-[44px] max-sm:mb-[36px] bg-[#ffffff] text-[#2E6B3E] ">
                <Soup className="w-[26px] h-[26px] text-[#4A3B12] " />
            </div>
            <h3 className={`${bricolage.className} text-[26px] max-lg:text-[22px] font-semibold tracking-[-.03em] leading-[1.02] m-0 text-balance`}>
                Get your personal plan
            </h3>
            <p className="mt-[10px] text-[15px] max-sm:text-[14px] text-[#5B665F]">
                Calories, macros and micros tuned to you, turned into a week of meals you'll actually want to eat.
            </p>
        </article>
        <article className="relative p-[28px] max-lg:p-[22px] rounded-[28px] bg-[#FFEFE7] border border-[#1d2a2214] overflow-hidden shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-[160ms]">
            <span className={`${bricolage.className} text-[120px] max-lg:text-[96px] leading-[.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_#1d2a2224] absolute right-[18px] max-sm:right-[14px] top-[18px] max-sm:top-[14px]`}>
                3
            </span>
            <div className="w-[56px] h-[56px] rounded-[18px] grid place-items-center mb-[56px] max-lg:mb-[44px] max-sm:mb-[36px] bg-[#ffffff] text-[#2E6B3E] ">
                <ChefHat className="w-[26px] h-[26px] text-[#7A3E1A] " />
            </div>
            <h3 className={`${bricolage.className} text-[26px] max-lg:text-[22px] font-semibold tracking-[-.03em] leading-[1.02] m-0 text-balance`}>
                Follow easy recipes
            </h3>
            <p className="mt-[10px] text-[15px] max-sm:text-[14px] text-[#5B665F]">
                Short, animated cooking steps with built-in timers. Finish dinner without scrolling back and forth.
            </p>
        </article>
      </div>
    </section>
  );
}