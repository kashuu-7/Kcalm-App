"use client";

import Link from "next/link";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import { usePathname } from "next/navigation";
import { useAuth } from "../auth/AuthContext";
import {
  Home,
  CalendarDays,
  Play,
  ShoppingCart,
  LogOut,
  UserRound,
  BarChart3,
  Check,
  Lock,
} from "lucide-react";
import Help from "./Help";
import { useGrocery } from "../../components/smart-grocery/groceryStore";
import {
  ONBOARDING_STEPS,
  isOnboardingPath,
  onboardingStepIndex,
} from "./onboarding";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const menuItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Daily Plan",
    href: "/daily-plan",
    icon: CalendarDays,
  },
  {
    name: "Recipe Player",
    href: "/recipe-player",
    icon: Play,
  },
  {
    name: "Smart Grocery",
    href: "/smart-grocery",
    icon: ShoppingCart,
  },
  {
    name: "Insights",
    href: "/insights",
    icon: BarChart3,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: UserRound,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { remaining } = useGrocery();
const { signOut } = useAuth();

const logout = async () => {
  await signOut();
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign("/login");
};

  // Calibration pages par sidebar onboarding wali shakal le leta hai
  const onboarding = isOnboardingPath(pathname);
  const step = onboardingStepIndex(pathname);
  const stepCount = ONBOARDING_STEPS.length;
  const percent = Math.round(((step + 1) / stepCount) * 100);
  

  return (
    <aside className="sticky top-0 h-screen bg-white border-r border-[#1d2a2214] py-[22px] px-4 flex flex-col gap-[6px]">
      {/* Logo */}{" "}
      <Link href="/dashboard" className={`${bricolage.className} flex  text-[#1d2a22] text-[22px] gap-[9px] pt-[4px] px-[10px] pb-[22px] font-[700] tracking-[-.05em] items-center`}>
        <i className="w-[22px] h-[22px] rounded-full bg-[conic-gradient(from_200deg,#5FAE6E,#F4A07E,#E9D98A,#5FAE6E)]"></i>
        Kcalm
      </Link>

      {onboarding ? (
        <>
          {/* Onboarding steps */}
          <nav aria-label="Onboarding steps" className="grid gap-[6px]">
            <span className="px-[10px] pb-[6px] text-[10px] tracking-[.08em] uppercase text-[#8E978F]">
              Onboarding flow
            </span>

            {ONBOARDING_STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;

              const content = (
                <>
                  <span
                    className={`w-[28px] h-[28px] rounded-full border-[1.5px] grid place-items-center text-[10px] font-[600] flex-none transition-colors ${
                      active
                        ? "bg-[#4E9E5C] border-[#4E9E5C] text-white"
                        : done
                          ? "bg-[#E9F6EC] border-[#4E9E5C] text-[#2E6B3E]"
                          : "border-[#1d2a2224] text-[#8E978F]"
                    }`}
                  >
                    {done ? (
                      <Check size={13} />
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </span>
                  <span className="min-w-0">
                    <b className="block text-[13px] font-[500] text-[#1D2A22]">
                      {s.title}
                    </b>
                    <small className="block text-[11.5px] text-[#8E978F]">
                      {active ? s.desc : done ? "Done" : "Pending"}
                    </small>
                  </span>
                </>
              );

              const base =
                "flex items-center gap-[12px] rounded-[14px] py-[10px] px-[11px] transition-colors duration-200";

              // Poore ho chuke steps par wapas ja sakte ho, aage wale steps skip nahi ho sakte
              return done ? (
                <Link
                  key={s.id}
                  href={s.href}
                  className={`${base} hover:bg-[#F5F7F5]`}
                >
                  {content}
                </Link>
              ) : (
                <Link
                  key={s.id}
                  href={s.href}
                  aria-current={active ? "step" : undefined}
                  className={`${base} ${active ? "bg-[#E9F6EC]" : ""}`}
                >
                  {content}
                </Link>
              );
            })}
          </nav>

          {/* Progress + privacy note */}
          <div className="mt-auto grid gap-[10px]">
            <div className="rounded-[14px] border border-[#1d2a2214] bg-[#F8FAF8] p-[12px]">
              <div className="flex justify-between text-[11.5px] text-[#5B665F]">
                <span>Overall progress</span>
                <b className="text-[#2E6B3E] tabular-nums">{percent}%</b>
              </div>
              <div className="h-[4px] rounded-full bg-[#1d2a2214] overflow-hidden mt-[8px]">
                <i
                  className="block h-full rounded-full bg-[#4E9E5C] transition-[width] duration-[600ms] ease-[var(--ease)]"
                  style={{ width: `${percent}%` }}
                ></i>
              </div>
              <p className="mt-[8px] text-[10.5px] text-[#8E978F]">
                Step {step + 1} of {stepCount} · about {stepCount - step} min
                left
              </p>
            </div>

            <p className="flex items-start gap-[8px] px-[4px] text-[11px] leading-[1.4] text-[#8E978F]">
              <Lock size={12} className="mt-[2px] shrink-0" />
              Your health details are encrypted and never sold.
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Navigation */}
          <nav >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              // Grocery ke baaki bache items ka live count (0 ho to badge nahi)
              const badge =
                item.href === "/smart-grocery" && remaining > 0
                  ? String(remaining)
                  : null;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.name}
                  className={`relative flex min-h-[42px] items-center gap-[11px] rounded-[13px] px-[11px] text-[13px] transition-colors duration-200 ${
                    isActive
                      ? "bg-[#E9F6EC] font-medium text-[#2E6B3E] before:absolute before:left-[-13px] before:top-[13px] before:h-[16px] before:w-[3px] before:rounded-r-full before:bg-[#4E9E5C]"
                      : "text-[#5B665F] hover:bg-[#F5F7F5] hover:text-[#1D2A22]"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />

                  <span className="flex-1 max-md:hidden">{item.name}</span>

                  {badge && (
                    <span className="rounded-full bg-[#FFEFE7] px-[6px] py-[2px] text-[10px] text-[#B75D3B] max-md:hidden">
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          {/* Bottom calibration card */}
          <div className="mt-auto rounded-[18px] p-4 bg-[linear-gradient(150deg,#e9f6ec,#f0edfd)] text-[13px]">
            <b className={`${bricolage.className} mb-[4px] block text-[16px] tracking-[-.02em]`}>
                Recalibrate targets
            </b>

            <p className="mb-[12px] text-[#5B665F]">
              Weight or routine changed? Update your numbers in two minutes.
            </p>

            <Link
              href={ONBOARDING_STEPS[0].href}
              className="rounded-full bg-[#2E6B3E] px-[13px] py-[7px] text-[13px] text-[#FFFFFF] shadow-[0_10px_24px_-12px_rgba(46,107,62,.6)] inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[transform,box-shadow,background] duration-[250ms] ease-[var(--ease)] whitespace-nowrap hover:-translate-y-[1px]"
            >
              Start calibration
            </Link>
          </div>
          <div className="flex flex-col gap-[2px] pt-[10px] border-t border-[#1d2a2214] mt-[12px]">
            <Help />
            <button
  type="button"
  onClick={logout}
  className="flex w-full items-center gap-[12px] rounded-[12px] px-[12px] py-[9px] text-left text-[14px] text-[#5B665F] cursor-pointer hover:text-[#1D2A22]"
>
  <LogOut size={18} />
  Log out
</button>
          </div>
        </>
      )}
    </aside>
  );
}