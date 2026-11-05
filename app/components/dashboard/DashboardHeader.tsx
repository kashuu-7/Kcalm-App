"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import NotificationList from "./NotificationList";
import { refreshNotifications, useNotifications } from "./notificationsStore";
import { initials, useProfile } from "../profile/ProfileContext";
import { Bricolage_Grotesque } from "next/font/google";
import { useHelp } from "./HelpContext";
import { ONBOARDING_STEPS } from "./onboarding";
import ThemeToggle from "../theme/ThemeToggle";

import SearchPalette from "./SearchPalette";
import {
  Bell,
  ChevronDown,
  User,
  Target,
  CircleHelp,
  LogOut,
} from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

// Har page ki heading aur description (yahan se text badal sakte ho)
const PAGES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Here's your day at a glance.",
  },
  "/daily-plan": {
    title: "Your Daily Plan",
    subtitle:
      "A balanced plan tailored to your goals. Eat well, feel your best.",
  },
  "/recipe-player": {
    title: "Cook with Confidence",
    subtitle:
      "Follow your personalized recipe step by step with guided instructions.",
  },
  "/smart-grocery": {
    title: "Smart Grocery",
    subtitle: "Your weekly ingredients, organized and ready to shop.",
  },
  "/insights": {
    title: "Insights",
    subtitle:
      "Track your progress, understand your habits and stay on top of your goals.",
  },
  "/profile": {
    title: "Profile",
    subtitle: "Manage your account, preferences and personal information.",
  },
};

// Server par -1 (neutral "Hello"), browser mein asli ghanta, bina hydration mismatch ke
const noopSubscribe = () => () => {};
const getHour = () => new Date().getHours();
const getServerHour = () => -1;

export default function DashboardHeader() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { unread } = useNotifications();

  // Login par (aur account badalne par) notifications lao
  useEffect(() => {
    if (user?.email) void refreshNotifications(user.email);
  }, [user?.email]);

  const toggleNotifications = () => {
    if (!showNotifications && user?.email)
      void refreshNotifications(user.email);
    setShowNotifications((p) => !p);
  };

  const { profile } = useProfile();
  const { openHelp } = useHelp();
  const hour = useSyncExternalStore(noopSubscribe, getHour, getServerHour);
  const firstName = profile.name.trim().split(/\s+/)[0] || "there";
  const greet =
    hour < 0
      ? "Hello"
      : hour < 12
        ? "Good morning"
        : hour < 17
          ? "Good afternoon"
          : "Good evening";

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Dono dropdown ke wrappers, taake bahar ka click pehchana ja sake
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Box ke bahar kahin bhi click karo to notification / profile box band ho jaye
  useEffect(() => {
    if (!showNotifications && !showProfileMenu) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (showNotifications && !notifRef.current?.contains(target)) {
        setShowNotifications(false);
      }
      if (showProfileMenu && !profileRef.current?.contains(target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [showNotifications, showProfileMenu]);

  // Current route se page dhundo (nested route ho to bhi chalega)
  const key =
    Object.keys(PAGES).find(
      (path) => pathname === path || pathname.startsWith(path + "/"),
    ) ?? "/dashboard";
  const page = PAGES[key];

  const subtitle =
    key === "/dashboard"
      ? `${greet}, ${firstName}. Here's your day at a glance.`
      : page.subtitle;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-[14px] pt-[18px] pb-[16px] px-0 bg-[linear-gradient(#f8faf8_70%,transparent)] max-[600px]:flex-wrap">
      <div className="max-sm:flex-1 max-sm:min-w-0">
        <h1
          id="pgTitile"
          className={`${bricolage.className} text-[clamp(24px,2.6vw,30px)] font-semibold tracking-[-0.03em] leading-[1.1] m-0 text-balance`}
        >
          {page.title}
        </h1>
        <p
          id="pgSub"
          className="text-[#8E978F] text-[13.5px] mt-[3px] max-sm:text-[12.5px] max-sm:truncate"
        >
          {subtitle}
        </p>
      </div>
      <div className="flex items-center gap-[10px] ml-auto max-[600px]:w-full max-[600px]:ml-0">
        <SearchPalette />
        <ThemeToggle />
        <div ref={notifRef} className="relative max-sm:static">
          <button
            type="button"
            aria-label={
              unread > 0 ? `Notifications, ${unread} unread` : "Notifications"
            }
            aria-expanded={showNotifications}
            onClick={toggleNotifications}
            className="relative grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border border-[#1d2a2214] bg-white shadow-[var(--shadow)] transition-colors duration-200 hover:bg-[#E9F6EC]"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-[9px] top-[8px] h-[6px] w-[6px] rounded-full bg-[#F4A07E]"
              />
            )}
          </button>

          {showNotifications && (
            <div className="w-[330px] max-sm:w-auto max-sm:fixed max-sm:left-[16px] max-sm:right-[16px] max-sm:top-[72px] absolute right-0 top-[calc(100%_+_8px)] bg-white border border-[#1d2a2214] rounded-[18px] shadow-[var(--shadow-lg)] p-2 min-w-[240px] max-h-[70dvh] overflow-y-auto z-[60] origin-top-right animate-[popin_.25s_var(--ease)]">
              <NotificationList />
            </div>
          )}
        </div>
        <div ref={profileRef} className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu((prev) => !prev)}
            className="flex items-center gap-[10px] bg-white border border-[#1d2a2214] rounded-full py-[5px] pr-[14px] pl-[5px] max-sm:pr-[5px] shadow-[var(--shadow)] font-medium text-sm"
          >
            <span className="w-[34px] h-[34px] rounded-full bg-[linear-gradient(135deg,#F7C9B4,#CFE9C8)] grid place-items-center font-semibold text-[13px] text-[#1d2a22] flex-none">
              {initials(profile.name)}
            </span>

            <span className="block max-[940px]:hidden">{profile.name}</span>
            <ChevronDown size={12} className="text-[#8E978F]" />
          </button>

          {showProfileMenu && (
            <div>
              <div className="absolute right-0 top-[calc(100%_+_8px)] bg-white border border-[#1d2a2214] rounded-[18px] shadow-[var(--shadow-lg)] p-2 min-w-[240px] z-[60] origin-top-right animate-[popin_.25s_var(--ease)]">
                <div className="flex gap-[10px] items-center pt-[8px] px-[10px] pb-[12px] border-b border-[#1d2a2214] mb-[6px]">
                  <span className="w-[34px] h-[34px] rounded-full bg-[linear-gradient(135deg,#F7C9B4,#CFE9C8)] grid place-items-center font-semibold text-[13px] text-[#1d2a22] flex-none">
                    {initials(profile.name)}
                  </span>

                  <div className="text-[13.5px]">
                    <b>{profile.name}</b>
                    <div className="text-[12px] text-[#8E978F]">
                      {profile.email}
                    </div>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-[10px] w-full py-[10px] px-[12px] rounded-[10px] text-[14px] text-left hover:bg-[#F7F9F7]"
                >
                  <User size={16} />
                  Profile
                </Link>

                <Link
                  href={ONBOARDING_STEPS[1].href}
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-[10px] w-full py-[10px] px-[12px] rounded-[10px] text-[14px] text-left hover:bg-[#F7F9F7]"
                >
                  <Target size={16} />
                  Recalibrate targets
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    openHelp();
                  }}
                  className="flex items-center gap-[10px] w-full py-[10px] px-[12px] rounded-[10px] text-[14px] text-left hover:bg-[#F7F9F7]"
                >
                  <CircleHelp size={16} />
                  Help &amp; shortcuts
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    setShowProfileMenu(false);
                    await signOut();
                    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- hard reload zaroori hai (stores reset)
                    window.location.assign("/login");
                  }}
                  className="flex items-center gap-[10px] w-full py-[10px] px-[12px] rounded-[10px] text-[14px] text-left hover:bg-[#F7F9F7]"
                >
                  <LogOut size={16} />
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}