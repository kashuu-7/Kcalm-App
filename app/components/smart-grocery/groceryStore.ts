"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { userKey } from "../../lib/userStorage";
import * as api from "../../lib/api/grocery";

export type AisleId =
  | "vegetables"
  | "fruits"
  | "protein"
  | "dairy"
  | "grains"
  | "pantry";

// Recipe se aane wali cheezon ka alag group
export type GroupId = AisleId | "recipes";

export type Aisle = { id: AisleId; label: string; letter: string; color: string };
export type Group = { id: GroupId; label: string; letter: string; color: string };

// Aisle ka rang yahan se badal sakte ho
export const AISLES: Aisle[] = [
  { id: "vegetables", label: "Vegetables", letter: "V", color: "#E5F3DC" },
  { id: "fruits", label: "Fruits", letter: "F", color: "#FFEFE7" },
  { id: "protein", label: "Protein", letter: "P", color: "#FCE4EA" },
  { id: "dairy", label: "Dairy", letter: "D", color: "#E7F3FC" },
  { id: "grains", label: "Grains", letter: "G", color: "#FFF3CF" },
  { id: "pantry", label: "Pantry", letter: "P", color: "#F0EDFD" },
];

export const RECIPE_GROUP: Group = {
  id: "recipes",
  label: "From recipes",
  letter: "F",
  color: "#E7F3FC",
};

export const ALL_GROUPS: Group[] = [...AISLES, RECIPE_GROUP];

export type GroceryItem = {
  id: string;
  name: string;
  qty: string;
  price: number | null; // backend price de to dikhti hai, warna null
  aisle: GroupId;
  checked: boolean;
};

type Status = "loading" | "ready" | "error";

type State = {
  items: GroceryItem[];
  listId: string | null;
  status: Status;
  shoppingIds: string[] | null; // shopping mode mein dikhne wale items (null = mode band)
};

const INITIAL_STATE: State = {
  items: [],
  listId: null,
  status: "loading",
  shoppingIds: null,
};

/* ---------------- Backend <-> UI ka mapping ---------------- */

const FRUIT = /apple|banana|berry|berries|orange|lemon|lime|grape|mango|pear|peach|plum|melon|pineapple|kiwi|cherry|papaya|pomegranate|fig|date/i;

const fmtQty = (n: number) => String(parseFloat(n.toFixed(2)));

// Backend ki category -> UI ka aisle. "other" wahi cheezein hain jo recipe se judti hain.
function aisleFor(b: api.BackendGroceryItem): GroupId {
  switch (b.category) {
    case "produce":
      return FRUIT.test(b.food_name) ? "fruits" : "vegetables";
    case "meat_seafood":
      return "protein";
    case "dairy":
      return "dairy";
    case "grains":
      return "grains";
    case "pantry":
    case "frozen":
      return "pantry";
    default:
      return "recipes";
  }
}

// UI ka aisle -> backend ki category
function categoryFor(aisle: AisleId): string {
  switch (aisle) {
    case "vegetables":
    case "fruits":
      return "produce";
    case "protein":
      return "meat_seafood";
    case "dairy":
      return "dairy";
    case "grains":
      return "grains";
    default:
      return "pantry";
  }
}

function toItem(b: api.BackendGroceryItem): GroceryItem {
  return {
    id: b.id,
    name: b.food_name,
    qty: `${fmtQty(b.quantity)} ${b.unit}`.trim(),
    price: typeof b.estimated_price === "number" ? b.estimated_price : null,
    aisle: aisleFor(b),
    checked: b.checked,
  };
}

// "2 kg", "1 dozen", "3" -> { quantity, unit }. Samajh na aaye to 1 aur poora text unit.
function parseQty(text: string): { quantity: number; unit: string } {
  const m = text.trim().match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
  if (m) {
    const quantity = parseFloat(m[1]);
    if (quantity > 0) return { quantity, unit: m[2].trim() || "item" };
  }
  return { quantity: 1, unit: text.trim() || "item" };
}

/* ---------------- Shared store ---------------- */

let state: State = INITIAL_STATE;
let ownerKey: string | null = null;
let loading = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

// Dusra user login ho to purana data saaf
function syncOwner() {
  const k = userKey("grocery");
  if (ownerKey === k) return;
  ownerKey = k;
  state = INITIAL_STATE;
  loading = false;
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  emit();
}

// Backend ki list ko screen par lagao. Naye items shopping mode mein bhi dikhte hain.
function applyList(list: api.BackendGroceryList) {
  const before = new Set(state.items.map((i) => i.id));
  const items = list.items.map(toItem);
  const added = items.filter((i) => !before.has(i.id)).map((i) => i.id);
  set({
    items,
    listId: list.grocery_list_id,
    status: "ready",
    shoppingIds: state.shoppingIds ? [...state.shoppingIds, ...added] : null,
  });
}

async function loadList() {
  loading = true;
  set({ status: "loading" });
  try {
    const list = (await api.fetchActiveList()) ?? (await api.createListFromCurrentWeek());
    if (list) applyList(list);
    else set({ items: [], listId: null, status: "ready" });
  } catch {
    set({ status: "error" });
  } finally {
    loading = false;
  }
}

function ensureLoaded() {
  if (typeof window === "undefined") return;
  syncOwner();
  if (state.status === "ready" || loading) return;
  if (state.status === "error" && state.items.length > 0) return;
  void loadList();
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};
const getSnapshot = () => {
  if (typeof window !== "undefined") syncOwner();
  return state;
};
const getServerSnapshot = () => INITIAL_STATE;

/* ---------------- Naam ka mukabla (recipe ingredients ke liye) ---------------- */

const singular = (w: string) => {
  if (w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.endsWith("oes")) return w.slice(0, -2);
  if (w.endsWith("ss")) return w;
  if (w.endsWith("s")) return w.slice(0, -1);
  return w;
};

// "Brown rice (dry)" aur "Brown rice" ek jaise, "Tomatoes" aur "Tomato" ek jaise
const normName = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map(singular)
    .join(" ");

/* ---------------- Actions ---------------- */

// Pehle screen badlo, phir backend mein save; fail ho to wapas purani halat
async function setChecked(ids: string[], checked: boolean) {
  const listId = state.listId;
  if (!listId) return;
  const prev = state.items;
  const wanted = new Set(ids);
  const changing = prev.filter((i) => wanted.has(i.id) && i.checked !== checked);
  if (changing.length === 0) return;

  set({ items: prev.map((i) => (wanted.has(i.id) ? { ...i, checked } : i)) });
  try {
    await Promise.all(changing.map((i) => api.setItemChecked(listId, i.id, checked)));
  } catch {
    set({ items: prev });
  }
}

export function toggleItem(id: string) {
  const item = state.items.find((i) => i.id === id);
  if (item) void setChecked([id], !item.checked);
}

export function setItemsChecked(ids: string[], checked: boolean) {
  void setChecked(ids, checked);
}

export function addItem(input: { name: string; qty: string; aisle: AisleId }) {
  const listId = state.listId;
  if (!listId) return;
  const { quantity, unit } = parseQty(input.qty);
  void api
    .addListItem(listId, {
      name: input.name,
      quantity,
      unit,
      category: categoryFor(input.aisle),
    })
    .then(applyList)
    .catch(() => {
      /* add nahi hua, list waisi hi rahegi */
    });
}

// Recipe ki wo ingredients jo list mein pehle se nahi hain, "From recipes" mein judti hain.
// Kitni judengi, wo foran wapas milta hai; save background mein hota hai.
export function addRecipeItems(
  ingredients: { name: string; qty?: number; unit?: string }[],
  servings: number,
): { added: number; skipped: number } {
  const listId = state.listId;
  if (!listId) return { added: 0, skipped: ingredients.length };

  const existing = new Set(state.items.map((i) => normName(i.name)));
  const fresh: { name: string; quantity: number; unit: string }[] = [];
  let skipped = 0;

  for (const ing of ingredients) {
    const key = normName(ing.name);
    if (existing.has(key)) {
      skipped++;
      continue;
    }
    existing.add(key);
    fresh.push({
      name: ing.name.replace(/\s*\(.*?\)/g, "").trim(),
      quantity: ing.qty !== undefined && ing.qty > 0 ? ing.qty * servings : 1,
      unit: ing.unit || "item",
    });
  }

  if (fresh.length > 0) {
    void (async () => {
      for (const f of fresh) {
        try {
          // "other" category = UI mein "From recipes"
          applyList(await api.addListItem(listId, { ...f, category: "other" }));
        } catch {
          /* ye wali nahi judi, agli try karo */
        }
      }
    })();
  }

  return { added: fresh.length, skipped };
}

export function uncheckAll() {
  set({ shoppingIds: null });
  void setChecked(
    state.items.filter((i) => i.checked).map((i) => i.id),
    false,
  );
}

// List ko hafte ke plan se dobara banao (apne add kiye hue items ka kya hota hai wo backend tay karta hai)
export function resetList() {
  const listId = state.listId;
  if (!listId) return;
  set({ shoppingIds: null });
  void api
    .regenerateList(listId)
    .then(applyList)
    .catch(() => {
      /* nahi hua to purani list rehti hai */
    });
}

export function startShopping() {
  set({ shoppingIds: state.items.filter((i) => !i.checked).map((i) => i.id) });
}

export function exitShopping() {
  set({ shoppingIds: null });
}

/* ---------------- Hook ---------------- */

export function useGrocery() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    ensureLoaded();
  }, []);

  return useMemo(() => {
    const items = s.items;
    const total = items.length;
    const checked = items.filter((i) => i.checked).length;
    const sum = (list: GroceryItem[]) =>
      list.reduce((t, i) => t + (i.price ?? 0), 0);

    return {
      items,
      total,
      checked,
      remaining: total - checked,
      percent: total ? (checked / total) * 100 : 0,
      totalCost: sum(items),
      remainingCost: sum(items.filter((i) => !i.checked)),
      shopping: s.shoppingIds !== null,
      shoppingIds: s.shoppingIds,
      loading: s.status === "loading",
      error: s.status === "error",
    };
  }, [s.items, s.shoppingIds, s.status]);
}

/* ---------------- Helpers ---------------- */

export const fmtMoney = (n: number) => `$${n.toFixed(2)}`;

// Item ke do harf ("Broccoli" -> "Br")
export const itemAbbr = (name: string) => {
  const n = name.trim();
  return (n[0]?.toUpperCase() ?? "") + (n[1]?.toLowerCase() ?? "");
};

export function buildListText(items: GroceryItem[]) {
  const lines = ["This week's grocery list", ""];
  for (const group of ALL_GROUPS) {
    const list = items.filter((i) => i.aisle === group.id);
    if (list.length === 0) continue;
    lines.push(group.label);
    for (const i of list) {
      lines.push(`${i.checked ? "[x]" : "[ ]"} ${i.name} - ${i.qty}`);
    }
    lines.push("");
  }
  return lines.join("\n").trim();
}