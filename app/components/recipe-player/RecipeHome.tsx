"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RecipeLeft from "./RecipeLeft";
import RecipeRight from "./RecipeRight";
import Confetti from "./Confetti";
import { useMeals } from "../dashboard/MealsContext";
import type { Meal } from "../dashboard/mealData";
import type { Recipe } from "./recipeData";
import {
  fetchPreviewMeal,
  fetchRecipeForPlayer,
  recordRecipeCompleted,
} from "../../lib/api/recipes";

// Recipe aane tak (ya na aaye to) khali recipe
const NO_RECIPE: Recipe = { videoId: "", level: "Easy", steps: [], ingredients: [] };

export default function RecipeHome() {
  const router = useRouter();
  // Search se aayi recipe: /recipe-player?recipe=<id>
  const wanted = useSearchParams().get("recipe");

  // Recipe Player hamesha aaj ke meals dikhata hai
  const { slots, meals, logged, toggleLogged } = useMeals("today");
  const [slotIndex, setSlotIndex] = useState(0);
  const [servings, setServings] = useState(1);
  const [burst, setBurst] = useState(0); // confetti chalane ke liye
  const [loaded, setLoaded] = useState<{ id: string; recipe: Recipe } | null>(null);
  const [preview, setPreview] = useState<Meal | null>(null); // plan ke bahar ki recipe

  const mealsKey = meals.map((m) => m.id).join(",");

  // ?recipe= aaye to: plan mein ho to uska slot, warna preview
  useEffect(() => {
    if (!wanted) {
      setPreview(null);
      return;
    }
    const i = meals.findIndex((m) => m.id === wanted);
    if (i >= 0) {
      setPreview(null);
      setSlotIndex(i);
      setServings(1);
      return;
    }
    let cancelled = false;
    fetchPreviewMeal(wanted)
      .then((m) => {
        if (!cancelled) {
          setPreview(m);
          setServings(1);
        }
      })
      .catch(() => {
        /* recipe nahi mili to plan wala meal hi dikhta rahe */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wanted, mealsKey]);

  const meal = preview ?? meals[slotIndex];
  // "none-..." wala meal asli nahi hota (plan nahi bana / abhi load ho raha hai)
  const isReal = !meal.id.startsWith("none-");

  // Meal badle to backend se uski recipe (steps aur ingredients) lao
  useEffect(() => {
    if (!isReal) return;
    let cancelled = false;
    fetchRecipeForPlayer(meal.id)
      .then((recipe) => {
        if (!cancelled) setLoaded({ id: meal.id, recipe });
      })
      .catch(() => {
        /* recipe nahi aayi to khali dikhegi */
      });
    return () => {
      cancelled = true;
    };
  }, [meal.id, isReal]);

  const ready = loaded !== null && loaded.id === meal.id;
  const recipe = ready ? loaded.recipe : NO_RECIPE;

  const selectSlot = (i: number) => {
    setPreview(null);
    setSlotIndex(i);
    setServings(1); // doosre meal par servings wapas 1
    if (wanted) router.replace("/recipe-player"); // URL se ?recipe= hata do
  };

  // Recipe complete: confetti + backend mein record. Plan wala meal ho to tick bhi.
  const handleComplete = () => {
    if (!preview && !logged[slotIndex]) toggleLogged(slotIndex);
    setBurst((b) => b + 1);
    if (isReal) {
      void recordRecipeCompleted(meal.id, servings).catch(() => {
        /* record nahi hua, user ko koi farq nahi padta */
      });
    }
  };

  return (
    <main>
      <Confetti trigger={burst} />
      <div className="grid gap-[18px] animate-[viewin_500ms_var(--ease)]">
        <div className="flex gap-[10px] flex-wrap items-center">
          <span className="text-[11px] tracking-[.08em] uppercase text-[#8E978F] ">
            Cooking
          </span>
          <div className="inline-flex bg-[#F2F5F2] rounded-[999px] gap-[2px] p-[3px] max-w-full overflow-x-auto">
            {slots.map((slot, i) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => selectSlot(i)}
                aria-pressed={!preview && i === slotIndex}
                className={`py-[6px] px-[13px] rounded-full text-[13px] transition-all duration-250 cursor-pointer whitespace-nowrap inline-flex items-center gap-[6px] ${
                  !preview && i === slotIndex
                    ? "bg-white text-[#1d2a22] shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
                    : "text-[#5B665F]"
                }`}
              >
                {slot.type}
              </button>
            ))}
          </div>
        </div>

        {preview && (
          <p className="rounded-[12px] bg-[#F2F5F2] px-[14px] py-[10px] text-[13px] text-[#5B665F]">
            Previewing a recipe from search. It isn&apos;t in today&apos;s plan,
            so completing it won&apos;t tick a meal.
          </p>
        )}

        <div className="grid grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] max-[940px]:grid-cols-1 items-start gap-[18px]">
          <RecipeLeft meal={meal} recipe={recipe} servings={servings} />
          {/* key badalne se meal badalte hi (ya recipe aate hi) steps aur tab reset ho jate hain */}
          <RecipeRight
            key={`${meal.id}:${ready ? "ready" : "loading"}`}
            meal={meal}
            recipe={recipe}
            servings={servings}
            onServingsChange={setServings}
            onComplete={handleComplete}
          />
        </div>
      </div>
    </main>
  );
}