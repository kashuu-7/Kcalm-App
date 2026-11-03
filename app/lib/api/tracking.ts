import { apiFetch, ApiError } from "./client";
import { userKey } from "../userStorage";

/* ---------------- Achievements aur insights ---------------- */

export type Achievement = {
  code: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  unlocked: boolean;
};

export type InsightItem = {
  code: string;
  message: string;
  values: Record<string, number | null>;
};

export type Insights = {
  start_date: string;
  end_date: string;
  logged_nutrition_days: number;
  items: InsightItem[];
};

/** Backend ke asli records se achievements (koi fake percentage nahi) */
export async function fetchAchievements(): Promise<Achievement[]> {
  const r = await apiFetch<{ items: Achievement[] }>("/achievements");
  return r.items;
}

/** Pichle `days` dinon ke insights (backend ka maximum 366 din hai) */
export async function fetchInsights(days = 30): Promise<Insights> {
  const end = new Date();
  const start = addDays(end, -(days - 1));
  return apiFetch<Insights>(
    `/insights?start_date=${isoLocal(start)}&end_date=${isoLocal(end)}`,
  );
}

/* ---------------- Date helpers ---------------- */

// Local date ko YYYY-MM-DD banao (toISOString UTC mein badal deta hai, isliye nahi)
export function isoLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  x.setDate(x.getDate() + n);
  return x;
}

/** Hafte ke 7 din (Mon se Sun) YYYY-MM-DD mein. weekOffset 0 = is hafte, 1 = pichle hafte */
export function weekDays(weekOffset: number): string[] {
  const t = addDays(new Date(), 0);
  const sinceMonday = (t.getDay() + 6) % 7; // Mon = 0 ... Sun = 6
  const monday = addDays(t, -sinceMonday - weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => isoLocal(addDays(monday, i)));
}

/* ---------------- Wazan aur steps ---------------- */

export type WeightPoint = { date: string; kg: number };

/** Wazan ke records (purane se naye) */
export async function fetchWeightLogs(start: string, end: string): Promise<WeightPoint[]> {
  const r = await apiFetch<{ items: { log_date: string; weight_kg: number }[] }>(
    `/weight-logs?start_date=${start}&end_date=${end}&limit=365`,
  );
  return r.items
    .map((i) => ({ date: i.log_date, kg: i.weight_kg }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Is din ka wazan save karo (us din pehle se ho to badal jata hai) */
export function logWeight(date: string, kg: number): Promise<unknown> {
  return apiFetch(`/weight-logs/${date}`, { method: "PUT", json: { weight_kg: kg } });
}

/** Din ke hisaab se steps: { "2026-10-27": 8120, ... } */
export async function fetchSteps(start: string, end: string): Promise<Record<string, number>> {
  const r = await apiFetch<{ items: { log_date: string; steps: number }[] }>(
    `/steps?start_date=${start}&end_date=${end}&limit=365`,
  );
  const out: Record<string, number> = {};
  for (const i of r.items) out[i.log_date] = i.steps;
  return out;
}

/* ---------------- Khana: hafte ke stats aur aaj ka nutrition ---------------- */

export type IntakeRow = {
  date: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number | null; // null = us din ka pura data maloom nahi
  added_sugar_g: number | null;
};

export function fetchIntakeRange(start: string, end: string): Promise<IntakeRow[]> {
  return apiFetch<IntakeRow[]>(`/nutrition/intake?from=${start}&to=${end}`);
}

export type NutritionSummary = {
  nutrition_score: number | null; // 0 se 100, ya null agar score nikal nahi sakta
  unavailable_reason: string | null;
  calorie_adherence: { score: number | null };
  macro_balance: { score: number | null };
  data_completeness: { percentage: number };
};

/** Pichle `days` dinon ka nutrition score, calorie adherence aur macro balance (sab backend ka hisaab) */
export async function fetchNutritionSummary(days: number): Promise<NutritionSummary> {
  const end = new Date();
  const start = addDays(end, -(days - 1));
  const r = await apiFetch<{ nutrition_summary: NutritionSummary }>(
    `/insights?start_date=${isoLocal(start)}&end_date=${isoLocal(end)}`,
  );
  return r.nutrition_summary;
}

export type TodayNutrition = {
  protein: number;
  fiber: number;
  micro: number;
  sugarG: number | null; // aaj ka added sugar (gram); null = pura data maloom nahi
};

/** Aaj ka protein, fiber aur baaki micronutrients (target ka % , 0 se 100) */
export async function fetchTodayNutrition(proteinTargetG: number): Promise<TodayNutrition> {
  const today = isoLocal(new Date());
  const [rows, micro] = await Promise.all([
    fetchIntakeRange(today, today),
    apiFetch<{ micronutrients: { code: string; percentage: number }[] }>(
      `/nutrition/micronutrients/actual?date=${today}`,
    ),
  ]);

  const cap = (n: number) => Math.max(0, Math.min(100, n));
  const protein =
    proteinTargetG > 0 ? cap(((rows[0]?.protein_g ?? 0) / proteinTargetG) * 100) : 0;
  const fiber = cap(micro.micronutrients.find((m) => m.code === "fiber")?.percentage ?? 0);
  const others = micro.micronutrients.filter((m) => m.code !== "fiber");
  const avg = others.length
    ? others.reduce((sum, m) => sum + cap(m.percentage), 0) / others.length
    : 0;

      return {
    protein: Math.round(protein),
    fiber: Math.round(fiber),
    micro: Math.round(avg),
    sugarG: rows[0]?.added_sugar_g ?? null,
  };
}

/* ---------------- Daily metrics (water, fruit-veg, sleep) ---------------- */

export type DailyMetrics = { water: number; veg: number; sleep: number };

/** Is din ka record. Nahi hai (404) to null; yani abhi kuch likha hi nahi gaya. */
export async function fetchDailyMetrics(date: string): Promise<DailyMetrics | null> {
  try {
    const r = await apiFetch<{
      water_glasses: number;
      fruit_veg_servings: number;
      sleep_hours: number;
    }>(`/daily-metrics/${date}`);
    return { water: r.water_glasses, veg: r.fruit_veg_servings, sleep: r.sleep_hours };
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

/** Is din ka poora record save karo (backend teeno fields ek saath leta hai aur purana replace karta hai) */
export function saveDailyMetrics(date: string, m: DailyMetrics): Promise<unknown> {
  return apiFetch(`/daily-metrics/${date}`, {
    method: "PUT",
    json: {
      water_glasses: Math.round(m.water),
      fruit_veg_servings: m.veg,
      sleep_hours: m.sleep,
    },
  });
}

/* ---------------- Habits ---------------- */

export type HabitKey = "water" | "steps" | "sleep" | "veg" | "workout";

// UI ki 5 habits; backend mein inhi naamon se banti hain
export const HABIT_ROWS: { key: HabitKey; name: string }[] = [
  { key: "water", name: "Water" },
  { key: "steps", name: "Steps" },
  { key: "sleep", name: "Sleep" },
  { key: "veg", name: "Fruits & Veg" },
  { key: "workout", name: "Workout" },
];

type HabitMap = Record<HabitKey, { id: string }>;

let habitsCache: { owner: string; promise: Promise<HabitMap> } | null = null;

/** 5 habits backend mein dhoondo; jo na hon wo bana do (ek hi baar, phir cache) */
export function ensureHabits(): Promise<HabitMap> {
  const owner = userKey("habits");
  if (habitsCache && habitsCache.owner === owner) return habitsCache.promise;

  const promise = (async () => {
    const list = await apiFetch<{ items: { id: string; name: string }[] }>("/habits?limit=100");
    const out = {} as HabitMap;
    for (const row of HABIT_ROWS) {
      const found = list.items.find(
        (h) => h.name.trim().toLowerCase() === row.name.toLowerCase(),
      );
      if (found) {
        out[row.key] = { id: found.id };
        continue;
      }
      const created = await apiFetch<{ id: string }>("/habits", {
        method: "POST",
        json: { name: row.name },
      });
      out[row.key] = { id: created.id };
    }
    return out;
  })();

  habitsCache = { owner, promise };
  promise.catch(() => {
    if (habitsCache?.promise === promise) habitsCache = null; // fail hua to agli baar dobara
  });
  return promise;
}

/** Is hafte ki har habit: { "2026-10-26": true/false }. Jis din habit thi hi nahi, wo din nahi aata. */
export async function fetchHabitWeek(
  days: string[],
): Promise<Record<HabitKey, Record<string, boolean>>> {
  const habits = await ensureHabits();
  const today = isoLocal(new Date());
  const end = days[6] < today ? days[6] : today;

  const entries = await Promise.all(
    HABIT_ROWS.map(async (row) => {
      const h = await apiFetch<{ items: { date: string; completed: boolean }[] }>(
        `/habits/${habits[row.key].id}/history?start_date=${days[0]}&end_date=${end}`,
      );
      const map: Record<string, boolean> = {};
      for (const i of h.items) map[i.date] = i.completed;
      return [row.key, map] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<HabitKey, Record<string, boolean>>;
}

/** Is din ki habit done / not done karo */
export async function setHabitDone(
  key: HabitKey,
  date: string,
  completed: boolean,
): Promise<void> {
  const habits = await ensureHabits();
  await apiFetch(`/habits/${habits[key].id}/completions/${date}`, {
    method: "PUT",
    json: { completed },
  });
}

export type MicroActual = {
  code: string;
  actual: number;
  target: number;
  unit: string;
  percentage: number;
};

/** Aaj ke micronutrients: kitna khaya, target kitna, aur % (backend ke logged meals se) */
export async function fetchMicronutrientsToday(): Promise<MicroActual[]> {
  const today = isoLocal(new Date());
  const r = await apiFetch<{ micronutrients: MicroActual[] }>(
    `/nutrition/micronutrients/actual?date=${today}`,
  );
  return r.micronutrients;
}

/** Is hafte ke asli numbers: { water: {"2026-10-26": 4}, steps: {...}, sleep: {...}, veg: {...} } */
export async function fetchHabitValues(
  days: string[],
): Promise<Partial<Record<HabitKey, Record<string, number>>>> {
  const today = isoLocal(new Date());
  const end = days[6] < today ? days[6] : today;

  const [metrics, steps] = await Promise.all([
    apiFetch<{
      items: {
        log_date: string;
        water_glasses: number;
        fruit_veg_servings: number;
        sleep_hours: number;
      }[];
    }>(`/daily-metrics?from=${days[0]}&to=${end}&limit=31`),
    fetchSteps(days[0], end),
  ]);

  const water: Record<string, number> = {};
  const veg: Record<string, number> = {};
  const sleep: Record<string, number> = {};
  for (const m of metrics.items) {
    water[m.log_date] = m.water_glasses;
    veg[m.log_date] = m.fruit_veg_servings;
    sleep[m.log_date] = m.sleep_hours;
  }
  return { water, veg, sleep, steps };
}