import { apiFetch, ApiError } from "./client";
import { logWeight } from "./tracking";
import { isoFromDate } from "./meals";

export type ActivityId = "sedentary" | "light" | "moderate" | "active";
export type GoalId = "lose" | "maintain" | "build";
export type CookTime = "10" | "20" | "30+";
export type WeightDirection = "lose_weight" | "gain_weight" | "maintain_weight";

// Frontend ke naam, backend ke naam mein badalne ki table
const ACTIVITY_TO_BACKEND = {
  sedentary: "sedentary",
  light: "light",
  moderate: "moderate",
  active: "very_active",
} as const;

const GOAL_TO_BACKEND = {
  lose: "fat_loss",
  maintain: "maintenance",
  build: "muscle_gain",
} as const;

const GOAL_FROM_BACKEND: Record<string, GoalId> = {
  fat_loss: "lose",
  maintenance: "maintain",
  muscle_gain: "build",
  recomposition: "maintain",
};

const GOAL_LABEL: Record<GoalId, string> = {
  lose: "Lose weight",
  maintain: "Maintain weight",
  build: "Gain weight",
};

const COOK_MINUTES: Record<CookTime, number> = { "10": 10, "20": 20, "30+": 45 };

/** Is browser ka timezone (IANA naam, jaise "Asia/Karachi") */
export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

// Backend "11:00:00" bhejta hai, screen ko "11:00" chahiye
function hhmm(t: string | null | undefined, fallback: string): string {
  const m = t ? /^(\d{1,2}):(\d{2})/.exec(t) : null;
  return m ? `${m[1].padStart(2, "0")}:${m[2]}` : fallback;
}

// "Gluten free" ya "air-fryer" ko backend ke format (gluten_free, air_fryer) mein badlo
const toKey = (s: string) => s.trim().toLowerCase().replace(/[\s-]+/g, "_");

// Purane/alag naam ko backend ke supported tag par le jao
const DIET_ALIAS: Record<string, string> = { lactose_free: "dairy_free" };

// Frontend ke allergen chips -> backend ke canonical allergen codes.
// Backend sirf yahi 9 codes samajhta hai: peanut, tree_nut, milk, egg, fish,
// shellfish, soy, wheat, sesame. Koi aur naam bheja to "unsupported_allergy"
// ban jata hai aur koi recipe eligible nahi rehti.
export const ALLERGEN_TO_BACKEND: Record<string, string[]> = {
  nuts: ["peanut", "tree_nut"],
  seafood: ["fish", "shellfish"],
  eggs: ["egg"],
  dairy: ["milk"],
  wheat: ["wheat"],
  soy: ["soy"],
  sesame: ["sesame"],
};

export function goalLabelToId(label: string): GoalId {
  const found = (Object.keys(GOAL_LABEL) as GoalId[]).find(
    (id) => GOAL_LABEL[id] === label,
  );
  return found ?? "maintain";
}

export type BackendProfile = {
  age: number;
  sex: "male" | "female";
  height_cm: number;
  weight_kg: number;
  target_weight_kg: number | null;
  activity_level: string;
  goal: string;
  target_rate: number | null;
  max_cooking_minutes: number;
  meals_per_day: number;
  usual_wake_time: string;
  usual_sleep_time: string;
  timezone: string;
  weight_direction: WeightDirection | null;
  allergies: string[];
  dietary_restrictions: string[];
  preferred_foods: string[];
  disliked_foods: string[];
  equipment: string[];
};

export type ProfileFields = Partial<{
  age: number;
  sex: string;
  height: number;
  weight: number;
  target: number;
  activity: ActivityId;
  goal: GoalId;
  cookTime: CookTime;
  diet: string[];
  allergens: string[]; // frontend ids: nuts, seafood, eggs, dairy, wheat, soy, sesame
  equipment: string[];
  wake: string; // "HH:MM", jaise "11:00"
  sleep: string; // "HH:MM", jaise "03:00"
  timezone: string; // IANA naam, jaise "Asia/Karachi"
  meals: number; // 2 se 5
}>;

export function toBackend(f: ProfileFields): Partial<BackendProfile> {
  const p: Partial<BackendProfile> = {};
  if (f.target !== undefined) p.target_weight_kg = f.target;
  if (f.age !== undefined) p.age = Math.round(f.age);
  if (f.sex !== undefined) p.sex = f.sex === "Female" ? "female" : "male";
  if (f.height !== undefined) p.height_cm = f.height;
  if (f.weight !== undefined) p.weight_kg = f.weight;
  if (f.activity) p.activity_level = ACTIVITY_TO_BACKEND[f.activity];
  if (f.goal) p.goal = GOAL_TO_BACKEND[f.goal];
  if (f.cookTime) p.max_cooking_minutes = COOK_MINUTES[f.cookTime];
  if (f.wake) p.usual_wake_time = f.wake;
  if (f.sleep) p.usual_sleep_time = f.sleep;
  if (f.timezone) p.timezone = f.timezone;
  if (f.meals !== undefined) {
    p.meals_per_day = Math.min(5, Math.max(2, Math.round(f.meals)));
  }
  if (f.diet) {
    p.dietary_restrictions = f.diet
      .filter((d) => d !== "none")
      .map(toKey)
      .map((k) => DIET_ALIAS[k] ?? k);
  }
  if (f.allergens) {
    p.allergies = [
      ...new Set(f.allergens.flatMap((id) => ALLERGEN_TO_BACKEND[id] ?? [])),
    ];
  }
  if (f.equipment) p.equipment = f.equipment.map(toKey);
  return p;
}

// Pehli baar profile banate waqt jo cheezein na di hon, unke default
// (function hai taake timezone browser se, sahi waqt par, pata chale)
const createDefaults = () => ({
  activity_level: "light",
  goal: "maintenance",
  target_rate: null,
  max_cooking_minutes: 20,
  meals_per_day: 4,
  usual_wake_time: "07:00",
  usual_sleep_time: "23:00",
  timezone: detectTimezone(),
  allergies: [] as string[],
  dietary_restrictions: [] as string[],
  preferred_foods: [] as string[],
  disliked_foods: [] as string[],
  equipment: ["stovetop", "oven", "air_fryer"],
});

/** Profile save karo: pehle se hai to update, nahi hai to naya banao */
export async function upsertProfile(fields: ProfileFields): Promise<BackendProfile> {
  const payload = toBackend(fields);
  let saved: BackendProfile;
  try {
    saved = await apiFetch<BackendProfile>("/users/profile", { method: "PATCH", json: payload });
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) {
      saved = await apiFetch<BackendProfile>("/users/profile", {
        method: "POST",
        json: { ...createDefaults(), ...payload },
      });
    } else {
      throw e;
    }
  }

  // Wazan ka record bhi rakho, taake Insights ka weight chart bane
  if (fields.weight !== undefined) {
    void logWeight(isoFromDate(new Date()), fields.weight).catch(() => {});
  }
  return saved;
}

/** Backend se profile padho. Nahi mili (ya error) to null. */
export async function fetchProfile(): Promise<{
  age: number;
  sex: string;
  height: number;
  weight: number;
  goal: string;
} | null> {
  try {
    const b = await apiFetch<BackendProfile>("/users/profile");
    return {
      age: b.age,
      sex: b.sex === "female" ? "Female" : "Male",
      height: b.height_cm,
      weight: b.weight_kg,
      goal: GOAL_LABEL[GOAL_FROM_BACKEND[b.goal] ?? "maintain"],
    };
  } catch {
    return null;
  }
}

export type DaySettings = {
  wake: string; // "HH:MM"
  sleep: string; // "HH:MM"
  timezone: string;
  meals: number; // 2 se 5
  weightDirection: WeightDirection | null; // target weight na ho to null
};

export function daySettingsFromProfile(b: BackendProfile): DaySettings {
  return {
    wake: hhmm(b.usual_wake_time, "07:00"),
    sleep: hhmm(b.usual_sleep_time, "23:00"),
    timezone: b.timezone || detectTimezone(),
    meals: Math.min(5, Math.max(2, b.meals_per_day || 4)),
    weightDirection: b.weight_direction ?? null,
  };
}

/** Wake/sleep/timezone/meals (aur weight_direction). Profile nahi bana (404) ya error to null. */
export async function fetchDaySettings(): Promise<DaySettings | null> {
  try {
    const b = await apiFetch<BackendProfile>("/users/profile");
    return daySettingsFromProfile(b);
  } catch {
    return null;
  }
}

export type DietPrefs = { diet: string[]; allergens: string[] };

/**
 * Backend se diet aur allergy ka chunav (frontend ids mein).
 * Profile abhi bana hi nahi (404) to null. Baaki errors throw hote hain,
 * taake screen "load nahi hua" dikha sake, "sab Allowed" nahi.
 */
export async function fetchDietPrefs(): Promise<DietPrefs | null> {
  try {
    const b = await apiFetch<BackendProfile>("/users/profile");
    const codes = new Set(b.allergies ?? []);
    return {
      diet: (b.dietary_restrictions ?? []).map((k) => k.replace(/_/g, "-")),
      allergens: Object.keys(ALLERGEN_TO_BACKEND).filter((id) =>
        ALLERGEN_TO_BACKEND[id].some((c) => codes.has(c)),
      ),
    };
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

/** Diet aur allergies backend mein save karo (poori list replace hoti hai) */
export async function saveDietPrefs(p: DietPrefs): Promise<void> {
  await apiFetch("/users/profile", {
    method: "PATCH",
    json: toBackend({ diet: p.diet, allergens: p.allergens }),
  });
}
