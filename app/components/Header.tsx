"use client";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "./auth/AuthContext";

const LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#the-app", label: "The app" },
  { href: "#diets", label: "Diets" },
  { href: "#stories", label: "Stories" },
  { href: "#pricing", label: "Pricing" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { status } = useAuth();
  const loggedIn = status === "authenticated";

  return (
    <header className="sticky top-[10px] md:top-[14px] z-50 mt-[10px] md:mt-[14px]">
      <div className="relative">
        {/* Main pill */}
        <div className="flex items-center gap-[10px] md:gap-[20px] py-[8px] md:py-[10px] pr-[8px] md:pr-[10px] pl-[16px] md:pl-[22px] rounded-full bg-white/80 border border-[#1d2a2214] backdrop-blur-[18px] backdrop-saturate-[1.4] shadow-[0_1px_2px_rgba(29,42,34,0.04),0_18px_40px_-22px_rgba(29,42,34,0.16)]">
          <Link
            href="/"
            className="font-[700] text-[20px] md:text-[22px] flex items-center gap-[8px] tracking-tighter"
          >
            <i className="w-[20px] h-[20px] md:w-[22px] md:h-[22px] rounded-full inline-block bg-[conic-gradient(from_200deg,var(--matcha),var(--butter),var(--apricot),var(--matcha))] animate-[spin_8s_linear_infinite]"></i>
            Kcalm
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-[4px] ml-auto">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[#5B665F] py-[8px] px-[10px] lg:px-[14px] rounded-full text-[14px] hover:text-[#1D2A22] hover:bg-[rgba(29,42,34,0.08)] transition-[background,color] duration-250"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop log in */}
          <Link
            href={loggedIn ? "/dashboard" : "/login"}
            className="hidden md:block text-[#5B665F] text-[14px] hover:text-[#1D2A22] transition-colors"
          >
            {loggedIn ? "Login" : "Log in"}
          </Link>

          {/* CTA (mobile pe ml-auto se right pe jata hai) */}
          <Link
            href={loggedIn ? "/dashboard" : "/signup"}
            className="group ml-auto md:ml-0 py-[8px] md:py-[10px] pr-[8px] md:pr-[12px] pl-[14px] md:pl-[18px] text-[13px] md:text-[14px] bg-[#2E6B3E] text-[#ffffff] shadow-[0_10px_26px_-12px_rgba(46,107,62,0.55)] inline-flex items-center gap-[8px] md:gap-[10px] rounded-full font-[500] whitespace-nowrap transition-[transform,box-shadow,background] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] hover:shadow-[0_16px_34px_-12px_rgba(46,107,62,0.6)]"
          >
            <span className="hidden min-[400px]:inline">
              {loggedIn ? "Open dashboard" : "Get started free"}
            </span>
            <span className="min-[400px]:hidden">
              {loggedIn ? "Dashboard" : "Get started"}
            </span>
            <span className="w-[24px] h-[24px] md:w-[26px] md:h-[26px] rounded-full bg-[#FFEFE7] text-[#1D2A22] grid place-items-center transition-transform duration-350 group-hover:rotate-[-45deg]">
              →
            </span>
          </Link>

          {/* Hamburger (sirf mobile) */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="hidden md:hidden w-[40px] h-[40px] rounded-full grid place-items-center text-[#1D2A22] bg-[rgba(29,42,34,0.06)] hover:bg-[rgba(29,42,34,0.1)] transition-colors flex-none"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <div
          className={` md:hidden absolute left-0 right-0 top-[calc(100%+8px)] origin-top rounded-[28px] bg-white/95 border border-[#1d2a2214] backdrop-blur-[18px] shadow-[0_1px_2px_rgba(29,42,34,0.04),0_24px_48px_-20px_rgba(29,42,34,0.22)] p-[10px] transition-[opacity,transform] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${
            open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-[8px] pointer-events-none"
          }`}
        >
          <nav className="flex flex-col">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-[#1D2A22] py-[13px] px-[16px] rounded-[18px] text-[16px] hover:bg-[rgba(29,42,34,0.06)] transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="h-px bg-[#1d2a2214] my-[6px] mx-[16px]" />
            <Link
              href={loggedIn ? "/dashboard" : "/login"}
              onClick={() => setOpen(false)}
              className="text-[#5B665F] py-[13px] px-[16px] rounded-[18px] text-[16px] hover:bg-[rgba(29,42,34,0.06)] transition-colors"
            >
              {loggedIn ? "Dashboard" : "Log in"}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
