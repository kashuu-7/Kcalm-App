"use client";

import { useState } from "react";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import { Smartphone } from "lucide-react";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function Download() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  return (
    <section className="pt-0 py-[clamp(72px,10vw,128px)]">
      <div className="grid grid-cols-[1.1fr_.9fr] max-[940px]:grid-cols-1 gap-[32px] max-sm:gap-[24px] items-center rounded-[40px] max-sm:rounded-[28px] p-[clamp(32px,5vw,64px)] max-sm:p-[24px] bg-[radial-gradient(70%_90%_at_100%_0%,#f0edfd,transparent_70%),radial-gradient(60%_80%_at_0%_100%,#e7f3fc,transparent_70%),#fafbfa] border border-[#1d2a2214] overflow-hidden transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-0">
        <div>
          <span className="block mb-[14px] text-[12px] tracking-[.08em] uppercase text-[#8E978F]">
            Coming to your phone
          </span>
          <h2
            className={`${bricolage.className} text-[clamp(34px,5vw,60px)] font-semibold tracking-[-0.035em] leading-[1.02] m-0 text-balance`}
          >
            Take Kcalm
            <span className={`${serif.className} tracking-[-.01em] `}>
              {" "}
              everywhere.
            </span>
          </h2>
          <p className="text-[#5B665F] max-w-[620px] text-[clamp(16px,1.4vw,18px)] mt-[18px]">
            The iPhone and Android apps are in beta. Join the waitlist and we'll
            send your invite as soon as a spot opens.
          </p>
          <div className="flex flex-wrap gap-[12px] max-sm:gap-[10px] mt-[28px] ">
            <div className="flex items-center gap-[12px] py-[11px] pr-[20px] pl-[14px] rounded-[16px] bg-white border border-[#1d2a2224] shadow-[var(--shadow)]">
              <Smartphone className="w-[22px] h-[22px]" />
              <div>
                <small className="block text-[11px] text-[#8E978F] leading-[1.1] ">
                  Coming soon for
                </small>
                <b
                  className={`${bricolage.className} text-[17px] tracking-[-.02em] leading-[1.1]`}
                >
                  iPhone
                </b>
              </div>
            </div>
            <div className="flex items-center gap-[12px] py-[11px] pr-[20px] pl-[14px] rounded-[16px] bg-white border border-[#1d2a2224] shadow-[var(--shadow)]">
              <Smartphone className="w-[22px] h-[22px]" />
              <div>
                <small className="block text-[11px] text-[#8E978F] leading-[1.1] ">
                  Coming soon for
                </small>
                <b
                  className={`${bricolage.className} text-[17px] tracking-[-.02em] leading-[1.1]`}
                >
                  Android
                </b>
              </div>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              const form = e.currentTarget;
              const input = form.elements.namedItem(
                "email",
              ) as HTMLInputElement;

              if (!input.value || !input.validity.valid) {
                setMessage("Enter an email like name@example.com.");
                setIsError(true);
                return;
              }

              setMessage("Thanks! This is a preview, so nothing was sent yet.");
              setIsError(false);
            }}
            className="mt-[22px] flex flex-wrap gap-[8px] max-w-[440px]"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="flex-1 min-w-[200px] max-sm:min-w-0 max-sm:w-full py-[14px] px-[18px] rounded-full border-[2px] border-[#1d2a2224] bg-white font-[inherit] text-[#1d2a22] transition-[border-color] duration-300 focus:border-[#5fae6e] focus:outline-none"
            />
            <button className="group max-sm:w-full max-sm:justify-center py-[13px] px-[22px] text-[15px] bg-[#2E6B3E] text-[#ffffff] shadow-[0_10px_26px_-12px_rgba(46,107,62,0.55)] inline-flex items-center gap-[10px] rounded-full font-[500] transition-[transform,box-shadow,background] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[2px] hover:shadow-[0_16px_34px_-12px_rgba(46,107,62,0.6)]">
              Join waitlist
              <span className="w-[26px] h-[26px] rounded-full bg-[#FFEFE7] text-[#1D2A22] grid place-items-center transition-transform duration-350 group-hover:rotate-[-45deg]">
                →
              </span>
            </button>
          </form>
          <p
            className={`text-[14px] mt-[10px] leading-[1.4em] ${
              isError ? "text-red-500" : "text-[#2E6B3E]"
            }`}
          >
            {message}
          </p>
        </div>
        <div className="relative h-[340px] max-sm:h-[320px] max-[940px]:w-full max-[940px]:max-w-[520px] max-[940px]:mx-auto">
          <div className="top-[6%] left-[4%] flex gap-[12px] items-center w-[280px] max-sm:w-[86%] max-sm:max-w-[280px] text-[13px] absolute rounded-[22px] bg-white border border-[#1d2a2214] shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)] py-[16px] px-[18px] max-sm:py-[14px] max-sm:px-[14px] animate-[bob_7s_ease-in-out_infinite]">
            <span className="w-[38px] h-[38px] rounded-[11px] bg-[conic-gradient(from_200deg,var(--matcha),var(--butter),var(--apricot),var(--matcha))] flex-none"></span>
            <div>
              <b className={`${bricolage.className} block text-[14px] tracking-[-.01em]`}>
                Lunch is ready to cook
              </b>
              <small className="block text-[11px] text-[#8E978F] ">
                Lemon chickpea salad · 12 min
              </small>
            </div>
          </div>
          <div className="top-[38%] right-[2%] absolute rounded-[22px] bg-white border border-[#1d2a2214] shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)] py-[16px] px-[18px] max-sm:py-[14px] max-sm:px-[14px] animate-[bob_7s_ease-in-out_infinite] [animation-delay:-2s]">
              <small className="text-[12px] text-[#8E978F] tracking-[.08em] uppercase">
                Streak
              </small>
              <b className={`${bricolage.className} block text-[24px] max-sm:text-[21px] tracking-[-.04em]`}>
                12 days on plan
              </b>
          </div>
          <div className="bottom-[6%] left-[12%] max-sm:left-[4%] flex gap-[12px] items-center w-[280px] max-sm:w-[86%] max-sm:max-w-[280px] text-[13px] absolute rounded-[22px] bg-white border border-[#1d2a2214] shadow-[0_1px_2px_rgba(29,42,34,.04),0_18px_40px_-22px_rgba(29,42,34,.16)] py-[16px] px-[18px] max-sm:py-[14px] max-sm:px-[14px] animate-[bob_7s_ease-in-out_infinite] [animation-delay:-4s]">
            <span className="w-[38px] h-[38px] rounded-[11px] bg-[#E9F6EC] flex-none"></span>
            <div>
              <b className={`${bricolage.className} block text-[14px] tracking-[-.01em]`}>
                Protein goal hit
              </b>
              <small className="block text-[11px] text-[#8E978F] ">
                125 g of 125 g · nice work
              </small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}