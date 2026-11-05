"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

export const THEME_KEY = "kcalm-theme";

const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

// Asli halat <html> ki "dark" class hai (server par hamesha light)
const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

export function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  listeners.forEach((l) => l());
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next = !dark;
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      /* private mode: sirf is session ke liye */
    }
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className="relative grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full border border-[#1d2a2214] bg-white shadow-[var(--shadow)] transition-colors duration-200 hover:bg-[#E9F6EC]"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}