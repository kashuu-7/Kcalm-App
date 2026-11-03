import React from 'react'
import { Bricolage_Grotesque, Instrument_Serif } from 'next/font/google'
import Canvas from '../Canvas'
import Link from "next/link";

const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

export default function CalmerWay() {
  return (
   <div className="transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] rounded-[40px] p-[clamp(40px,7vw,88px)] bg-[#e9f6ec] bg-[image:radial-gradient(60%_80%_at_10%_0%,#ffefe7,transparent_70%),radial-gradient(60%_80%_at_90%_100%,#f0edfd,transparent_70%)] text-[#1d2a22] relative overflow-hidden text-center">
      <Canvas count={40} />
      <span className="text-[#1d2a22] opacity-60 relative z-[1] text-[12px] tracking-[0.08em] uppercase">
        Real food. Real progress.
      </span>
      <h2 className={`${bricolage.className} mt-[16px] relative z-[1] text-[clamp(38px,5vw,60px)] max-w-[649px] m-auto font-semibold tracking-[-0.035em] leading-[1.02] text-balance`}>
        Your calmer way to eat{" "}
        <span className={`${serif.className} text-[#2E6B3E] tracking-[-.01em] `}>
            starts today.
        </span>
      </h2>
      <p className="relative z-[1] text-[#5B665F] max-w-[487px] mt-[20px] m-auto">
        Set your goal in two minutes. Your first week of meals is ready right after.
      </p>
      <Link href="/signup" className="group mt-[34px] relative z-[1] inline-flex items-center gap-[10px] py-[14px] px-[22px] rounded-[16px] bg-[#2E6B3E] text-[#ffffff] shadow-[0_10px_26px_-12px_rgba(46,107,62,0.55)] inline-flex items-center gap-[10px] rounded-full font-[500] transition-[transform,box-shadow,background] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:-translate-y-[2px] hover:shadow-[0_16px_34px_-12px_rgba(46,107,62,0.6)]">
        Get started free
        <span className="w-[26px] h-[26px] rounded-full bg-[#FFEFE7] text-[#1D2A22] grid place-items-center transition-transform duration-350 group-hover:rotate-[-45deg]">
            →
        </span>
      </Link>
    </div>
  )
}
