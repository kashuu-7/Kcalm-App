import { apiFetch, ApiError } from "./client";
import { createWeeklyPlan, isoFromDate } from "./meals";

export type BackendGroceryItem = {
  id: string;
  food_name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  manually_added: boolean;
  // Backend mein abhi price nahi hai; jab aayega to UI mein khud dikhne lagega
  estimated_price?: number | null;
};

export type BackendGroceryList = {
  grocery_list_id: string;
  weekly_plan_id: string;
  items: BackendGroceryItem[];
};

type GroceryListSummary = {
  grocery_list_id: string;
  weekly_plan_id: string;
  generated_at: string;
};
type WeekSummary = { weekly_plan_id: string; start_date: string; end_date: string };

/** Sirf chal rahe hafte ki active grocery list. Nahi hai to null. */
export async function fetchActiveList(): Promise<BackendGroceryList | null> {
  const today = isoFromDate(new Date());
  const [lists, weeks] = await Promise.all([
    apiFetch<{ items: GroceryListSummary[] }>("/grocery-lists?status=active"),
    apiFetch<{ items: WeekSummary[] }>("/weekly-meal-plans"),
  ]);

  // Wo haftay jo abhi khatam nahi huay (purane hafte ki list nahi uthani)
  const current = new Set(
    weeks.items.filter((w) => w.end_date >= today).map((w) => w.weekly_plan_id),
  );
  const candidates = lists.items
    .filter((l) => current.has(l.weekly_plan_id))
    .sort((a, b) => b.generated_at.localeCompare(a.generated_at));

  if (candidates.length === 0) return null;
  return apiFetch<BackendGroceryList>(`/grocery-lists/${candidates[0].grocery_list_id}`);
}

/**
 * Grocery list backend mein hafte ke plan se banti hai.
 * Chal rahe hafte ka plan dhoondo; na ho to naya banao, phir uski list banao.
 */
export async function createListFromCurrentWeek(): Promise<BackendGroceryList | null> {
  const today = isoFromDate(new Date());

  const findWeek = async () => {
    const weeks = await apiFetch<{ items: WeekSummary[] }>("/weekly-meal-plans");
    return weeks.items.find((w) => w.end_date >= today)?.weekly_plan_id;
  };

  let weekId = await findWeek();
  if (!weekId) {
    // Daily plan wala code bhi yahi function use karta hai, isliye hafta ek hi baar banta hai
    weekId = (await createWeeklyPlan(today))?.weekly_plan_id ?? (await findWeek());
  }
  if (!weekId) return null;

  try {
    return await apiFetch<BackendGroceryList>(
      `/weekly-meal-plans/${weekId}/grocery-list`,
      { method: "POST" },
    );
  } catch (e) {
    // Is hafte ki list pehle se bani hai (409): wahi utha lo
    if (e instanceof ApiError && e.status === 409) return fetchActiveList();
    throw e;
  }
}

export function setItemChecked(
  listId: string,
  itemId: string,
  checked: boolean,
): Promise<BackendGroceryList> {
  return apiFetch<BackendGroceryList>(`/grocery-lists/${listId}/items/${itemId}`, {
    method: "PATCH",
    json: { checked },
  });
}

export function addListItem(
  listId: string,
  item: { name: string; quantity: number; unit: string; category: string },
): Promise<BackendGroceryList> {
  return apiFetch<BackendGroceryList>(`/grocery-lists/${listId}/items`, {
    method: "POST",
    json: item,
  });
}

/** List ko hafte ke plan se dobara banao */
export function regenerateList(listId: string): Promise<BackendGroceryList> {
  return apiFetch<BackendGroceryList>(`/grocery-lists/${listId}/regenerate`, {
    method: "POST",
  });
}