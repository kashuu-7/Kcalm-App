"use client";

import { ArrowLeftRight, Check, Clock, Play, X } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import { mealBackground } from "../dashboard/mealData";
import { useMeals } from "../dashboard/MealsContext";
import { useTargets } from "../profile/useTargets"; // BADLA HUA: naya import

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

// BADLA HUA: yahan ke 4 fixed targets (2280, 140, 277, 68) hata diye gaye hain.
// Ab ye component ke andar useTargets() se aate hain.

export default function MealsLeft() {
  const {
    slots,
    meals,
    logged,
    snacks,
    activeIndex,
    dayTitle,
    error,
    retry,
    toggleLogged,
    openSwap,
    removeSnack,
  } = useMeals();

  // BADLA HUA: targets calibration se aate hain
  const targets = useTargets();
  const DAILY_TARGET = targets.calories;
  const PROTEIN_TARGET = targets.proteinG;
  const CARBS_TARGET = targets.carbG;
  const FAT_TARGET = targets.fatG;

  const [mounted, setMounted] = useState(false);

  // Pehli baar bars 0 se apni value tak uthen
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Din ke saare meals + snacks ka total
  const totals = [...meals, ...snacks].reduce(
    (t, m) => ({
      kcal: t.kcal + m.kcal,
      p: t.p + m.p,
      c: t.c + m.c,
      f: t.f + m.f,
    }),
    { kcal: 0, p: 0, c: 0, f: 0 },
  );

  const diff = totals.kcal - DAILY_TARGET;
  const withinRange = Math.abs(diff) <= DAILY_TARGET * 0.05;

  // Plan vs. targets ki rows
  const rows = [
    {
      label: "Calories",
      value: totals.kcal,
      target: DAILY_TARGET,
      unit: "kcal",
      bar: "bg-[#e8895f]",
    },
    {
      label: "Protein",
      value: totals.p,
      target: PROTEIN_TARGET,
      unit: "g",
      bar: "bg-[#4E9E5C]",
    },
    {
      label: "Carbs",
      value: totals.c,
      target: CARBS_TARGET,
      unit: "g",
      bar: "bg-[#3F8FC4]",
    },
    {
      label: "Fat",
      value: totals.f,
      target: FAT_TARGET,
      unit: "g",
      bar: "bg-[#E8895F]",
    },
  ];

  return (
    <div className="grid gap-[18px] ">
      <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
        <div className="flex items-center gap-[10px] mb-[16px]">
          <h3
            className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            {dayTitle}
          </h3>
          <div className="ml-auto flex gap-[8px] items-center ">
            {withinRange ? (
              <span className="text-[#2E6B3E] bg-[#E9F6EC] inline-flex items-center justify-center gap-[6px] rounded-[999px] text-[12px] py-[4px] px-[10px] whitespace-nowrap ">
                <Check size={11} />
                Calories within ±5%
              </span>
            ) : (
              <span className="text-[#A4502B] bg-[#FFEFE7] inline-flex items-center justify-center gap-[6px] rounded-[999px] text-[12px] py-[4px] px-[10px] whitespace-nowrap ">
                {Math.abs(diff)} kcal {diff > 0 ? "over" : "under"} target
              </span>
            )}
          </div>
        </div>

        <div className="relative grid gap-[12px] ">
          {error && (
            <div role="alert" className="rounded-[14px] bg-[#FFEFE7] px-[14px] py-[12px] text-[13px] text-[#A4502B]">
              <p>{error}</p>
              <button type="button" onClick={retry} className="mt-[8px] font-medium underline underline-offset-2">
                Try again
              </button>
            </div>
          )}
          <span className="absolute left-[99px] max-sm:left-[75px] top-[30px] bottom-[30px] w-[2px] bg-[#D5EEDA] max-[600px]:hidden "></span>

          {meals.map((meal, i) => {
            const slot = slots[i];
            const isLogged = logged[i];
            const isActive = i === activeIndex;

            return (
              <div
                key={slot.id}
                className="grid max-[600px]:grid-cols-1 grid-cols-[78px_20px_minmax(0,1fr)] gap-3 items-center "
              >
                {/* Time */}
                <div className="text-right max-[600px]:text-left font-[500] text-[13.5px] max-[600px]:flex max-[600px]:items-baseline gap-[8px]  ">
                  {slot.time}{" "}
                  <small className="block text-[#8E978F] text-[11.5px]  ">
                    {slot.type}
                  </small>
                </div>

                {/* Dot */}
                <span
                  className={`relative w-[14px] h-[14px] rounded-[50%] border-[3px] z-[1] justify-self-center transition-colors duration-300 max-[600px]:hidden ${
                    isLogged
                      ? "bg-[#4E9E5C] border-[#4E9E5C]"
                      : isActive
                        ? "bg-white border-[#4E9E5C]"
                        : "bg-white border-[#D5EEDA]"
                  }`}
                ></span>

                {/* Card */}
                <div
                  className={`grid grid-cols-[72px_minmax(0,1fr)_auto_auto] max-sm:grid-cols-[56px_minmax(0,1fr)] gap-[14px] max-sm:gap-[10px] items-center bg-white border rounded-[18px] p-3 shadow-[var(--shadow)] transition-[transform,border-color] duration-300 ease-[var(--ease)] ${
                    isActive ? "border-[#4E9E5C]" : "border-[#1d2a2214]"
                  }`}
                >
                  <div
                    className="w-[72px] h-[60px] max-sm:w-[56px] max-sm:h-[52px] rounded-xl relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_25%,_rgba(255,255,255,.55),_transparent_45%)]"
                    style={{ background: mealBackground(meal.colors) }}
                  />

                  <div className="min-w-0">
                    <h4
                      className={`${bricolage.className} text-[15.5px] font-semibold tracking-[-.01em] leading-[1.1] text-balance`}
                    >
                      {meal.name}
                    </h4>
                    <p className="text-[12.5px] text-[#8E978F] whitespace-nowrap overflow-hidden text-ellipsis ">
                      {meal.desc}
                    </p>
                    <div className="flex mt-[6px] gap-[6px] flex-wrap">
                      <span className="bg-[#ffefe7] text-[#A4502B] inline-flex items-center gap-[6px] text-[12px] py-[4px] px-[10px] rounded-[999px] whitespace-nowrap ">
                        {meal.kcal} kcal
                      </span>

                      {isLogged ? (
                        <span className="bg-[#E9F6EC] text-[#2E6B3E] inline-flex items-center gap-[6px] text-[12px] py-[4px] px-[10px] rounded-[999px] whitespace-nowrap ">
                          <Check size={11} /> Eaten
                        </span>
                      ) : isActive ? (
                        <span className="bg-[#e8895f] text-white inline-flex items-center gap-[6px] text-[12px] py-[4px] px-[10px] rounded-[999px] whitespace-nowrap ">
                          Up next
                        </span>
                      ) : (
                        <span className="bg-[#F2F5F2] text-[#5B665F] inline-flex items-center gap-[6px] text-[12px] py-[4px] px-[10px] rounded-[999px] whitespace-nowrap ">
                          Planned
                        </span>
                      )}

                      <span className="bg-[#F2F5F2] text-[#5B665F] inline-flex items-center gap-[6px] text-[12px] py-[4px] px-[10px] rounded-[999px] whitespace-nowrap ">
                        <Clock size={11} /> {meal.mins} min
                      </span>
                    </div>
                  </div>

                  <div className="text-[12px] text-[#8E978F] text-right leading-[1.5] tabular-nums max-sm:col-span-2 max-sm:text-left max-sm:flex max-sm:gap-[12px] max-sm:flex-wrap">
                    <span>
                      <b className="font-[500] text-[#1D2A22] ">{meal.p}g</b>{" "}
                      protein
                    </span>
                    <br className="max-sm:hidden" />
                    <span>
                      <b className="font-[500] text-[#1D2A22] ">{meal.c}g</b>{" "}
                      carbs
                    </span>
                    <br className="max-sm:hidden" />
                    <span>
                      <b className="font-[500] text-[#1D2A22] ">{meal.f}g</b>{" "}
                      fat
                    </span>
                  </div>

                  <div className="flex gap-[6px] max-sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => openSwap(i)}
                      aria-label="Swap meal"
                      className="w-[34px] h-[34px] rounded-full grid place-items-center border border-[#1d2a2224] bg-white flex-none transition-colors duration-200 cursor-pointer hover:bg-[#f2f5f2]"
                    >
                      <ArrowLeftRight size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleLogged(i)}
                      aria-pressed={isLogged}
                      aria-label={
                        isLogged ? "Mark as not eaten" : "Mark as eaten"
                      }
                      className={`w-[34px] h-[34px] rounded-full grid place-items-center border flex-none transition-colors duration-200 cursor-pointer ${
                        isLogged
                          ? "text-[#ffffff] border-transparent bg-[#4E9E5C]"
                          : "bg-white border-[#1d2a2224] hover:bg-[#f2f5f2]"
                      }`}
                    >
                      <Check size={15} />
                    </button>
                    <Link
                      href="/recipe-player"
                      aria-label="Open recipe"
                      className="w-[34px] h-[34px] rounded-full grid place-items-center border border-[#1d2a2224] bg-white flex-none transition-colors duration-200 hover:bg-[#f2f5f2]"
                    >
                      <Play size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Added snacks */}
          {snacks.map((snack) => (
            <div
              key={snack.id}
              className="grid grid-cols-[78px_20px_minmax(0,1fr)] max-sm:grid-cols-[56px_16px_minmax(0,1fr)] gap-3 items-center "
            >
              <div className="text-right font-[500] text-[12.5px] max-sm:text-[11.5px]">
                Added{" "}
                <small className="block text-[#8E978F] text-[11.5px] max-sm:text-[10.5px] ">
                  Snack
                </small>
              </div>

              <span className="relative w-[14px] h-[14px] rounded-[50%] border-[3px] z-[1] justify-self-center bg-[#4E9E5C] border-[#4E9E5C]"></span>

              <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] max-sm:grid-cols-[minmax(0,1fr)_auto] gap-[14px] max-sm:gap-[10px] items-center bg-white border border-[#1d2a2214] rounded-[18px] p-3 shadow-[var(--shadow)]">
                <div className="min-w-0">
                  <h4
                    className={`${bricolage.className} text-[15.5px] font-semibold tracking-[-.01em] leading-[1.1] text-balance`}
                  >
                    {snack.name}
                  </h4>
                  <div className="flex mt-[6px] gap-[6px] flex-wrap">
                    <span className="bg-[#ffefe7] text-[#A4502B] inline-flex items-center gap-[6px] text-[12px] py-[4px] px-[10px] rounded-[999px] whitespace-nowrap ">
                      {snack.kcal} kcal
                    </span>
                  </div>
                </div>

                <div className="text-[12px] text-[#8E978F] text-right leading-[1.5] tabular-nums max-sm:col-span-2 max-sm:order-3 max-sm:text-left max-sm:flex max-sm:gap-[12px] max-sm:flex-wrap">
                  <span>
                    <b className="font-[500] text-[#1D2A22] ">{snack.p}g</b>{" "}
                    protein
                  </span>
                  <br className="max-sm:hidden" />
                  <span>
                    <b className="font-[500] text-[#1D2A22] ">{snack.c}g</b>{" "}
                    carbs
                  </span>
                  <br className="max-sm:hidden" />
                  <span>
                    <b className="font-[500] text-[#1D2A22] ">{snack.f}g</b>{" "}
                    fat
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeSnack(snack.id)}
                  aria-label="Remove snack"
                  className="w-[34px] h-[34px] rounded-full grid place-items-center border border-[#1d2a2224] bg-white flex-none transition-colors duration-200 cursor-pointer hover:bg-[#f2f5f2]"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
        <div className="flex items-center gap-[10px] max-sm:flex-wrap mb-[16px]">
          <h3
            className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            Plan vs. targets
          </h3>
          <div className="ml-auto flex gap-[8px] items-center ">
            <span className="text-[#8E978F] text-[12.5px] ">
              Based on {meals.length} meals
              {snacks.length > 0 &&
                ` + ${snacks.length} ${snacks.length === 1 ? "snack" : "snacks"}`}
            </span>
          </div>
        </div>
        <div className="grid gap-[14px] ">
          {rows.map((row) => {
            const percent = Math.min(100, (row.value / row.target) * 100);

            return (
              <div key={row.label}>
                <div className="flex justify-between text-[13.5px] mb-[6px]">
                  <span>{row.label}</span>
                  <span className="tabular-nums">
                    <b>{row.value.toLocaleString("en-US")}</b>{" "}
                    <span className="text-[#8E978F]">
                      / {row.target.toLocaleString("en-US")} {row.unit}
                    </span>
                  </span>
                </div>
                <div className="h-[7px] rounded-[6px] bg-[#F2F5F2] overflow-hidden">
                  <i
                    className={`block ${row.bar} h-full rounded-[6px] transition-[width] duration-[1200ms] ease-[var(--ease)]`}
                    style={{ width: mounted ? `${percent}%` : "0%" }}
                  ></i>
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </div>
  );
}
