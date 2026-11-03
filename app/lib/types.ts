/* Kcalm: shared data types (frontend + backend isi ko follow karein) */

export type ID = string;
export type IsoDate = string; // "2026-10-19" (hamesha 0 laga kar: 2026-10-09)

export type PlanId = "basic" | "plus" | "premium";
export type Sex = "Male" | "Female" | "Other";
export type GoalId = "lose" | "maintain" | "build";
export type ActivityId = "sedentary" | "light" | "moderate" | "active";
export type CookTime = "10" | "20" | "30+";

/* ---------- Auth ---------- */
export type AuthUser = { id: ID; name: string; email: string };

/* ---------- Profile (Edit profile modal) ---------- */
export type Profile = {
  name: string;
  email: string; // email auth ka hissa hai, badalne par verification chahiye
  age: number; // 10 - 120
  sex: Sex;
  height: number; // cm, 100 - 250
  weight: number; // kg, 20 - 300
  calories: number; // daily target, 800 - 6000
  goal: GoalId;
};

/* ---------- Onboarding (calibration ke 3 steps) ---------- */
export type Calibration = {
  // step 1 (Basics)
  name: string;
  sex: "Male" | "Female";
  age: number;
  height: number;
  weight: number;
  target: number; // target weight, kg
};

export type About = {
  // step 2 (About you)
  activity: ActivityId;
  goal: GoalId;
  cookTime: CookTime;
  diet: string[]; // diet ids, jaise "gluten-free"
  equipment: string[]; // jaise "oven"
};

export type Targets = {
  // step 3 (Review) ka natija
  calories: number;
  proteinG: number;
  carbG: number;
  fatG: number;
  proteinPerKg: number; // 0.8 - 3.0
};

export type Onboarding = {
  calibration: Calibration;
  about: About;
  targets: Targets;
};

/* ---------- Plan ---------- */
export type Membership = { plan: PlanId };

/* ---------- Profile page ki preferences ---------- */
export type Preferences = {
  diet: string[]; // Dietary preferences ke ids
  excludedAllergens: string[]; // Allergies & restrictions ke ids
};

/* ---------- Meals (Daily plan / Timeline) ---------- */
export type Snack = {
  id: ID;
  name: string;
  kcal: number;
  p: number; // protein g
  c: number; // carbs g
  f: number; // fat g
};

export type DayPlan = {
  date: IsoDate;
  mealIds: string[]; // slot ke hisab se: breakfast, lunch, pre-workout, dinner
  logged: boolean[]; // mealIds ke barabar length, kaunsa khaya
  snacks: Snack[];
};

/* ---------- Grocery ---------- */
export type GroceryGroupId =
  | "vegetables" | "fruits" | "protein" | "dairy" | "grains" | "pantry"
  | "recipes";

export type GroceryItem = {
  id: ID;
  name: string;
  qty: string; // jaise "2 heads", "500 g"
  price: number | null;
  aisle: GroceryGroupId;
  checked: boolean;
};

/* ---------- Errors (har endpoint ka ek jaisa format) ---------- */
export type ApiError = {
  error: {
    code: string; // jaise "invalid_credentials", "validation_failed"
    message: string; // user ko dikhane layak
    fields?: Record<string, string>; // field ke hisab se error
  };
};