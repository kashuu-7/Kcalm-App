"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import NotificationList from "../dashboard/NotificationList";
import { refreshNotifications } from "../dashboard/notificationsStore";

export default function NotificationsDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { user } = useAuth();
  const email = user?.email;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      if (email) void refreshNotifications(email);
    } else if (!open && d.open) {
      d.close();
    }
  }, [open, email]);

  return (
    <dialog
      ref={ref}
      aria-label="Notifications"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[min(460px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] overflow-auto rounded-[24px] border border-[#1d2a2214] bg-white p-0 text-[#1D2A22] shadow-[0_30px_60px_-20px_rgba(29,42,34,0.4)] backdrop:bg-[#1d2a22]/35 backdrop:backdrop-blur-[3px]"
    >
      <div className="p-[12px]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-[14px] top-[14px] grid h-[32px] w-[32px] cursor-pointer place-items-center rounded-full border border-[#1d2a2224] bg-white transition-colors duration-200 hover:bg-[#F2F5F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
        >
          <X size={14} />
        </button>
        <div className="pr-[40px]">
          <NotificationList />
        </div>
      </div>
    </dialog>
  );
}