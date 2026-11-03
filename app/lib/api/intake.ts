import { apiFetch } from "./client";
import { isoFromDate } from "./meals";

type IntakeRow = {
  date: string; // "2026-10-27"
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

/** Ek mahine ka roz ka khaya hua kcal: { 1: 0, 2: 1850, ... } (din ke number se) */
export async function fetchMonthIntake(
  year: number,
  month: number,
): Promise<Record<number, number>> {
  const from = isoFromDate(new Date(year, month, 1));
  const to = isoFromDate(new Date(year, month + 1, 0));

  const rows = await apiFetch<IntakeRow[]>(
    `/nutrition/intake?from=${from}&to=${to}`,
  );

  const out: Record<number, number> = {};
  for (const r of rows) out[Number(r.date.slice(8, 10))] = Math.round(r.calories);
  return out;
}