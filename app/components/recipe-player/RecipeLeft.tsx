"use client";

import React, { useEffect, useState } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { mealBackground, type Meal } from "../dashboard/mealData";
import { type Recipe } from "./recipeData";
import { useTargets } from "../profile/useTargets";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

type RecipeLeftProps = {
  meal: Meal;
  recipe: Recipe;
  servings: number;
};

export default function RecipeLeft({ meal, recipe, servings }: RecipeLeftProps) {
  const t = useTargets();
  const TARGETS = { kcal: t.calories, p: t.proteinG, c: t.carbG, f: t.fatG };
  const [mounted, setMounted] = useState(false);

  // Pehli baar bars 0 se apni value tak uthen
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Is meal ka hissa poore din ke targets mein (servings ke hisab se)
  const goals = [
    { label: "Calories", value: meal.kcal * servings, target: TARGETS.kcal, unit: " kcal", box: "bg-[#ffefe7]", bar: "bg-[#E8895F]" },
    { label: "Protein", value: meal.p * servings, target: TARGETS.p, unit: "g", box: "bg-[#E9F6EC]", bar: "bg-[#4E9E5C]" },
    { label: "Carbs", value: meal.c * servings, target: TARGETS.c, unit: "g", box: "bg-[#E7F3FC]", bar: "bg-[#3F8FC4]" },
    { label: "Fat", value: meal.f * servings, target: TARGETS.f, unit: "g", box: "bg-[#FFF3CF]", bar: "bg-[#E8895F]" },
  ];

  return (
    <div className="grid gap-[18px] content-start ">
      <div className="relative rounded-[24px] overflow-hidden aspect-[16/10] max-w-full bg-[radial-gradient(120%_90%_at_50%_110%,_#F7E6D2_0_40%,_transparent_41%),linear-gradient(180deg,#FBF6EF,#F4EBDF)] shadow-[var(--shadow)]">
        {recipe.videoId ? (
          <iframe
            key={recipe.videoId}
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${recipe.videoId}`}
            title={`${meal.name} recipe video`}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        ) : (
          // Video id abhi nahi lagi, to YouTube search ka card
          <div
            className="absolute inset-0 grid place-items-center text-center p-[20px]"
            style={{ background: mealBackground(meal.colors) }}
          >
            <div className="bg-white/90 backdrop-blur-[8px] rounded-[18px] py-[16px] px-[20px] shadow-[var(--shadow)] max-w-[300px]">
              <h4
                className={`${bricolage.className} text-[17px] font-semibold tracking-[-.02em] leading-[1.1] text-balance`}
              >
                {meal.name}
              </h4>
              <p className="text-[12.5px] text-[#8E978F] mt-[4px]">
                Video for this recipe isn't added yet.
              </p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                  `${meal.name} recipe`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-[10px] inline-flex items-center gap-[6px] bg-[#2e6b3e] text-white text-[13px] font-[500] py-[8px] px-[14px] rounded-full"
              >
                Watch on YouTube
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}
      </div>

      <article className="bg-white border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
        <div className="flex items-center gap-[10px] mb-[16px]">
          <h3
            className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            Your daily goal match
          </h3>
          <div className="ml-auto flex gap-[8px] items-center ">
            <Link
              href="/daily-plan"
              className="text-[#2E6B3E] font-[500] text-[13.5px] inline-flex items-center gap-[4px] hover:underline "
            >
              View full plan
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-4 max-sm:grid-cols-2 gap-[10px]">
          {goals.map((g) => {
            const pct = (g.value / g.target) * 100;

            return (
              <div
                key={g.label}
                className={`${g.box} rounded-[14px] p-[12px] text-[12px] text-[#5B665F] `}
              >
                {g.label}
                <div
                  className={`${bricolage.className} text-[#1D2A22] text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
                >
                  {g.value.toLocaleString("en-US")}{" "}
                  <span className="text-[#8E978F] text-[12px] ">
                    / {g.target.toLocaleString("en-US")}
                    {g.unit}
                  </span>
                </div>
                {/* Bar */}
                <div className="h-[4px] bg-[#F2F5F2] rounded-[6px] overflow-hidden mt-[6px]">
                  <i
                    className={`block h-full rounded-[6px] ${g.bar} transition-[width] duration-[1200ms] ease-[var(--ease)]`}
                    style={{ width: mounted ? `${Math.min(100, pct)}%` : "0%" }}
                  ></i>
                </div>
                <div className="mt-[4px]">{Math.round(pct)}% of day</div>
              </div>
            );
          })}
        </div>
      </article>
    </div>
  );
}