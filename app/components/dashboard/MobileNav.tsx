"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  Home,
  Play,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import { useGrocery } from "../smart-grocery/groceryStore";
import { isOnboardingPath } from "./onboarding";

const ITEMS = [
  { label: "Dashboard", href: "/dashboard", Icon: Home },
  { label: "Plan", href: "/daily-plan", Icon: CalendarDays },
  { label: "Player", href: "/recipe-player", Icon: Play },
  { label: "Grocery", href: "/smart-grocery", Icon: ShoppingCart },
  { label: "Insights", href: "/insights", Icon: BarChart3 },
  { label: "Profile", href: "/profile", Icon: UserRound },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { remaining } = useGrocery();

  // Calibration ke pages par apne Back / Continue buttons hain, wahan bar nahi chahiye
  if (isOnboardingPath(pathname)) return null;

  return (
    <nav
      aria-label="Main"
      className="hidden max-[980px]:flex fixed left-[12px] right-[12px] bottom-[calc(12px+env(safe-area-inset-bottom,0px))] z-50 bg-[#ffffffeb] backdrop-blur-[16px] border border-[#1d2a2214] rounded-[22px] shadow-[var(--shadow-lg)] p-[6px] justify-around"
    >
      {ITEMS.map(({ label, href, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        const badge =
          href === "/smart-grocery" && remaining > 0 ? remaining : null;

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`relative flex flex-col items-center gap-[3px] flex-1 rounded-[18px] px-[7px] py-[8px] text-[10.5px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#4E9E5C] ${
              active
                ? "bg-[#E9F6EC] font-medium text-[#2E6B3E]"
                : "text-[#5B665F] hover:bg-[#F5F7F5] hover:text-[#1D2A22]"
            }`}
          >
            <Icon size={20} />
            <span className="max-w-full truncate">{label}</span>
            {badge && (
              <span className="absolute right-[18%] top-[4px] rounded-full bg-[#FFEFE7] px-[5px] py-[1px] text-[9px] font-medium text-[#B75D3B]">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}