"use client";

import { useState } from "react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import {
  Bell,
  ChevronRight,
  Link as LinkIcon,
  Lock,
  Target,
  User2,
  type LucideIcon,
} from "lucide-react";
import { useProfile } from "./ProfileContext";
import ChangePasswordDialog from "./ChangePasswordDialog";
import NotificationsDialog from "./NotificationsDialog";
import { useNotifications } from "../dashboard/notificationsStore";
import { ONBOARDING_STEPS } from "../dashboard/onboarding";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const rowCls =
  "flex items-center gap-3 py-[12px] px-[4px] border-b border-[#1d2a2214] text-sm w-full text-left cursor-pointer hover:bg-[#F8FAF8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]";

function RowInner({
  Icon,
  label,
  hint,
}: {
  Icon: LucideIcon;
  label: string;
  hint?: string;
}) {
  return (
    <>
      <span className="w-[34px] h-[34px] rounded-[11px] bg-[#F2F5F2] grid place-items-center">
        <Icon size={15} />
      </span>
      {label}
      <span className="ml-auto flex items-center gap-2 text-[#8e978f] text-[12.5px]">
        {hint}
        <ChevronRight size={15} />
      </span>
    </>
  );
}

// "Data & connected devices" wale card tak smooth scroll
function goToDevices() {
  const el = document.getElementById("connected-devices");
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  el.focus({ preventScroll: true });

  // Thodi der ek hara ring, taaki dikhe kaunsa card hai
  el.classList.add("ring-2", "ring-[#4E9E5C]");
  window.setTimeout(() => el.classList.remove("ring-2", "ring-[#4E9E5C]"), 1600);
}

export default function AccountSettings() {
  const { openEdit } = useProfile();
  const { unread } = useNotifications();
  const [pwOpen, setPwOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
      <div className="flex items-center gap-[10px] mb-[16px]">
        <h3
          className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
        >
          Account settings
        </h3>
      </div>

      <button type="button" onClick={openEdit} aria-haspopup="dialog" className={rowCls}>
        <RowInner Icon={User2} label="Personal information" />
      </button>

      <Link href={ONBOARDING_STEPS[1].href} className={rowCls}>
        <RowInner Icon={Target} label="Goals & preferences" />
      </Link>

      <button
        type="button"
        onClick={() => setNotifOpen(true)}
        aria-haspopup="dialog"
        className={rowCls}
      >
        <RowInner Icon={Bell} label="Notifications" hint={unread > 0 ? `${unread} new` : undefined} />
      </button>

      <button
        type="button"
        onClick={() => setPwOpen(true)}
        aria-haspopup="dialog"
        className={rowCls}
      >
        <RowInner Icon={Lock} label="Privacy & security" hint="Change password" />
      </button>

      <button type="button" onClick={goToDevices} className={rowCls}>
        <RowInner Icon={LinkIcon} label="Connected apps" />
      </button>

      <ChangePasswordDialog open={pwOpen} onClose={() => setPwOpen(false)} />
      <NotificationsDialog open={notifOpen} onClose={() => setNotifOpen(false)} />
    </article>
  );
}