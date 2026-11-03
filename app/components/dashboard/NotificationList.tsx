"use client";

import { Bell, Trophy } from "lucide-react";
import {
  markAllRead,
  markRead,
  retryNotifications,
  useNotifications,
} from "./notificationsStore";

function timeAgo(iso: string) {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NotificationList() {
  const { items, unread, status } = useNotifications();

  return (
    <div>
      <div className="flex items-center justify-between px-[10px] pb-[8px] pt-[6px]">
        <h3 className="flex items-center gap-[8px] text-[14px] font-semibold text-[#1D2A22]">
          Notifications
          {unread > 0 && (
            <span className="rounded-full bg-[#FFEFE7] px-[7px] py-[1px] text-[11px] font-medium text-[#B75D3B]">
              {unread} new
            </span>
          )}
        </h3>
        <button
          type="button"
          onClick={() => void markAllRead()}
          disabled={unread === 0}
          className="cursor-pointer text-[11px] font-medium text-[#2E6B3E] hover:underline disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
        >
          Mark all read
        </button>
      </div>

      {items.length === 0 ? (
        <div role="status" className="px-[12px] py-[22px] text-center text-[13px] text-[#8E978F]">
          {status === "loading" || status === "idle" ? (
            "Loading…"
          ) : status === "error" ? (
            <>
              Couldn&apos;t load notifications.{" "}
              <button
                type="button"
                onClick={retryNotifications}
                className="cursor-pointer font-medium text-[#2E6B3E] hover:underline"
              >
                Try again
              </button>
            </>
          ) : (
            "You're all caught up. New achievements will show up here."
          )}
        </div>
      ) : (
        <ul className="m-0 list-none p-0">
          {items.map((n) => {
            const Icon = n.kind.includes("achievement") ? Trophy : Bell;
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => void markRead(n.id)}
                  className={`flex w-full cursor-pointer gap-[12px] rounded-[12px] px-[12px] py-[10px] text-left text-[13.5px] transition-colors duration-150 hover:bg-[#F7F9F7] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#4E9E5C] ${
                    n.read ? "" : "bg-[#F4FAF5]"
                  }`}
                >
                  <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[9px] bg-[#FFF4D8] text-[#A77B00]">
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <b className={`block ${n.read ? "font-medium" : "font-semibold"}`}>
                      {n.title}
                    </b>
                    <span className="block text-[#5B665F]">{n.message}</span>
                    <small className="block text-[12px] text-[#8E978F]">
                      {timeAgo(n.created_at)}
                    </small>
                  </span>
                  {!n.read && (
                    <span
                      aria-label="Unread"
                      className="mt-[6px] h-[8px] w-[8px] shrink-0 rounded-full bg-[#F4A07E]"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}