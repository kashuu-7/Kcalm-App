import { apiFetch } from "./client";

export type AppNotification = {
  id: string;
  kind: string; // jaise "achievement"
  title: string;
  message: string;
  read: boolean;
  read_at: string | null;
  created_at: string;
};

export type NotificationsPage = {
  items: AppNotification[];
  total: number;
  unread_count: number;
  limit: number;
  offset: number;
};

/** Naye earned achievements ki notifications banata hai (dobara chalane se duplicate nahi banti) */
export const syncNotifications = () =>
  apiFetch<{ created_count: number }>("/notifications/sync", { method: "POST" });

export const fetchNotifications = () =>
  apiFetch<NotificationsPage>("/notifications?limit=50");

export const markNotificationRead = (id: string) =>
  apiFetch<AppNotification>(`/notifications/${id}/read`, { method: "PATCH" });