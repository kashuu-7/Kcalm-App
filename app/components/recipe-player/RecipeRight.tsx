"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import { Check, ChefHat, Clock, ShoppingCart, Users2 } from "lucide-react";
import { mealBackground, type Meal } from "../dashboard/mealData";
import { addRecipeItems } from "../smart-grocery/groceryStore";
import type { Recipe } from "./recipeData";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 8;
const ALERT_MS = 6000; // alert kitni der dikhe
const NOTE_MS = 5000; // grocery message kitni der dikhe

const fmtQty = (n: number) => String(parseFloat(n.toFixed(2)));
const fmt = (n: number) => n.toLocaleString("en-US");

type RecipeRightProps = {
  meal: Meal;
  recipe: Recipe;
  servings: number;
  onServingsChange: (next: number) => void;
  onComplete: () => void;
};

export default function RecipeRight({
  meal,
  recipe,
  servings,
  onServingsChange,
  onComplete,
}: RecipeRightProps) {
  const [tab, setTab] = useState<"steps" | "ingredients">("steps");
  // current = abhi kaun sa step chal raha hai. Isse pehle ke saare steps done hain.
  // current == steps.length ka matlab poori recipe done.
  const [current, setCurrent] = useState(0);
  const [alertTick, setAlertTick] = useState(0); // 0 = alert nahi dikhana
  const [groceryNote, setGroceryNote] = useState<{ text: string } | null>(null);

  const { steps, ingredients } = recipe;
  const doneCount = Math.min(current, steps.length);

  // Alert kuch der baad khud hat jaye
  useEffect(() => {
    if (alertTick === 0) return;
    const t = setTimeout(() => setAlertTick(0), ALERT_MS);
    return () => clearTimeout(t);
  }, [alertTick]);

  // Grocery wala message bhi kuch der baad hat jaye
  useEffect(() => {
    if (!groceryNote) return;
    const t = setTimeout(() => setGroceryNote(null), NOTE_MS);
    return () => clearTimeout(t);
  }, [groceryNote]);

  // Step par click: pichle steps done, ye active. Active step par dobara click = ye done, agla active.
  const handleStep = (i: number) => {
    setCurrent(i === current ? i + 1 : i);
  };

  const handleComplete = () => {
    setCurrent(steps.length);
    setAlertTick((n) => n + 1);
    onComplete();
  };

  // Jo ingredients grocery list mein pehle se nahi hain, wo "From recipes" mein jud jati hain
  const handleAddMissing = () => {
    const { added, skipped } = addRecipeItems(ingredients, servings);

    if (added === 0) {
      setGroceryNote({ text: "Everything here is already on your grocery list." });
      return;
    }

    setGroceryNote({
      text: `${added} ${added === 1 ? "ingredient" : "ingredients"} added to your grocery list${
        skipped > 0 ? ` · ${skipped} already there` : ""
      }.`,
    });
  };

  return (
    <div className="grid gap-[18px] content-start ">
      {/* article 1 */}
      <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
        <div className="flex items-center gap-[14px]">
          <div
            className="relative overflow-hidden w-[84px] h-[84px] flex-none rounded-full after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_25%,_rgba(255,255,255,.55),_transparent_45%)]"
            style={{ background: mealBackground(meal.colors) }}
          />
          <div className="min-w-0">
            <h3
              className={`${bricolage.className} text-[#1D2A22] text-[22px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
            >
              {meal.name}
            </h3>
            <p className="text-[13px] mt-[4px] text-[#8E978F] ">{meal.desc}</p>
          </div>
        </div>
        <div className="mt-[16px] grid grid-cols-4 max-[600px]:grid-cols-2 gap-[8px]">
          <div className="bg-[#FFEFE7] rounded-[14px] py-[10px] px-[6px] text-center text-[11px] text-[#5B665F] ">
            <b
              className={`${bricolage.className} block text-[#1D2A22] text-[17px] tracking-[-.02em] tabular-nums`}
            >
              {fmt(meal.kcal * servings)}
            </b>
            kcal
          </div>
          <div className="bg-[#E9F6EC] rounded-[14px] py-[10px] px-[6px] text-center text-[11px] text-[#5B665F] ">
            <b
              className={`${bricolage.className} block text-[#1D2A22] text-[17px] tracking-[-.02em] tabular-nums`}
            >
              {fmt(meal.p * servings)}g
            </b>
            Protein
          </div>
          <div className="bg-[#E7F3FC] rounded-[14px] py-[10px] px-[6px] text-center text-[11px] text-[#5B665F] ">
            <b
              className={`${bricolage.className} block text-[#1D2A22] text-[17px] tracking-[-.02em] tabular-nums`}
            >
              {fmt(meal.c * servings)}g
            </b>
            Carbs
          </div>
          <div className="bg-[#FFF3CF] rounded-[14px] py-[10px] px-[6px] text-center text-[11px] text-[#5B665F] ">
            <b
              className={`${bricolage.className} block text-[#1D2A22] text-[17px] tracking-[-.02em] tabular-nums`}
            >
              {fmt(meal.f * servings)}g
            </b>
            Fat
          </div>
        </div>
        <div className="flex items-center justify-between mt-[14px] text-[13px] text-[#8E978F] flex-wrap gap-[8px] ">
          <span className="flex gap-[6px] items-center ">
            <Clock size={14} />
            {meal.mins} min
          </span>
          <span className="flex gap-[6px] items-center ">
            <ChefHat size={14} />
            {recipe.level}
          </span>
          <span className="flex gap-[8px] items-center ">
            <Users2 size={14} />
            <span className="flex gap-[4px] ">
              <button
                type="button"
                aria-label="Fewer servings"
                disabled={servings <= MIN_SERVINGS}
                onClick={() =>
                  onServingsChange(Math.max(MIN_SERVINGS, servings - 1))
                }
                className="w-[26px] h-[26px] rounded-[8px] border border-[#1d2a2224] grid place-items-center text-[14px] leading-[1] cursor-pointer transition-colors duration-200 hover:bg-[#f2f5f2] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                -
              </button>
            </span>
            <b className="tabular-nums text-[#1D2A22]">{servings}</b>
            {servings === 1 ? "Serving" : "Servings"}
            <span className="flex gap-[4px] ">
              <button
                type="button"
                aria-label="More servings"
                disabled={servings >= MAX_SERVINGS}
                onClick={() =>
                  onServingsChange(Math.min(MAX_SERVINGS, servings + 1))
                }
                className="w-[26px] h-[26px] rounded-[8px] border border-[#1d2a2224] grid place-items-center text-[14px] leading-[1] cursor-pointer transition-colors duration-200 hover:bg-[#f2f5f2] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                +
              </button>
            </span>
          </span>
        </div>
      </article>

      {/* article 2 */}
      <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
        <div className="flex items-center gap-[10px] mb-[16px] flex-wrap">
          <div className="inline-flex bg-[#F2F5F2] rounded-[999px] gap-[2px] p-[3px] ">
            <button
              type="button"
              onClick={() => setTab("steps")}
              className={`py-[6px] px-[13px] rounded-full text-[13px] transition-all duration-250 cursor-pointer ${
                tab === "steps"
                  ? "bg-white text-[#1d2a22] shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
                  : "text-[#5B665F]"
              }`}
            >
              Cooking Steps
            </button>
            <button
              type="button"
              onClick={() => setTab("ingredients")}
              className={`py-[6px] px-[13px] rounded-full text-[13px] transition-all duration-250 cursor-pointer ${
                tab === "ingredients"
                  ? "bg-white text-[#1d2a22] shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
                  : "text-[#5B665F]"
              }`}
            >
              Ingredients
            </button>
          </div>
          <div className="ml-auto flex gap-[8px] items-center ">
            <span className="text-[12.5px] text-[#8E978F] ">
              {tab === "steps"
                ? `${doneCount}/${steps.length} done`
                : `${ingredients.length} items`}
            </span>
          </div>
        </div>

        {tab === "steps" ? (
          steps.length === 0 ? (
            <p className="text-[13.5px] text-[#8E978F] py-[8px]">
              Steps for this recipe are coming soon.
            </p>
          ) : (
            <div className="grid gap-[8px]">
              {steps.map((step, i) => {
                const done = i < current;
                const active = i === current;

                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => handleStep(i)}
                    className={`grid grid-cols-[30px_minmax(0,1fr)_auto] gap-3 items-center py-[10px] px-[12px] rounded-[14px] text-left w-full cursor-pointer transition-colors duration-250 ${
                      active ? "bg-[#E9F6EC]" : "bg-white hover:bg-[#F2F5F2]"
                    }`}
                  >
                    <span
                      className={`w-[28px] h-[28px] rounded-full border-[1.5px] grid place-items-center text-[12px] transition-colors ${
                        done
                          ? "bg-[#4E9E5C] border-[#4E9E5C] text-[#ffffff]"
                          : active
                            ? "border-[#4e9e5c] text-[#2e6b3e]"
                            : "border-[#1d2a2224]"
                      }`}
                    >
                      {done ? <Check size={14} /> : i + 1}
                    </span>
                    <span>
                      <b className="block text-[14px] font-[500] ">
                        {step.title}
                      </b>
                      <small className="text-[12px] text-[#8E978F] ">
                        {step.desc}
                      </small>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs py-1 px-2.5 rounded-full whitespace-nowrap transition-colors ${
                        active
                          ? "bg-[#E9F6EC] text-[#2E6B3E]"
                          : "bg-[#F2F5F2] text-[#5B665F]"
                      }`}
                    >
                      <Clock size={11} />
                      {step.mins} min
                    </span>
                  </button>
                );
              })}
            </div>
          )
        ) : (
          <div>
            {ingredients.map((ing) => (
              <div
                key={ing.name}
                className="flex items-center gap-[10px] py-[9px] px-[4px] border-b border-[#1d2a2214] text-[14px]"
              >
                <span className="w-[8px] h-[8px] rounded-full bg-[#4E9E5C] flex-none"></span>
                <span>{ing.name}</span>
                <span className="ml-auto text-[#5B665F] tabular-nums whitespace-nowrap">
                  {ing.qty !== undefined && fmtQty(ing.qty * servings)}
                  {ing.qty !== undefined && ing.unit ? " " : ""}
                  {ing.unit}
                </span>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddMissing}
              className="mt-[12px] py-[7px] px-[13px] text-[13px] bg-[#E9F6EC] text-[#2E6B3E] inline-flex items-center gap-[8px] rounded-[999px] font-[500] cursor-pointer transition-[transform,box-shadow,background] duration-[250ms] ease-[var(--ease)] whitespace-nowrap "
            >
              <ShoppingCart size={14} />
              Add missing to grocery list
            </button>
            {groceryNote && (
              <p
                role="status"
                className="mt-[10px] text-[12.5px] text-[#2E6B3E] animate-[fade_250ms]"
              >
                {groceryNote.text}{" "}
                <Link href="/smart-grocery" className="font-[500] underline">
                  View list
                </Link>
              </p>
            )}
          </div>
        )}
      </article>

      <button
        type="button"
        onClick={handleComplete}
        className="bg-[#2e6b3e] text-white shadow-[0_10px_24px_-12px_rgba(46,107,62,0.6)] p-[15px] inline-flex items-center justify-center gap-2 rounded-full font-medium text-sm cursor-pointer transition-[transform,box-shadow,background] duration-250 ease-[var(--ease)] whitespace-nowrap"
      >
        <Check size={16} />
        Complete recipe & log meal
      </button>

      {/* Alert: screen ke neeche beech mein fixed, page ko nahi hilata */}

      {alertTick > 0 &&
        createPortal(
          <div className="fixed right-[30px] bottom-[24px] z-[110] px-[16px] pointer-events-none">
            <div
              key={alertTick}
              role="status"
              className="pointer-events-auto flex items-center gap-[10px] w-max max-w-[min(520px,calc(100vw-32px))] bg-[#E9F6EC] border border-[#4E9E5C]/40 text-[#2E6B3E] rounded-[16px] py-[12px] px-[14px] text-[14px] font-[500] shadow-[0_18px_40px_-18px_rgba(29,42,34,0.35)] animate-[popin_.35s_var(--ease)]"
            >
              <span className="w-[24px] h-[24px] rounded-full bg-[#4E9E5C] text-white grid place-items-center flex-none">
                <Check size={14} />
              </span>
              {meal.name} complete and logged.
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}