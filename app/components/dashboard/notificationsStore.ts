"use client";

import { useSyncExternalStore } from "react";
import {
  fetchNotifications,
  markNotificationRead,
  syncNotifications,
  type AppNotification,
} from "../../lib/api/notifications";

export type NotificationsView = {
  items: AppNotification[];
  unread: number;
  status: "idle" | "loading" | "ready" | "error";
};

const EMPTY: NotificationsView = { items: [], unread: 0, status: "idle" };

let snapshot: NotificationsView = EMPTY;
let currentEmail: string | null = null;
let version = 0;
const listeners = new Set<() => void>();

function emit(next: NotificationsView) {
  snapshot = next;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Backend se notifications lao (pehle naye achievements sync, phir list) */
export async function refreshNotifications(email: string) {
  if (currentEmail !== email) {
    currentEmail = email;
    emit({ ...EMPTY, status: "loading" }); // doosre user ka data na dikhe
  } else if (snapshot.status === "idle" || snapshot.status === "error") {
    emit({ ...snapshot, status: "loading" });
  }

  const mine = ++version;
  try {
    await syncNotifications();
  } catch {
    /* sync fail ho to bhi purani list dikhao */
  }
  try {
    const r = await fetchNotifications();
    if (mine !== version || currentEmail !== email) return;
    emit({ items: r.items, unread: r.unread_count, status: "ready" });
  } catch {
    if (mine !== version || currentEmail !== email) return;
    emit({ ...snapshot, status: "error" });
  }
}

export function retryNotifications() {
  if (currentEmail) void refreshNotifications(currentEmail);
}

/** Ek notification padhi hui mark karo (pehle screen par, phir backend mein) */
export async function markRead(id: string) {
  const item = snapshot.items.find((i) => i.id === id);
  if (!item || item.read) return;
  emit({
    ...snapshot,
    items: snapshot.items.map((i) => (i.id === id ? { ...i, read: true } : i)),
    unread: Math.max(0, snapshot.unread - 1),
  });
  try {
    await markNotificationRead(id);
  } catch {
    /* agli refresh par sahi ho jayega */
  }
}

/** Backend mein "sab padh liye" ka endpoint nahi, to ek ek karke mark karte hain */
export async function markAllRead() {
  const unread = snapshot.items.filter((i) => !i.read);
  if (unread.length === 0) return;
  emit({
    ...snapshot,
    items: snapshot.items.map((i) => ({ ...i, read: true })),
    unread: Math.max(0, snapshot.unread - unread.length),
  });
  await Promise.allSettled(unread.map((i) => markNotificationRead(i.id)));
}

export function useNotifications(): NotificationsView {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => EMPTY,
  );
}