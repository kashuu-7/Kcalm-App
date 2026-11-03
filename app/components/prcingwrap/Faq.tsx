"use client";

import { useState } from "react";
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

const faqs = [
  {
    question: "How does my personalized diet plan work?",
    answer:
      "Your plan is built around your calorie, macro and nutrition goals to help you know exactly what to eat each day. It updates as your progress does.",
  },
  {
    question: "Can I swap meals I don't like?",
    answer:
      "Yes. Swap any meal in a tap and Kcalm rebalances the rest of your day so you stay on target.",
  },
  {
    question: "Can I regenerate my meal plan?",
    answer:
      "Anytime. Regenerate a single day or the whole week, keeping the meals you've marked as favorites.",
  },
  {
    question: "What are animated recipes?",
    answer:
      "Short, step-by-step cooking animations with a friendly voice guide and built-in timers, so you can cook without constantly checking your phone.",
  },
];

export default function Faq() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className="pt-0 py-[clamp(72px,10vw,128px)]">
      <div className="grid grid-cols-[.8fr_1.2fr] max-[940px]:grid-cols-1 gap-[clamp(24px,5vw,72px)] items-start">
        <div className="transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)]">
          <span className="block mb-[14px] text-[12px] tracking-[.08em] uppercase text-[#8E978F]">
            FAQ
          </span>
          <h2
            className={`${bricolage.className} text-[clamp(34px,5vw,60px)] font-semibold tracking-[-0.035em] leading-[1.02] m-0 text-balance`}
          >
            Questions,
            <span className={`${serif.className} tracking-[-.01em] `}>
              {" "}
              answered.
            </span>
          </h2>
          <p className="text-[#5B665F] max-w-[620px] text-[clamp(16px,1.4vw,18px)] mt-[18px]">
            Straightforward answers about meal plans, nutrition, recipes and
            tracking.
          </p>
        </div>
        <div className="grid gap-[10px] max-sm:gap-[8px] max-[940px]:w-full min-w-0">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={faq.question}
                className="rounded-[20px] max-sm:rounded-[18px] bg-[#ffffffd1] border border-[#1d2a2214] overflow-hidden transition-colors duration-300 shadow-[var(--shadow)]"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className={`${bricolage.className} box-border w-full flex justify-between items-center gap-[16px] max-sm:gap-[12px] py-[20px] px-[22px] max-sm:py-[16px] max-sm:px-[16px] cursor-pointer text-[19px] max-sm:text-[16.5px] tracking-[-0.02em] font-medium text-left`}
                >
                  {faq.question}

                  <span
                    className={`w-[32px] h-[32px] max-sm:w-[28px] max-sm:h-[28px] rounded-full border border-[#1d2a2224] grid place-items-center flex-none
                    transform transition-transform duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)]
                    ${
                        isOpen
                        ? "rotate-[135deg] bg-[#e9f6ec] text-[#2e6b3e]"
                        : "rotate-0 bg-white text-[#2e6b3e]"
                    }`}
                  >
                    +
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-[450ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[636px] text-[#5B665F] max-sm:text-[14px] pb-[22px] max-sm:pb-[18px] px-[22px] max-sm:px-[16px]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}