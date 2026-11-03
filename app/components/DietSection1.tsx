"use client";
import { useState } from "react";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const diets = [
  {
    name: "Balanced",
    color: "#5fae6e",
    kcal: "1,850 kcal",
    meals: [
      ["Breakfast", "Overnight oats & berries", "340 kcal"],
      ["Lunch", "Lemon chickpea salad", "480 kcal"],
      ["Snack", "Apple & peanut butter", "210 kcal"],
      ["Dinner", "Chicken karahi, light", "620 kcal"],
    ],
    macros: ["P 125g", "C 180g", "F 60g"],
  },
  {
    name: "High-protein",
    color: "#F4A07E",
    kcal: "2,050 kcal",
    meals: [
      ["Breakfast", "Egg white & spinach wrap", "380 kcal"],
      ["Lunch", "Grilled chicken quinoa bowl", "560 kcal"],
      ["Snack", "Greek yogurt & seeds", "240 kcal"],
      ["Dinner", "Lemon herb fish, greens", "590 kcal"],
    ],
    macros: ["P 170g", "C 170g", "F 65g"],
  },
  {
    name: "Vegetarian",
    color: "#8BC98A",
    kcal: "1,800 kcal",
    meals: [
      ["Breakfast", "Paneer bhurji toast", "390 kcal"],
      ["Lunch", "Rajma & brown rice", "520 kcal"],
      ["Snack", "Roasted chana", "180 kcal"],
      ["Dinner", "Halloumi veg traybake", "560 kcal"],
    ],
    macros: ["P 95g", "C 210g", "F 62g"],
  },
  {
    name: "Keto",
    color: "#E7C45A",
    kcal: "1,750 kcal",
    meals: [
      ["Breakfast", "Avocado & egg bowl", "420 kcal"],
      ["Lunch", "Chicken caesar, no croutons", "510 kcal"],
      ["Snack", "Cheese & olives", "220 kcal"],
      ["Dinner", "Butter salmon, asparagus", "600 kcal"],
    ],
    macros: ["P 110g", "C 30g", "F 130g"],
  },
  {
    name: "Mediterranean",
    color: "#3A7AA3",
    kcal: "1,850 kcal",
    meals: [
      ["Breakfast", "Greek yogurt, honey, walnuts", "350 kcal"],
      ["Lunch", "Tuna, bean & herb salad", "470 kcal"],
      ["Snack", "Hummus & cucumber", "200 kcal"],
      ["Dinner", "Baked cod, tomato & olives", "610 kcal"],
    ],
    macros: ["P 105g", "C 190g", "F 72g"],
  },
  {
    name: "Desi Chicken",
    color: "#D9826A",
    kcal: "1,850 kcal",
    meals: [
      ["Breakfast", "Vegetable omelette & roti", "380 kcal"],
      ["Lunch", "Moong daal & salad", "450 kcal"],
      ["Snack", "Fruit chaat", "190 kcal"],
      ["Dinner", "chicken tikka, raita", "640 kcal"],
    ],
    macros: ["P 115g", "C 195g", "F 64g"],
  },
  {
    name: "Low-carb",
    color: "#6457B0",
    kcal: "1,750 kcal",
    meals: [
      ["Breakfast", "Cottage cheese & berries", "300 kcal"],
      ["Lunch", "Turkey lettuce wraps", "460 kcal"],
      ["Snack", "Boiled eggs ", "160 kcal"],
      ["Dinner", "Beef & broccoli stir-fry", "620 kcal"],
    ],
    macros: ["P 135g", "C 80g", "F 95g"],
  },
  {
    name: "Vegan",
    color: "#5FAE6E",
    kcal: "1,800 kcal",
    meals: [
      ["Breakfast", "Chia pudding & mango", "330 kcal"],
      ["Lunch", "Chickpea shawarma bowl", "540 kcal"],
      ["Snack", "Edamame", "190 kcal"],
      ["Dinner", "Tofu teriyaki bowl", "560 kcal"],
    ],
    macros: ["P 90g", "C 230g", "F 58g"],
  },
];

export default function DietSection1() {
  const [activeDiet, setActiveDiet] = useState("Balanced");

  const activeDietData = diets.find((diet) => diet.name === activeDiet)!;

  return (
    <section id="diets" className="pt-0 py-[clamp(72px,10vw,128px)]">
      <div className="grid grid-cols-[1.1fr_.9fr] max-[940px]:grid-cols-1 gap-[clamp(24px,4vw,48px)] items-start">
        <div className="transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-[160ms]">
          <span className="block mb-[14px] text-[12px] tracking-[.08em] uppercase text-[#8E978F]">
            Made for you
          </span>
          <h2
            className={`${bricolage.className} text-[clamp(34px,5vw,60px)] font-semibold tracking-[-0.035em] leading-[1.02] m-0 text-balance`}
          >
            Every way of eating,
            <span className={`${serif.className} tracking-[-.01em] `}>
              in one place.
            </span>
          </h2>
          <p className="text-[clamp(16px,1.4vw,18px)] max-w-[620px] text-[#5B665F] mt-[18px]">
            Pick your style and Kcalm builds around it. Tap one to preview a
            sample day.
          </p>
          <div className="flex flex-wrap gap-[10px] max-sm:gap-[8px] mt-[28px] max-sm:mt-[22px]">
            {diets.map((diet) => (
              <button
                key={diet.name}
                onClick={() => setActiveDiet(diet.name)}
                className={`box-border cursor-pointer py-[11px] px-[18px] max-sm:py-[9px] max-sm:px-[14px] rounded-full border border-[#1d2a2224] text-[15px] max-sm:text-[14px] inline-flex items-center gap-[8px] transition-all duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${
                  activeDiet === diet.name
                    ? "bg-[#2e6b3e] text-white border-transparent"
                    : "bg-white"
                }`}
              >
                <i
                  className="w-[9px] h-[9px] rounded-[50%]"
                  style={{ backgroundColor: diet.color }}
                ></i>

                {diet.name}
              </button>
            ))}
          </div>
          <div className="mt-[28px] max-sm:mt-[22px] py-[18px] px-[20px] max-sm:py-[14px] max-sm:px-[14px] rounded-[20px] bg-[#FCE4EA] flex flex-wrap gap-[8px] items-center text-[14px]">
            <b className="mr-[4px] font-[500]">Leave out</b>
            <span className="py-[5px] px-[11px] rounded-[999px] bg-[#ffffff] text-[13px] text-[#5b665f]">
              Nuts
            </span>
            <span className="py-[5px] px-[11px] rounded-[999px] bg-[#ffffff] text-[13px] text-[#5b665f]">
              Dairy
            </span>
            <span className="py-[5px] px-[11px] rounded-[999px] bg-[#ffffff] text-[13px] text-[#5b665f]">
              Gluten
            </span>
            <span className="py-[5px] px-[11px] rounded-[999px] bg-[#ffffff] text-[13px] text-[#5b665f]">
              Eggs
            </span>
            <span className="py-[5px] px-[11px] rounded-[999px] bg-[#ffffff] text-[13px] text-[#5b665f]">
              Shellfish
            </span>
            <span className="py-[5px] px-[11px] rounded-[999px] bg-[#ffffff] text-[13px] text-[#5b665f]">
              Soy
            </span>
          </div>
        </div>
        <aside
          key={activeDiet}
          className="rounded-[28px] bg-white border border-[#1d2a2214] shadow-[var(--shadow)] p-[24px] max-sm:p-[16px] animate-[dietChange_.45s_ease-out]"
        >
          <div className="flex items-baseline mb-[16px] justify-between max-sm:flex-wrap max-sm:gap-x-[10px]">
            <h3
              className={`${bricolage.className} text-[22px] max-sm:text-[20px] font-semibold tracking-[-.02em] leading-[1.02] m-0 text-balance`}
            >
              {activeDietData.name} day
            </h3>

            <span className="text-[12px] tracking-[.08em] uppercase text-[#8E978F]">
              {activeDietData.kcal}
            </span>
          </div>
          <div className="grid gap-[10px] max-sm:gap-[8px]">
            {activeDietData.meals.map(([type, meal, kcal]) => (
              <div
                key={type}
                className="grid grid-cols-[86px_1fr_auto] max-sm:grid-cols-[64px_1fr_auto] gap-[12px] max-sm:gap-[8px] items-center p-[14px] max-sm:p-[10px] rounded-[16px] bg-[#FAFBFA] max-sm:text-[13px] transition-[opacity,transform] duration-300"
              >
                <span className="text-[10.5px] max-sm:text-[9.5px] tracking-[.08em] uppercase text-[#8E978F]">
                  {type}
                </span>

                <span>{meal}</span>

                <span className="text-[12px] max-sm:text-[11px] text-[#5B665F] whitespace-nowrap">
                  {kcal}
                </span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-[8px] mt-[16px]">
            <span className="py-[6px] px-[11px] rounded-[999px] bg-[#E9F6EC] text-[12px] text-[#2E6B3E]">
              {activeDietData.macros[0]}
            </span>

            <span className="py-[6px] px-[11px] rounded-[999px] bg-[#FFF3CF] text-[12px] text-[#7A5B10]">
              {activeDietData.macros[1]}
            </span>

            <span className="py-[6px] px-[11px] rounded-[999px] bg-[#FFEFE7] text-[12px] text-[#A4502B]">
              {activeDietData.macros[2]}
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}