import { apiFetch } from "./client";
import type { Meal } from "../../components/dashboard/mealData";
import { isVeg, paletteFor } from "./meals";
import type {
  Ingredient,
  Recipe,
  RecipeStep,
} from "../../components/recipe-player/recipeData";

type BackendIngredient = {
  food_name: string;
  quantity_grams: number;
  display_quantity: string | null;
  display_unit: string | null;
  position: number;
};

type BackendStep = {
  position: number;
  instruction: string;
  phase: string;
  duration_seconds: number | null;
  timer_seconds: number | null;
};

type BackendRecipe = {
  id: string;
  servings: number;
  difficulty: string | null;
  ingredients: BackendIngredient[];
  steps: BackendStep[];
};

const PHASE_LABEL: Record<string, string> = {
  prep: "Prep",
  cook: "Cook",
  rest: "Rest",
  assemble: "Assemble",
  serve: "Serve",
};

// "2", "1.5", "1/2", "1 1/2" -> number. Samajh na aaye to null.
function parseQty(text: string | null): number | null {
  if (!text) return null;
  const t = text.trim();
  let m = t.match(/^\d+(?:\.\d+)?$/);
  if (m) return parseFloat(t);
  m = t.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (m) return parseInt(m[1], 10) + parseInt(m[2], 10) / parseInt(m[3], 10);
  m = t.match(/^(\d+)\/(\d+)$/);
  if (m) return parseInt(m[1], 10) / parseInt(m[2], 10);
  return null;
}

function levelFor(difficulty: string | null): Recipe["level"] {
  const d = (difficulty ?? "").toLowerCase();
  if (d === "hard") return "Hard";
  if (d === "medium") return "Medium";
  return "Easy";
}

// Backend recipe -> player ka Recipe. Miqdar 1 serving ki hoti hai (UI khud servings se guna karta hai).
function toRecipe(b: BackendRecipe): Recipe {
  const servings = b.servings > 0 ? b.servings : 1;

  // Backend mein step ka title nahi hota: phase ka naam lete hain, doosri baar aaye to number lagate hain
  const seen: Record<string, number> = {};
  const steps: RecipeStep[] = [...b.steps]
    .sort((a, c) => a.position - c.position)
    .map((s) => {
      const base = PHASE_LABEL[s.phase] ?? "Step";
      seen[base] = (seen[base] ?? 0) + 1;
      const seconds = s.timer_seconds ?? s.duration_seconds ?? 0;
      return {
        title: seen[base] > 1 ? `${base} ${seen[base]}` : base,
        desc: s.instruction,
        mins: Math.max(1, Math.round(seconds / 60)),
      };
    });

  const names: Record<string, number> = {};
  const ingredients: Ingredient[] = [...b.ingredients]
    .sort((a, c) => a.position - c.position)
    .map((i) => {
      names[i.food_name] = (names[i.food_name] ?? 0) + 1;
      const name =
        names[i.food_name] > 1 ? `${i.food_name} (${names[i.food_name]})` : i.food_name;
      const q = parseQty(i.display_quantity);
      if (q !== null) {
        return { name, qty: q / servings, unit: i.display_unit ?? undefined };
      }
      return { name, qty: i.quantity_grams / servings, unit: "g" };
    });

  return {
    videoId: "", // backend mein video nahi hai; UI "Watch on YouTube" card dikhata hai
    level: levelFor(b.difficulty),
    steps,
    ingredients,
  };
}

const cache = new Map<string, Promise<Recipe>>();

/** Recipe player ke liye recipe (cache hoti hai) */
export function fetchRecipeForPlayer(recipeId: string): Promise<Recipe> {
  const cached = cache.get(recipeId);
  if (cached) return cached;
  const p = apiFetch<BackendRecipe>(`/recipes/${recipeId}`)
    .then(toRecipe)
    .catch((e: unknown) => {
      cache.delete(recipeId); // fail hua to agli baar dobara try ho
      throw e;
    });
  cache.set(recipeId, p);
  return p;
}

/** Recipe poori ho gayi: backend mein cooking session shuru karke complete mark karo */
export async function recordRecipeCompleted(
  recipeId: string,
  servings: number,
): Promise<void> {
  const session = await apiFetch<{ session_id: string }>(
    `/recipes/${recipeId}/execution-sessions`,
    { method: "POST", json: { servings } },
  );
  await apiFetch(`/recipe-execution-sessions/${session.session_id}/complete`, {
    method: "POST",
  });
}

export type RecipeSummary = {
  id: string;
  name: string;
  description: string | null;
  total_time_minutes: number;
  difficulty: string | null;
  tags: string[];
};

/** Recipes mein naam se dhoondo (term khali ho to pehli kuch recipes) */
export async function searchRecipes(
  term: string | null,
  limit = 8,
): Promise<RecipeSummary[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (term) params.set("search", term);
  const r = await apiFetch<{ items: RecipeSummary[] }>(`/recipes?${params}`);
  return r.items;
}

type PreviewRecipe = {
  id: string;
  name: string;
  description: string | null;
  total_time_minutes: number;
  tags: string[];
  nutrition: { per_serving: { code: string; amount: number }[] };
};

/** Plan ke bahar ki recipe ko Recipe Player mein dikhane ke liye Meal bana do */
export async function fetchPreviewMeal(recipeId: string): Promise<Meal> {
  const r = await apiFetch<PreviewRecipe>(`/recipes/${recipeId}`);
  const get = (code: string) =>
    Math.round(r.nutrition.per_serving.find((n) => n.code === code)?.amount ?? 0);
  return {
    id: r.id,
    name: r.name,
    desc: r.description ?? "",
    kcal: get("calories"),
    mins: r.total_time_minutes,
    p: get("protein"),
    c: get("carbohydrates"),
    f: get("fat"),
    veg: isVeg(r.tags),
    colors: paletteFor(r.name),
  };
}