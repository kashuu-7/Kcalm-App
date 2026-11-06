import { apiFetch, ApiError } from "./client";
import type { Meal } from "../../components/dashboard/mealData";

/** Local date ko YYYY-MM-DD banao (zero-padded; toISOString UTC mein badal deta hai, isliye nahi) */
export function isoFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ---------------- Slot ka naam aur waqt (screen ke liye) ---------------- */

const SLOT_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  snack: "Snack",
  pre_workout: "Pre-workout",
  dinner: "Dinner",
};

/** Backend ke meal_type ko screen ka naam do (pre_workout -> Pre-workout) */
export function slotLabel(mealType: string): string {
  return (
    SLOT_LABELS[mealType] ??
    mealType.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())
  );
}

/**
 * Backend ka local waqt ("12:00:00" ya "01:00") ko "12:00 PM" / "01:00 AM" banao.
 * Purane plans mein waqt null hota hai, unhein "Unscheduled" dikhao.
 */
export function formatClock(t: string | null | undefined): string {
  const m = t ? /^(\d{1,2}):(\d{2})/.exec(t) : null;
  if (!m) return "Unscheduled";
  const h24 = parseInt(m[1], 10);
  const h12 = h24 % 12 || 12;
  return `${String(h12).padStart(2, "0")}:${m[2]} ${h24 >= 12 ? "PM" : "AM"}`;
}

/* ---------------- Backend ke types ---------------- */

export type PlanItem = {
  id: string;
  meal_type: string;
  recipe_id: string;
  recipe_name: string;
  servings: number;
  position: number;
  scheduled_time: string | null; // local waqt, jaise "12:00:00"; purane plans mein null
  nutrition: Record<string, number>;
};

export type MealPlan = {
  meal_plan_id: string;
  plan_date: string;
  status: string;
  meals: PlanItem[];
};

type PlanSummary = { meal_plan_id: string; plan_date: string };

export type RecipeInfo = {
  id: string;
  name: string;
  description: string | null;
  total_time_minutes: number;
  tags: string[];
};

type Nutrient = { code: string; amount: number };

type Candidate = {
  recipe_id: string;
  name: string;
  total_time_minutes: number;
  tags: string[];
  per_serving_nutrition: Nutrient[];
};

type SnackRecord = {
  id: string;
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type SnackData = {
  id: string;
  name: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
};

/* ---------------- Meal plans ---------------- */

/** Is date ka plan (agar hai). Nahi hai to null. */
export async function fetchPlanForDate(date: string): Promise<MealPlan | null> {
  const list = await apiFetch<{ items: PlanSummary[] }>(
    `/meal-plans?plan_date=${date}`,
  );
  const first = list.items[0];
  if (!first) return null;
  return apiFetch<MealPlan>(`/meal-plans/${first.meal_plan_id}`);
}

export type WeeklyPlan = {
  weekly_plan_id: string;
  start_date: string;
  end_date: string;
  daily_plans: MealPlan[];
};

const weekCreations = new Map<string, Promise<WeeklyPlan | null>>();

/** Profile schedule update par in-flight weekly-plan request cache clear karo. */
export function invalidateWeeklyPlanCache() {
  weekCreations.clear();
}

/**
 * Hafte ka plan banao (7 din ek saath). Daily plan aur grocery dono yahi use karte hain,
 * isliye ek hi waqt mein do baar nahi banta. Pehle se hai (409) to null.
 * meal_slots nahi bhejte: backend user ke meals_per_day ke hisaab se khud slots aur
 * wake/sleep ke mutabiq waqt (scheduled_time) tay karta hai.
 */
export function createWeeklyPlan(startDate: string): Promise<WeeklyPlan | null> {
  const running = weekCreations.get(startDate);
  if (running) return running;

  const p = apiFetch<WeeklyPlan>("/weekly-meal-plans", {
    method: "POST",
    json: { start_date: startDate },
  })
    .catch((e: unknown) => {
      if (e instanceof ApiError && e.status === 409) return null;
      throw e;
    })
    .finally(() => {
      weekCreations.delete(startDate);
    });
  weekCreations.set(startDate, p);
  return p;
}

/** Sirf is ek din ka plan banao (slots aur waqt backend profile se tay karta hai) */
export function createDailyPlan(date: string): Promise<MealPlan> {
  return apiFetch<MealPlan>("/meal-plans", {
    method: "POST",
    json: { plan_date: date },
  });
}

/** Is date ka plan banao: pehle poora hafta (grocery ke liye zaroori), na ban sake to sirf ye din */
export async function createPlan(date: string): Promise<MealPlan> {
  try {
    const week = await createWeeklyPlan(date);
    const fromWeek = week?.daily_plans.find((p) => p.plan_date === date);
    if (fromWeek) return fromWeek;
  } catch (e) {
    if (!(e instanceof ApiError)) throw e; // network jaisi cheez
  }
  const existing = await fetchPlanForDate(date);
  if (existing) return existing;
  return createDailyPlan(date);
}

/** Plan ke kaun se items "khaye" mark hain (backend ka GET /meal-plans/{id}/logs) */
export async function fetchPlanLogs(planId: string): Promise<string[]> {
  try {
    const logs = await apiFetch<{ meal_plan_item_id: string }[]>(
      `/meal-plans/${planId}/logs`,
    );
    return logs.map((l) => l.meal_plan_item_id);
  } catch (e) {
    // Backend mein ye route abhi na ho to khali maano
    if (e instanceof ApiError && (e.status === 404 || e.status === 405)) return [];
    throw e;
  }
}

export function logItem(planId: string, itemId: string): Promise<unknown> {
  return apiFetch(`/meal-plans/${planId}/items/${itemId}/log`, {
    method: "POST",
    json: { type: "ate_as_planned" },
  });
}

export function unlogItem(planId: string, itemId: string): Promise<void> {
  return apiFetch<void>(`/meal-plans/${planId}/items/${itemId}/log`, {
    method: "DELETE",
  });
}

/** Item badlo. recipeId do to wahi recipe lagti hai (backend patch chahiye), warna backend khud chunta hai */
export function swapItem(
  planId: string,
  itemId: string,
  recipeId?: string,
): Promise<MealPlan> {
  return apiFetch<MealPlan>(`/meal-plans/${planId}/items/${itemId}/swap`, {
    method: "POST",
    json: recipeId ? { recipe_id: recipeId } : {},
  });
}

/* ---------------- Recipes ---------------- */

const recipeCache = new Map<string, Promise<RecipeInfo | null>>();

/** Recipe ki detail (cache hoti hai, baar-baar nahi mangti) */
export function fetchRecipe(id: string): Promise<RecipeInfo | null> {
  let p = recipeCache.get(id);
  if (!p) {
    p = apiFetch<RecipeInfo>(`/recipes/${id}`).catch(() => null);
    recipeCache.set(id, p);
  }
  return p;
}

/** Is slot ke liye wo recipes jo user ke liye eligible hain (swap ki list) */
export async function fetchSwapOptions(mealType: string): Promise<Meal[]> {
  const r = await apiFetch<{ candidates: Candidate[] }>(
    "/recipes/candidates/preview",
    {
      method: "POST",
      json: { meal_type: mealType, require_complete_nutrition: true },
    },
  );
  const infos = await Promise.all(r.candidates.map((c) => fetchRecipe(c.recipe_id)));
  return r.candidates.map((c, i) => candidateToMeal(c, infos[i]));
}

/* ---------------- Snacks ---------------- */

function toSnack(r: SnackRecord): SnackData {
  return {
    id: r.id,
    name: r.name,
    kcal: Math.round(r.calories),
    p: Math.round(r.protein_g),
    c: Math.round(r.carbs_g),
    f: Math.round(r.fat_g),
  };
}

/** Is din ke snacks (backend ka GET /nutrition/snacks?date=). Route na ho to khali. */
export async function fetchSnacks(date: string): Promise<SnackData[]> {
  try {
    const rows = await apiFetch<SnackRecord[]>(`/nutrition/snacks?date=${date}`);
    return rows.map(toSnack);
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 405)) return [];
    throw e;
  }
}

export async function createSnack(
  date: string,
  s: { name: string; kcal: number; p: number; c: number; f: number },
): Promise<SnackData> {
  const r = await apiFetch<SnackRecord>("/nutrition/snacks", {
    method: "POST",
    json: {
      log_date: date,
      name: s.name,
      calories: s.kcal,
      protein_g: s.p,
      carbs_g: s.c,
      fat_g: s.f,
    },
  });
  return toSnack(r);
}

export function deleteSnack(id: string): Promise<void> {
  return apiFetch<void>(`/nutrition/snacks/${id}`, { method: "DELETE" });
}

/* ---------------- Backend data -> UI ka Meal ---------------- */

// Backend mein recipe ki tasveer nahi hoti; UI ke gol "plate" ke rang naam se tay hote hain
const PALETTES: [string, string, string][] = [
  ["#CDE8B8", "#FFE7A3", "#E9D6B8"],
  ["#F1E4CF", "#D9C2F2", "#FFC9D2"],
  ["#FFE39A", "#BFE3A6", "#E8CFA8"],
  ["#F2C27B", "#CDEBC9", "#F3EFE7"],
  ["#F4D58D", "#B7E1A1", "#ffc9b5"],
  ["#f7d774", "#ede3d1", "#cdebc9"],
  ["#F6F2EA", "#C9A7EB", "#E9C9A0"],
  ["#FFD9C2", "#CFE9C8", "#F7E8B5"],
];

export function paletteFor(name: string): [string, string, string] {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
}

export const isVeg = (tags: string[]) => tags.includes("vegetarian") || tags.includes("vegan");

/** Plan ka item + uski recipe -> UI ka Meal (numbers poore serving ke hain) */
export function itemToMeal(item: PlanItem, recipe: RecipeInfo | null): Meal {
  const n = item.nutrition;
  return {
    id: item.recipe_id,
    name: item.recipe_name,
    desc: recipe?.description ?? "",
    kcal: Math.round(n.calories ?? 0),
    mins: recipe?.total_time_minutes ?? 0,
    p: Math.round(n.protein ?? 0),
    c: Math.round(n.carbohydrates ?? 0),
    f: Math.round(n.fat ?? 0),
    veg: isVeg(recipe?.tags ?? []),
    colors: paletteFor(item.recipe_name),
  };
}

function candidateToMeal(c: Candidate, recipe: RecipeInfo | null): Meal {
  const get = (code: string) =>
    c.per_serving_nutrition.find((x) => x.code === code)?.amount ?? 0;
  return {
    id: c.recipe_id,
    name: c.name,
    desc: recipe?.description ?? "",
    kcal: Math.round(get("calories")),
    mins: c.total_time_minutes,
    p: Math.round(get("protein")),
    c: Math.round(get("carbohydrates")),
    f: Math.round(get("fat")),
    veg: isVeg(c.tags),
    colors: paletteFor(c.name),
  };
}
