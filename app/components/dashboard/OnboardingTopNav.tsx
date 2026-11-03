"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { userKey } from "../../lib/userStorage";
import {
  ONBOARDING_STEPS,
  isOnboardingPath,
  onboardingStepIndex,
} from "./onboarding";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Step 1 aur step 2 ka saved data. Step 3 ka koi data nahi, wo aakhri hai.
const STEP_KEYS = ["kcalm-calibration", "kcalm-about"];

// "10", "11" jaisa string: kaunse steps ka data save hai
function useSavedSteps() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("storage", cb);
      return () => window.removeEventListener("storage", cb);
    },
    () =>
      STEP_KEYS.map((k) => {
        try {
          return localStorage.getItem(userKey(k)) ? "1" : "0";
        } catch {
          return "0";
        }
      }).join(""),
    () => "", // server par kuch save nahi maano
  );
}

export default function OnboardingTopNav() {
  const pathname = usePathname();
  const saved = useSavedSteps();

  // Sirf calibration pages par dikhao
  if (!isOnboardingPath(pathname)) return null;

  const step = onboardingStepIndex(pathname);

  // Step i tab khulta hai jab uske pehle ke saare steps ka data save ho
  const reachable = (i: number) =>
    i <= step || STEP_KEYS.slice(0, i).every((_, k) => saved[k] === "1");

  return (
    // Sirf 940px se chhoti screen par (jahan sidebar hide hoti hai)
    <div className="hidden max-[940px]:flex static h-auto flex-row flex-wrap items-center gap-[10px] bg-white border-r border-[#1d2a2214] py-[22px] px-[18px]">
      {/* Logo */}
      <Link
        href="/dashboard"
        className={`${bricolage.className} inline-flex items-center gap-[9px] pt-[4px] px-[10px] pb-[22px] text-[22px] font-[700] tracking-[-.05em] text-[#1d2a22]`}
      >
        <i className="h-[22px] w-[22px] rounded-full bg-[conic-gradient(from_200deg,#5FAE6E,#F4A07E,#E9D98A,#5FAE6E)]" />
        Kcalm
      </Link>

      {/* Steps */}
      <nav
        aria-label="Onboarding steps"
        className="max-w-full flex-[1_1_100%] relative overflow-x-auto"
      >
        <ol className="m-0 flex list-none gap-[6px] p-0">
          {ONBOARDING_STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            const clickable = !active && reachable(i);

            const content = (
              <>
                <span
                  className={`grid h-[30px] w-[30px] flex-none place-items-center rounded-full border-[1.5px] text-[10px] font-[600] transition-colors ${
                    active
                      ? "border-[#4E9E5C] bg-[#4E9E5C] text-white"
                      : done
                        ? "border-[#4E9E5C] text-[#2E6B3E] bg-[#E9F6EC]"
                        : "border-[#1d2a2224]"
                  }`}
                >
                  {done ? (
                    <Check size={13} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <span
                  className={`whitespace-nowrap text-[14px] font-[600] ${
                    active ? "text-[#1D2A22]" : ""
                  }`}
                >
                  {s.title}
                </span>
              </>
            );

            const base = `flex items-center gap-[12px] rounded-[16px] p-[12px] transition-colors duration-200 ${
              active ? "bg-[#E9F6EC]" : ""
            }`;

            return (
              <li key={s.id} className="flex-none">
                {clickable ? (
                  <Link
                    href={s.href}
                    className={`${base} hover:bg-[#F5F7F5] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#4E9E5C]`}
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    aria-current={active ? "step" : undefined}
                    className={`${base} ${active ? "" : "opacity-60"}`}
                  >
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}