"use client";

import { useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import SwapMealModal from "./SwapMealModal";
import SwapMeal from "../dailyplan/SwapMeal";
import AddSnack from "../dailyplan/AddSnack";
import type { Meal, MealSlot } from "./mealData";
import { userKey } from "../../lib/userStorage";
import * as api from "../../lib/api/meals";

/* ---------------- Types ---------------- */

export type Snack = {
  id: string;
  name: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
};

type DayStatus = "loading" | "ready" | "error";

// Ek din ka data. slots/meals/itemIds/logged plan ke items ke order (position) mein hain.
// Slots ab fixed nahi: backend user ke meals_per_day (2 se 5) ke hisaab se deta hai.
type DayData = {
  status: DayStatus;
  planId: string | null;
  slots: MealSlot[]; // id = backend ka meal_type, time = scheduled_time
  itemIds: (string | null)[];
  meals: (Meal | null)[];
  logged: boolean[];
  snacks: Snack[];
  error: string | null;
};

type Modal =
  | null
  | { type: "swap-list"; offset: number }
  | { type: "swap"; offset: number; index: number; options: Meal[] }
  | { type: "snack"; offset: number };

type State = {
  viewOffset: number; // 0 = aaj, -1 = kal, +1 = parson...
  days: Record<string, DayData>; // key: YYYY-MM-DD
  modal: Modal;
};

// Snack ki list wahi hai jo pehle thi (UI same); chunne par backend mein save hota hai
export const SNACK_OPTIONS: Snack[] = [
  { id: "protein-shake", name: "Protein shake", kcal: 180, p: 25, c: 8, f: 3 },
  { id: "almonds", name: "Handful of almonds", kcal: 170, p: 6, c: 6, f: 15 },
  { id: "banana", name: "Banana", kcal: 105, p: 1, c: 27, f: 0 },
  { id: "hummus-carrots", name: "Hummus & Carrots", kcal: 150, p: 14, c: 8, f: 8 },
  { id: "boiled-eggs", name: "Boiled eggs (2)", kcal: 180, p: 13, c: 1, f: 11 },
];

const MIN_OFFSET = -30; // kitne din peechhe ja sakte ho
const MAX_OFFSET = 7; // kitne din aage ja sakte ho

const INITIAL_STATE: State = { viewOffset: 0, days: {}, modal: null };

// Plan abhi aaya nahi (loading / error / guzra din) to khali cards ke liye slots.
// Pehle asli plan ke baad wahi count yaad rakhte hain, taake cards ki ginti na kude.
const DEFAULT_SLOT_TYPES = ["breakfast", "lunch", "pre_workout", "dinner"];
let lastSlotTypes: string[] = DEFAULT_SLOT_TYPES;

const emptyDay = (status: DayStatus, error: string | null = null): DayData => ({
  status,
  planId: null,
  slots: [],
  itemIds: [],
  meals: [],
  logged: [],
  snacks: [],
  error,
});

const LOADING_DAY = emptyDay("loading");

/* ---------------- Date helpers ---------------- */

export function dateForOffset(offset: number) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
}

function dayKey(offset: number) {
  return api.isoFromDate(dateForOffset(offset));
}

export function dayLabel(offset: number) {
  if (offset === 0) return "Today";
  if (offset === -1) return "Yesterday";
  if (offset === 1) return "Tomorrow";
  return dateForOffset(offset).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function dayTitle(offset: number) {
  return Math.abs(offset) <= 1
    ? `${dayLabel(offset)}'s meals`
    : `Meals · ${dayLabel(offset)}`;
}

function dayWord(offset: number) {
  if (offset === 0) return "today";
  if (offset === -1) return "yesterday";
  if (offset === 1) return "tomorrow";
  return "this day";
}

/* ---------------- Shared store (sab pages ke liye ek hi) ---------------- */

let state: State = INITIAL_STATE;
let ownerKey: string | null = null;
const inflight = new Set<string>();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

// Dusra user login ho to purana data saaf
function syncOwner() {
  const k = userKey("meals");
  if (ownerKey === k) return;
  ownerKey = k;
  state = INITIAL_STATE;
  lastSlotTypes = DEFAULT_SLOT_TYPES;
  inflight.clear();
}

function putDay(key: string, day: DayData) {
  state = { ...state, days: { ...state.days, [key]: day } };
  emit();
}

function patchDay(key: string, fn: (d: DayData) => DayData) {
  const d = state.days[key];
  if (!d) return;
  state = { ...state, days: { ...state.days, [key]: fn(d) } };
  emit();
}

const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Something went wrong";

// Plan ke items ko UI ke slots mein rakho (position ke order mein; waqt backend ka scheduled_time)
async function buildSlots(plan: api.MealPlan) {
  const items = [...plan.meals].sort((a, b) => a.position - b.position);
  const recipes = await Promise.all(items.map((it) => api.fetchRecipe(it.recipe_id)));

  const slots: MealSlot[] = items.map((it) => ({
    id: it.meal_type,
    time: api.formatClock(it.scheduled_time),
    type: api.slotLabel(it.meal_type),
  }));
  const meals: (Meal | null)[] = items.map((it, i) => api.itemToMeal(it, recipes[i]));
  const itemIds: (string | null)[] = items.map((it) => it.id);

  if (items.length > 0) lastSlotTypes = items.map((it) => it.meal_type);
  return { slots, meals, itemIds };
}

async function loadDay(offset: number) {
  const key = dayKey(offset);
  inflight.add(key);
  putDay(key, emptyDay("loading"));
  try {
    // Aaj aur aage ke din ka plan na ho to banta hai; guzre din ka nahi
    let plan = await api.fetchPlanForDate(key);
    if (!plan && offset >= 0) plan = await api.createPlan(key);

    const [loggedIds, snacks] = await Promise.all([
      plan ? api.fetchPlanLogs(plan.meal_plan_id) : Promise.resolve<string[]>([]),
      api.fetchSnacks(key),
    ]);

    const built: {
      slots: MealSlot[];
      meals: (Meal | null)[];
      itemIds: (string | null)[];
    } = plan ? await buildSlots(plan) : { slots: [], meals: [], itemIds: [] };
    const logged = built.itemIds.map((id) => (id ? loggedIds.includes(id) : false));

    putDay(key, {
      status: "ready",
      planId: plan?.meal_plan_id ?? null,
      slots: built.slots,
      itemIds: built.itemIds,
      meals: built.meals,
      logged,
      snacks,
      error: null,
    });
  } catch (e) {
    putDay(key, emptyDay("error", errorMessage(e)));
  } finally {
    inflight.delete(key);
  }
}

function ensureDay(offset: number) {
  if (typeof window === "undefined") return;
  syncOwner();
  const key = dayKey(offset);
  const existing = state.days[key];
  if ((existing && existing.status !== "error") || inflight.has(key)) return;
  void loadDay(offset);
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

/* ---------------- Actions ---------------- */

function setViewOffset(next: number) {
  const o = Math.min(MAX_OFFSET, Math.max(MIN_OFFSET, next));
  if (o === state.viewOffset) return;
  state = { ...state, viewOffset: o };
  emit();
}

function shiftView(delta: number) {
  setViewOffset(state.viewOffset + delta);
}

export function resetView() {
  setViewOffset(0);
}

async function toggleLogged(offset: number, index: number) {
  const key = dayKey(offset);
  const d = state.days[key];
  const itemId = d?.itemIds[index];
  if (!d || !d.planId || !itemId) return;

  const next = !d.logged[index];
  const setLogged = (v: boolean) =>
    patchDay(key, (x) => ({ ...x, logged: x.logged.map((l, i) => (i === index ? v : l)) }));

  setLogged(next);
  try {
    if (next) await api.logItem(d.planId, itemId);
    else await api.unlogItem(d.planId, itemId);
  } catch {
    setLogged(!next); // save na hua to wapas purani halat
  }
}

async function addSnack(offset: number, snack: Snack) {
  const key = dayKey(offset);
  try {
    const created = await api.createSnack(key, snack);
    patchDay(key, (d) => ({ ...d, snacks: [...d.snacks, created] }));
  } catch {
    /* save nahi hua, list waisi hi rahegi */
  }
}

async function removeSnack(offset: number, id: string) {
  const key = dayKey(offset);
  const before = state.days[key]?.snacks;
  if (!before) return;
  patchDay(key, (d) => ({ ...d, snacks: d.snacks.filter((s) => s.id !== id) }));
  try {
    await api.deleteSnack(id);
  } catch {
    patchDay(key, (d) => ({ ...d, snacks: before }));
  }
}

// Swap ke baad naye plan se meals dobara bharo (logged aur snacks wahi rehte hain)
async function applyPlan(key: string, plan: api.MealPlan) {
  const built = await buildSlots(plan);
  patchDay(key, (d) => ({
    ...d,
    planId: plan.meal_plan_id,
    slots: built.slots,
    itemIds: built.itemIds,
    meals: built.meals,
  }));
}

// Sirf wo meals badalte hain jo abhi khaye nahi. Kitne badlenge, wo foran wapas deta hai.
function regeneratePlan(offset: number): number {
  const key = dayKey(offset);
  const d = state.days[key];
  if (!d || !d.planId) return 0;
  const indexes = d.slots.map((_, i) => i).filter((i) => d.itemIds[i] && !d.logged[i]);
  if (indexes.length === 0) return 0;
  void regenerateAsync(key, d.planId, indexes);
  return indexes.length;
}

async function regenerateAsync(key: string, planId: string, indexes: number[]) {
  for (const i of indexes) {
    const cur = state.days[key];
    const itemId = cur?.itemIds[i];
    const mealType = cur?.slots[i]?.id;
    if (!cur || !itemId || !mealType) continue;
    try {
      const options = (await api.fetchSwapOptions(mealType)).filter(
        (o) => o.id !== cur.meals[i]?.id,
      );
      if (options.length === 0) continue;
      const pick = options[Math.floor(Math.random() * options.length)];
      await applyPlan(key, await api.swapItem(planId, itemId, pick.id));
    } catch {
      /* is slot ko chhod do, agla try karo */
    }
  }
}

function openModal(modal: Modal) {
  state = { ...state, modal };
  emit();
}

function closeModal() {
  state = { ...state, modal: null };
  emit();
}

// Swap ki list backend se laate hain, phir modal kholte hain
async function openSwapModal(offset: number, index: number) {
  const mealType = state.days[dayKey(offset)]?.slots[index]?.id;
  if (!mealType) return;
  try {
    const options = await api.fetchSwapOptions(mealType);
    openModal({ type: "swap", offset, index, options });
  } catch {
    /* list nahi aayi to modal nahi khulta */
  }
}

function pickSwapSlot(index: number) {
  const m = state.modal;
  if (!m || m.type !== "swap-list") return;
  void openSwapModal(m.offset, index);
}

async function selectMeal(meal: Meal) {
  const m = state.modal;
  if (!m || m.type !== "swap") return;
  closeModal();

  const key = dayKey(m.offset);
  const d = state.days[key];
  const itemId = d?.itemIds[m.index];
  if (!d || !d.planId || !itemId) return;
  if (d.meals[m.index]?.id === meal.id) return;

  try {
    await applyPlan(key, await api.swapItem(d.planId, itemId, meal.id));
  } catch {
    /* swap nahi hua, purana meal rehta hai */
  }
}

function pickSnack(snack: Snack) {
  const m = state.modal;
  if (!m || m.type !== "snack") return;
  closeModal();
  void addSnack(m.offset, snack);
}

/* ---------------- Hooks ---------------- */

function placeholder(slot: MealSlot, status: DayStatus): Meal {
  return {
    id: `none-${slot.id}`,
    name: status === "loading" ? "Loading…" : "No meal planned",
    desc: "",
    kcal: 0,
    mins: 0,
    p: 0,
    c: 0,
    f: 0,
    veg: false,
    colors: ["#F2F5F2", "#E9F6EC", "#F7F9F7"],
  };
}

// Plan hai to uske slots, nahi to khali cards ke slots (waqt "—")
function resolveSlots(day: DayData): MealSlot[] {
  if (day.slots.length > 0) return day.slots;
  return lastSlotTypes.map((t) => ({ id: t, time: "—", type: api.slotLabel(t) }));
}

function resolveMeals(day: DayData, slots: MealSlot[]): Meal[] {
  return slots.map((slot, i) => day.meals[i] ?? placeholder(slot, day.status));
}

// "view" = jo din Daily Plan par chuna hai, "today" = hamesha aaj (dashboard ke liye)
export function useMeals(which: "view" | "today" = "view") {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const offset = which === "today" ? 0 : s.viewOffset;

  useEffect(() => {
    ensureDay(offset);
  }, [offset]);

  const day = s.days[dayKey(offset)] ?? LOADING_DAY;
  const slots = useMemo(() => resolveSlots(day), [day]);
  const meals = useMemo(() => resolveMeals(day, slots), [day, slots]);
  const logged = useMemo(
    () => meals.map((_, i) => day.logged[i] ?? false),
    [day, meals],
  );

  return {
    slots,
    meals,
    logged,
    snacks: day.snacks,
    // "Up next" sirf aaj ke din hota hai
    activeIndex:
      offset === 0 ? day.logged.findIndex((l, i) => !l && day.meals[i] !== null) : -1,
    isToday: offset === 0,
    offset,
    dayTitle: dayTitle(offset),
    loading: day.status === "loading",
    error: day.error,
    toggleLogged: (i: number) => void toggleLogged(offset, i),
    openSwap: (i: number) => void openSwapModal(offset, i),
    openSwapList: () => openModal({ type: "swap-list", offset }),
    openSnack: () => openModal({ type: "snack", offset }),
    removeSnack: (id: string) => void removeSnack(offset, id),
    regeneratePlan: () => regeneratePlan(offset),
  };
}

export function useDayNav() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return {
    offset: s.viewOffset,
    canPrev: s.viewOffset > MIN_OFFSET,
    canNext: s.viewOffset < MAX_OFFSET,
    goPrev: () => shiftView(-1),
    goNext: () => shiftView(1),
    goToday: resetView,
  };
}

/* ---------------- Provider (teeno boxes yahan khulte hain) ---------------- */

export function MealsProvider({ children }: { children: ReactNode }) {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const modal = s.modal;

  let content: ReactNode = null;
  if (modal) {
    const day = s.days[dayKey(modal.offset)] ?? LOADING_DAY;
    const slots = resolveSlots(day);
    const meals = resolveMeals(day, slots);

    if (modal.type === "swap") {
      content = (
        <SwapMealModal
          slot={slots[modal.index]}
          options={modal.options}
          current={meals[modal.index]}
          onSelect={(m) => void selectMeal(m)}
          onClose={closeModal}
        />
      );
    } else if (modal.type === "swap-list") {
      content = (
        <SwapMeal slots={slots} meals={meals} onPick={pickSwapSlot} onClose={closeModal} />
      );
    } else {
      content = (
        <AddSnack
          options={SNACK_OPTIONS}
          when={dayWord(modal.offset)}
          onPick={pickSnack}
          onClose={closeModal}
        />
      );
    }
  }

  return (
    <>
      {children}
      {content}
    </>
  );
}