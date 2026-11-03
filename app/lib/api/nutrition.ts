import { apiFetch } from "./client";
import { toBackend, type ProfileFields } from "./profile";

type CalcResponse = {
  bmr: number;
  tdee: number;
  target_calories: number;
  macros: { protein_g: number; carbs_g: number; fat_g: number };
};

export type Targets = {
  bmr: number;
  tdee: number;
  calories: number;
  proteinG: number;
  carbG: number;
  fatG: number;
};

function fromResponse(r: CalcResponse): Targets {
  return {
    bmr: Math.round(r.bmr),
    tdee: Math.round(r.tdee),
    calories: Math.round(r.target_calories),
    proteinG: Math.round(r.macros.protein_g),
    carbG: Math.round(r.macros.carbs_g),
    fatG: Math.round(r.macros.fat_g),
  };
}

/** Form ke numbers se hisaab (review page ke liye, profile save hone se pehle) */
export async function calculateTargets(
  f: Pick<ProfileFields, "age" | "sex" | "height" | "weight" | "activity" | "goal">,
): Promise<Targets> {
  const b = toBackend(f);
  return fromResponse(
    await apiFetch<CalcResponse>("/nutrition/calculate", {
      method: "POST",
      json: {
        age: b.age,
        sex: b.sex,
        height_cm: b.height_cm,
        weight_kg: b.weight_kg,
        activity_level: b.activity_level,
        goal: b.goal,
      },
    }),
  );
}

type SavedProfile = {
  age: number;
  sex: string;
  height_cm: number;
  weight_kg: number;
  activity_level: string;
  goal: string;
  target_rate: number | null;
  max_cooking_minutes: number;
};

/** Backend mein saved profile ke hisaab se targets (dashboard waghera ke liye) */
export async function fetchSavedTargets(): Promise<
  (Targets & { activityLevel: string; cookMinutes: number }) | null
> {
  try {
    const p = await apiFetch<SavedProfile>("/users/profile");
    const r = await apiFetch<CalcResponse>("/nutrition/calculate", {
      method: "POST",
      json: {
        age: p.age,
        sex: p.sex,
        height_cm: p.height_cm,
        weight_kg: p.weight_kg,
        activity_level: p.activity_level,
        goal: p.goal,
        target_rate: p.target_rate,
      },
    });
    return {
      ...fromResponse(r),
      activityLevel: p.activity_level,
      cookMinutes: p.max_cooking_minutes,
    };
  } catch {
    return null; // profile nahi bana ya backend band
  }
}