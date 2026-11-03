import React from 'react'
import { Bricolage_Grotesque, Instrument_Serif } from 'next/font/google'
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})


export default function Footer() {
  return (
    <footer className="pt-[48px] max-sm:pt-[36px] pb-[40px] max-sm:pb-[28px] overflow-hidden" >
      <div className="grid grid-cols-[1.5fr_1fr_1fr] max-[940px]:grid-cols-2 gap-8 max-sm:gap-x-[20px] max-sm:gap-y-[28px] pb-8 border-b border-[#1d2a2214]">
        <div className="max-[940px]:col-span-2">
            <a href="#" className={`${bricolage.className} block text-[#5b665f] text-[15px] p-0 font-bold tracking-[-.05em] items-center`}>
                <i className="w-[22px] h-[22px] rounded-full bg-[conic-gradient(from_200deg,var(--matcha),var(--butter),var(--apricot),var(--matcha))] inline-block animate-[spin_8s_linear_infinite]" ></i>
                Kcalm
            </a>
            <p className="text-[#5b665f] max-w-[358px] mt-[12px] text-[15px] ">
                Macro- and micro-precise meal planning with animated, done-in-minutes recipes.
            </p>
        </div>
        <div>
            <h5 className="mb-[12px] text-[11px] tracking-[.08em] uppercase text-[#8e978f]">Products</h5>
            <a href="#" className="block text-[#5b665f] text-[15px] py-[3px] px-0 ">How it works</a>
            <a href="#" className="block text-[#5b665f] text-[15px] py-[3px] px-0 ">Inside the app</a>
            <a href="#" className="block text-[#5b665f] text-[15px] py-[3px] px-0 ">Diets</a>
            <a href="#" className="block text-[#5b665f] text-[15px] py-[3px] px-0 ">Get the app</a>
            <a href="#" className="block text-[#5b665f] text-[15px] py-[3px] px-0 ">Pricing</a>
            <a href="#" className="block text-[#5b665f] text-[15px] py-[3px] px-0 ">FAQ</a>
        </div>
        <div>
            <h5 className="mb-[12px] text-[11px] tracking-[.08em] uppercase text-[#8e978f]">Company</h5>
            <a href="#" className="block text-[#5b665f] text-[15px] py-[3px] px-0 ">About</a>
            <a href="#" className="block text-[#5b665f] text-[15px] py-[3px] px-0 ">Contact</a>
        </div>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-[12px] pt-[24px] text-[#8E978F] text-[13px] ">
        <span>© 2026 Kcalm. All rights reserved.</span>
        <div className="flex gap-[8px]">
            <a href="#" className="w-[36px] h-[36px] rounded-[50%] border border-[#1d2a2224] grid place-items-center text-[#5b665f] transition-all duration-300">
                <FaInstagram className="w-[15px] h-[15px] text-[#5B665F] inline-block" />
            </a>
            <a href="#" className="w-[36px] h-[36px] rounded-[50%] border border-[#1d2a2224] grid place-items-center text-[#5b665f] transition-all duration-300">
                <FaYoutube className="w-[15px] h-[15px] text-[#5B665F] inline-block" />
            </a>
            <a href="#" className="w-[36px] h-[36px] rounded-[50%] border border-[#1d2a2224] grid place-items-center text-[#5b665f] transition-all duration-300">
                <FaTiktok className="w-[15px] h-[15px] text-[#5B665F] inline-block" />
            </a>
        </div>
      </div>
      <div className={`${bricolage.className} font-bold text-[clamp(80px,22vw,300px)] tracking-[-.07em] leading-[0.8] text-center mt-[36px] max-sm:mt-[28px] bg-[linear-gradient(180deg,#1d2a2224,transparent_85%)] bg-clip-text text-transparent select-none`}>
        Kcalm
      </div>
    </footer>
  )
}