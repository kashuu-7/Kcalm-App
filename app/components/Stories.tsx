import React from "react";
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

export default function Stories() {
  return (
    <section id="stories" className="pt-0 py-[clamp(72px,10vw,128px)]">
      <div className="max-w-[1200px] mx-auto px-[clamp(16px,4vw,40px)] ">
        <div className="flex flex-wrap items-end justify-between gap-[24px] max-sm:gap-[16px] mb-[clamp(36px,5vw,56px)] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-[80ms]">
          <div>
            <span className="block mb-[14px] text-[12px] tracking-[.08em] uppercase text-[#8E978F]">
              Real people. Real results.
            </span>
            <h2
              className={`${bricolage.className} text-[clamp(34px,5vw,60px)] font-semibold tracking-[-0.035em] leading-[1.02] m-0 text-balance`}
            >
              Healthy habits,
              <span className={`${serif.className} tracking-[-.01em] `}>
                {" "}
                happier lives
              </span>
            </h2>
          </div>
          <p className="text-[clamp(16px,1.4vw,18px)] max-w-[620px] text-[#5B665F] mt-0">
            Join people who've already changed how they eat with Kcalm.
          </p>
        </div>
      </div>
      <div className="overflow-hidden mask-[linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] max-sm:mask-[linear-gradient(90deg,transparent,#000_3%,#000_97%,transparent)]">
        <div className="flex gap-[18px] max-sm:gap-[12px] w-max animate-[marquee_50s_linear_infinite]">
            {/* article 1 */}
            <article className="w-[340px] max-sm:w-[270px] flex-none rounded-[28px] max-sm:rounded-[22px] p-[26px] max-sm:p-[20px] bg-[#ffffffd1] border border-[#1d2a2214] flex flex-col gap-[14px] max-sm:gap-[12px] shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)]">
                <div className="text-[#f4a07e] tracking-[3px] text-[14px]">★★★★★</div>
                <h4 className={`${bricolage.className} text-[22px] max-sm:text-[19px] font-semibold tracking-[-.03em] m-0`}>
                    I've felt better!
                </h4>
                <p className="text-[15px] max-sm:text-[14px] text-[#5B665F]">
                    The meal plans are easy to follow and actually delicious.
                </p>
                <div className="flex items-center gap-[10px] mt-auto text-[14px] ">
                    <span className="w-[36px] h-[36px] rounded-[50%] grid  bg-[#DDE8CC] font-semibold text-[13px] text-[#2A2A20] place-items-center">
                        UR
                    </span>
                    <div>
                        Usman R.
                        <small className="block text-[12px] text-[#8E978F]">Verified user</small>
                    </div>
                </div>
            </article>
            {/* article 2 */}
            <article className="w-[340px] max-sm:w-[270px] flex-none rounded-[28px] max-sm:rounded-[22px] p-[26px] max-sm:p-[20px] bg-[#ffffffd1] border border-[#1d2a2214] flex flex-col gap-[14px] max-sm:gap-[12px] shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)]">
                <div className="text-[#f4a07e] tracking-[3px] text-[14px]">★★★★★</div>
                <h4 className={`${bricolage.className} text-[22px] max-sm:text-[19px] font-semibold tracking-[-.03em] m-0`}>
                    Lost 8 kg in 3 months
                </h4>
                <p className="text-[15px] max-sm:text-[14px] text-[#5B665F]">
                    And I feel more energetic than ever. No more guessing what to cook.
                </p>
                <div className="flex items-center gap-[10px] mt-auto text-[14px] ">
                    <span className="w-[36px] h-[36px] rounded-[50%] grid  bg-[#F1C9BA] font-semibold text-[13px] text-[#2A2A20] place-items-center">
                        SA
                    </span>
                    <div>
                        Sana A.
                        <small className="block text-[12px] text-[#8E978F]">Verified user</small>
                    </div>
                </div>
            </article>
            {/* article 3 */}
            <article className="w-[340px] max-sm:w-[270px] flex-none rounded-[28px] max-sm:rounded-[22px] p-[26px] max-sm:p-[20px] bg-[#ffffffd1] border border-[#1d2a2214] flex flex-col gap-[14px] max-sm:gap-[12px] shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)]">
                <div className="text-[#f4a07e] tracking-[3px] text-[14px]">★★★★★</div>
                <h4 className={`${bricolage.className} text-[22px] max-sm:text-[19px] font-semibold tracking-[-.03em] m-0`}>
                    Finally, a diet plan that fits
                </h4>
                <p className="text-[15px] max-sm:text-[14px] text-[#5B665F]">
                    It fits my lifestyle. The recipe swaps alone are worth it. Highly recommend!
                </p>
                <div className="flex items-center gap-[10px] mt-auto text-[14px] ">
                    <span className="w-[36px] h-[36px] rounded-[50%] grid  bg-[#F1DB9C] font-semibold text-[13px] text-[#2A2A20] place-items-center">
                        HM
                    </span>
                    <div>
                        Hamza M.
                        <small className="block text-[12px] text-[#8E978F]">Verified user</small>
                    </div>
                </div>
            </article>
            {/* article 4 */}
            <article className="w-[340px] max-sm:w-[270px] flex-none rounded-[28px] max-sm:rounded-[22px] p-[26px] max-sm:p-[20px] bg-[#ffffffd1] border border-[#1d2a2214] flex flex-col gap-[14px] max-sm:gap-[12px] shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)]">
                <div className="text-[#f4a07e] tracking-[3px] text-[14px]">★★★★★</div>
                <h4 className={`${bricolage.className} text-[22px] max-sm:text-[19px] font-semibold tracking-[-.03em] m-0`}>
                    Cooking is fun again
                </h4>
                <p className="text-[15px] max-sm:text-[14px] text-[#5B665F]">
                    The step-by-step videos and timers mean I never burn dinner anymore.
                </p>
                <div className="flex items-center gap-[10px] mt-auto text-[14px] ">
                    <span className="w-[36px] h-[36px] rounded-[50%] grid  bg-[#F8DCC8] font-semibold text-[13px] text-[#2A2A20] place-items-center">
                        AK
                    </span>
                    <div>
                        Ayesha K.
                        <small className="block text-[12px] text-[#8E978F]">Verified user</small>
                    </div>
                </div>
            </article>
            {/* article 5 */}
            <article className="w-[340px] max-sm:w-[270px] flex-none rounded-[28px] max-sm:rounded-[22px] p-[26px] max-sm:p-[20px] bg-[#ffffffd1] border border-[#1d2a2214] flex flex-col gap-[14px] max-sm:gap-[12px] shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)]">
                <div className="text-[#f4a07e] tracking-[3px] text-[14px]">★★★★★</div>
                <h4 className={`${bricolage.className} text-[22px] max-sm:text-[19px] font-semibold tracking-[-.03em] m-0`}>
                    I've felt better!
                </h4>
                <p className="text-[15px] max-sm:text-[14px] text-[#5B665F]">
                    The meal plans are easy to follow and actually delicious.
                </p>
                <div className="flex items-center gap-[10px] mt-auto text-[14px] ">
                    <span className="w-[36px] h-[36px] rounded-[50%] grid  bg-[#DDE8CC] font-semibold text-[13px] text-[#2A2A20] place-items-center">
                        UR
                    </span>
                    <div>
                        Usman R.
                        <small className="block text-[12px] text-[#8E978F]">Verified user</small>
                    </div>
                </div>
            </article>
            {/* article 6 */}
            <article className="w-[340px] max-sm:w-[270px] flex-none rounded-[28px] max-sm:rounded-[22px] p-[26px] max-sm:p-[20px] bg-[#ffffffd1] border border-[#1d2a2214] flex flex-col gap-[14px] max-sm:gap-[12px] shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)]">
                <div className="text-[#f4a07e] tracking-[3px] text-[14px]">★★★★★</div>
                <h4 className={`${bricolage.className} text-[22px] max-sm:text-[19px] font-semibold tracking-[-.03em] m-0`}>
                    Lost 8 kg in 3 months
                </h4>
                <p className="text-[15px] max-sm:text-[14px] text-[#5B665F]">
                    And I feel more energetic than ever. No more guessing what to cook.
                </p>
                <div className="flex items-center gap-[10px] mt-auto text-[14px] ">
                    <span className="w-[36px] h-[36px] rounded-[50%] grid  bg-[#F1C9BA] font-semibold text-[13px] text-[#2A2A20] place-items-center">
                        SA
                    </span>
                    <div>
                        Sana A.
                        <small className="block text-[12px] text-[#8E978F]">Verified user</small>
                    </div>
                </div>
            </article>
            {/* article 7 */}
            <article className="w-[340px] max-sm:w-[270px] flex-none rounded-[28px] max-sm:rounded-[22px] p-[26px] max-sm:p-[20px] bg-[#ffffffd1] border border-[#1d2a2214] flex flex-col gap-[14px] max-sm:gap-[12px] shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)]">
                <div className="text-[#f4a07e] tracking-[3px] text-[14px]">★★★★★</div>
                <h4 className={`${bricolage.className} text-[22px] max-sm:text-[19px] font-semibold tracking-[-.03em] m-0`}>
                    Finally, a diet plan that fits
                </h4>
                <p className="text-[15px] max-sm:text-[14px] text-[#5B665F]">
                    It fits my lifestyle. The recipe swaps alone are worth it. Highly recommend!
                </p>
                <div className="flex items-center gap-[10px] mt-auto text-[14px] ">
                    <span className="w-[36px] h-[36px] rounded-[50%] grid  bg-[#F1DB9C] font-semibold text-[13px] text-[#2A2A20] place-items-center">
                        HM
                    </span>
                    <div>
                        Hamza M.
                        <small className="block text-[12px] text-[#8E978F]">Verified user</small>
                    </div>
                </div>
            </article>
            {/* article 8 */}
            <article className="w-[340px] max-sm:w-[270px] flex-none rounded-[28px] max-sm:rounded-[22px] p-[26px] max-sm:p-[20px] bg-[#ffffffd1] border border-[#1d2a2214] flex flex-col gap-[14px] max-sm:gap-[12px] shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)]">
                <div className="text-[#f4a07e] tracking-[3px] text-[14px]">★★★★★</div>
                <h4 className={`${bricolage.className} text-[22px] max-sm:text-[19px] font-semibold tracking-[-.03em] m-0`}>
                    Cooking is fun again
                </h4>
                <p className="text-[15px] max-sm:text-[14px] text-[#5B665F]">
                    The step-by-step videos and timers mean I never burn dinner anymore.
                </p>
                <div className="flex items-center gap-[10px] mt-auto text-[14px] ">
                    <span className="w-[36px] h-[36px] rounded-[50%] grid  bg-[#F8DCC8] font-semibold text-[13px] text-[#2A2A20] place-items-center">
                        AK
                    </span>
                    <div>
                        Ayesha K.
                        <small className="block text-[12px] text-[#8E978F]">Verified user</small>
                    </div>
                </div>
            </article>
           
        </div>
      </div>

    </section>
  );
}