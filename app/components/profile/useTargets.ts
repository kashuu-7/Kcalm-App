"use client";

import { useSyncExternalStore } from "react";
import { fetchSavedTargets } from "../../lib/api/nutrition";

export type TargetsView = {
  calories: number;
  proteinG: number;
  carbG: number;
  fatG: number;
  activity: string;
  cookTime: string;
  ready: boolean; // true = backend se asli numbers aa chuke hain
};

// Jab tak backend se na aaye (ya profile na bana ho) ye dikhte hain
const DEFAULTS: TargetsView = {
  calories: 2280,
  proteinG: 140,
  carbG: 277,
  fatG: 68,
  activity: "Light",
  cookTime: "20 min",
  ready: false,
};

const ACTIVITY_LABEL: Record<string, string> = {
  sedentary: "Sedentary",
  light: "Light",
  moderate: "Moderate",
  very_active: "Very active",
  extra_active: "Extra active",
};

const CACHE_KEY = "kcalm-targets-cache";

let snapshot: TargetsView = DEFAULTS;
let currentEmail: string | null = null;
let version = 0;
const listeners = new Set<() => void>();

function emit(next: TargetsView) {
  snapshot = next;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Backend se naye targets lao. User badle ya profile save ho to dobara bulao. */
export async function refreshTargets(email: string) {
  if (currentEmail !== email) {
    currentEmail = email;
    // Isi user ka pichla jawab turant dikhao (agar browser mein hai)
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      const cached = raw ? JSON.parse(raw) : null;
      emit(cached?.email === email ? { ...DEFAULTS, ...cached.view, ready: false } : DEFAULTS);
    } catch {
      emit(DEFAULTS);
    }
  }

  const mine = ++version;
  const data = await fetchSavedTargets();
  if (mine !== version || currentEmail !== email || !data) return;

  const next: TargetsView = {
    calories: data.calories,
    proteinG: data.proteinG,
    carbG: data.carbG,
    fatG: data.fatG,
    activity: ACTIVITY_LABEL[data.activityLevel] ?? "Light",
    cookTime: `${data.cookMinutes} min`,
    ready: true,
  };
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ email, view: next }));
  } catch {
    /* ignore */
  }
  emit(next);
}

export function useTargets(): TargetsView {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => DEFAULTS,
  );
}