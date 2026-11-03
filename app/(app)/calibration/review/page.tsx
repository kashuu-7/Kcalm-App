"use client";

import { useProfile } from "../../../components/profile/ProfileContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import { calculateTargets, type Targets } from "../../../lib/api/nutrition";
import { userKey } from "../../../lib/userStorage";
import { ApiError } from "../../../lib/api/client";
import {
  Activity,
  Bone,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Heart,
  Leaf,
  Sun,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { ONBOARDING_STEPS } from "../../../components/dashboard/onboarding";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

/* ---------- config ---------- */

const CALIBRATION_KEY = "kcalm-calibration"; // step 1
const ABOUT_KEY = "kcalm-about"; // step 2
const TARGETS_KEY = "kcalm-targets"; // is page ka output
const AFTER_CONFIRM = "/daily-plan"; // confirm ke baad kahan jana hai

const ACTIVITY = {
  sedentary: { label: "sedentary", mult: 1.2 },
  light: { label: "light", mult: 1.375 },
  moderate: { label: "moderate", mult: 1.55 },
  active: { label: "very active", mult: 1.725 },
} as const;
type ActivityId = keyof typeof ACTIVITY;

const GOAL = {
  lose: { phrase: "lose fat", adj: -500, tag: "Gentle deficit" },
  maintain: { phrase: "maintain weight", adj: 0, tag: "Precision balanced" },
  build: { phrase: "build muscle", adj: 300, tag: "Lean surplus" },
} as const;
type GoalId = keyof typeof GOAL;

const PPK_MIN = 0.8;
const PPK_MAX = 3.0;

const BODY_DEFAULTS = {
  sex: "Male" as "Male" | "Female",
  age: 28,
  height: 175,
  weight: 70,
  target: 74,
};

const fmt = (n: number) => n.toLocaleString("en-US");
const num = (v: unknown, fallback: number) =>
  typeof v === "number" && Number.isFinite(v) ? v : fallback;

function readJSON(key: string) {
  try {
    const raw = localStorage.getItem(userKey(key));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* ---------- small pieces ---------- */

function Section({
  title,
  hint,
  tag,
  tagTone = "grey",
  children,
}: {
  title: string;
  hint: string;
  tag?: string;
  tagTone?: "grey" | "green";
  children: React.ReactNode;
}) {
  return (
    <section className="py-[22px] border-b border-[#1d2a2214] first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-start justify-between gap-[10px] mb-[14px]">
        <div>
          <h3
            className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1]`}
          >
            {title}
          </h3>
          <p className="text-[13px] text-[#8E978F] mt-[3px]">{hint}</p>
        </div>
        {tag && (
          <span
            className={`shrink-0 inline-flex items-center gap-[6px] rounded-full px-[10px] py-[4px] text-[11.5px] whitespace-nowrap ${
              tagTone === "green"
                ? "bg-[#E9F6EC] text-[#2E6B3E]"
                : "bg-[#F2F5F2] text-[#5B665F]"
            }`}
          >
            {tagTone === "green" && (
              <i className="w-[6px] h-[6px] rounded-full bg-[#4E9E5C]" />
            )}
            {tag}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}

const MACRO_TONES = {
  green: { box: "bg-[#EEF8F0] border-[#CFE9C8]", icon: "text-[#4E9E5C]" },
  blue: { box: "bg-[#EBF4FB] border-[#CFE3F5]", icon: "text-[#3F8FC4]" },
  orange: { box: "bg-[#FDF0E9] border-[#F7D3C0]", icon: "text-[#E8895F]" },
} as const;

function MacroCard({
  tone,
  Icon,
  label,
  pct,
  grams,
  note,
  kcal,
}: {
  tone: keyof typeof MACRO_TONES;
  Icon: LucideIcon;
  label: string;
  pct: number;
  grams: number;
  note: string;
  kcal: number;
}) {
  const t = MACRO_TONES[tone];
  return (
    <div className={`rounded-[18px] border p-[16px] ${t.box}`}>
      <div className="flex items-center justify-between gap-[8px]">
        <span className="flex items-center gap-[8px] text-[13.5px] font-medium">
          <Icon size={14} className={t.icon} />
          {label}
        </span>
        <span className="rounded-full bg-white/80 px-[8px] py-[2px] text-[11px] tabular-nums text-[#5B665F]">
          {pct}%
        </span>
      </div>
      <div className="mt-[12px] flex items-baseline gap-[5px]">
        <b
          className={`${bricolage.className} text-[32px] font-semibold tracking-[-.04em] tabular-nums`}
        >
          {fmt(grams)}
        </b>
        <small className="text-[12.5px] text-[#8E978F]">g / day</small>
      </div>
      <p className="mt-[6px] text-[12px] text-[#5B665F]">{note}</p>
      <p className="mt-[10px] text-[12px] text-[#8E978F] tabular-nums">
        {fmt(kcal)} kcal
      </p>
    </div>
  );
}

function MicroTile({
  Icon,
  label,
  value,
  bg,
}: {
  Icon: LucideIcon;
  label: string;
  value: string;
  bg: string;
}) {
  return (
    <div className={`flex items-center gap-[10px] rounded-[14px] p-[12px] ${bg}`}>
      <span className="w-[32px] h-[32px] shrink-0 rounded-[10px] bg-white/70 grid place-items-center text-[#1D2A22]">
        <Icon size={15} />
      </span>
      <span className="min-w-0">
        <small className="block text-[11.5px] text-[#5B665F] truncate">
          {label}
        </small>
        <b className="block text-[13.5px] font-semibold tabular-nums">{value}</b>
      </span>
    </div>
  );
}

const sliderCls =
  "h-[16px] w-full cursor-pointer appearance-none bg-transparent " +
  "[&::-webkit-slider-runnable-track]:h-[4px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,#4E9E5C_var(--p),#1d2a2224_var(--p))] " +
  "[&::-webkit-slider-thumb]:-mt-[6px] [&::-webkit-slider-thumb]:h-[16px] [&::-webkit-slider-thumb]:w-[16px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#4E9E5C] [&::-webkit-slider-thumb]:bg-white " +
  "[&::-moz-range-track]:h-[4px] [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[#1d2a2224] [&::-moz-range-progress]:h-[4px] [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-[#4E9E5C] " +
  "[&::-moz-range-thumb]:h-[16px] [&::-moz-range-thumb]:w-[16px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#4E9E5C] [&::-moz-range-thumb]:bg-white " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4E9E5C]";

/* ---------- page ---------- */

export default function ReviewPage() {
  const router = useRouter();
  const { profile, saveProfile } = useProfile();
  const [body, setBody] = useState(BODY_DEFAULTS);
  const [activity, setActivity] = useState<ActivityId>("light");
  const [goal, setGoal] = useState<GoalId>("maintain");
  const [calc, setCalc] = useState<Targets | null>(null);
  const [calcError, setCalcError] = useState<{ key: string; message: string } | null>(null);
  const [confirming, setConfirming] = useState(false);
const [confirmError, setConfirmError] = useState<string | null>(null);

  const calculationKey = [body.sex, body.age, body.height, body.weight, activity, goal].join("|");

  // step 1 aur step 2 ke jawab wapas load karo
  /* eslint-disable react-hooks/set-state-in-effect -- Restore saved onboarding values after hydration. */
  useEffect(() => {
  const c = readJSON(CALIBRATION_KEY);
  if (!c) {
    router.replace("/calibration");   // pehle step poora karo
    return;
  }
  setBody((b) => ({
    sex: c.sex === "Female" ? "Female" : "Male",
    age: num(c.age, b.age),
    height: num(c.height, b.height),
    weight: num(c.weight, b.weight),
    target: num(c.target, b.target),
  }));
  const a = readJSON(ABOUT_KEY);
    if (a) {
      if (typeof a.activity === "string" && a.activity in ACTIVITY)
        setActivity(a.activity as ActivityId);
      if (typeof a.goal === "string" && a.goal in GOAL)
        setGoal(a.goal as GoalId);
    }
  }, [router]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Backend se hisaab, jab bhi body, activity ya goal badle
useEffect(() => {
  let cancelled = false;
  calculateTargets({
    sex: body.sex,
    age: body.age,
    height: body.height,
    weight: body.weight,
    activity,
    goal,
  })
    .then((r) => {
      if (!cancelled) setCalc(r);
    })
    .catch((e) => {
      if (!cancelled)
        setCalcError({
          key: calculationKey,
          message: e instanceof ApiError ? e.message : "Couldn't calculate your targets.",
        });
    });
  return () => {
    cancelled = true;
  };
}, [body.sex, body.age, body.height, body.weight, activity, goal, calculationKey]);

  const act = ACTIVITY[activity];
  const g = GOAL[goal];

  // Backend ka hisaab aane tak
if (!calc) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto w-full max-w-[980px] px-[clamp(16px,4vw,56px)] py-[56px] text-center text-[14px] text-[#8E978F]"
    >
      {calcError?.key === calculationKey ? (
        <div className="grid justify-items-center gap-[12px]">
          <p
            role="alert"
            className="rounded-[12px] bg-[#FFEFE7] px-[12px] py-[10px] text-[13px] text-[#A4502B]"
          >
            {calcError.message}
          </p>
          <Link
            href={ONBOARDING_STEPS[0].href}
            className="font-medium text-[#2E6B3E] hover:underline"
          >
            Back to the start
          </Link>
        </div>
      ) : (
        "Calculating your targets…"
      )}
    </div>
  );
}

const bmr = calc.bmr;
const tdee = calc.tdee;
const tef = Math.round(tdee * 0.1);
const active = tdee - bmr - tef;

const net = calc.calories;
const adjShown = net - tdee;

const proteinG = calc.proteinG;
const proteinKcal = proteinG * 4;
const fatG = calc.fatG;
const fatKcal = fatG * 9;
const carbG = calc.carbG;
const carbKcal = carbG * 4;

const proteinPct = Math.round((proteinKcal / net) * 100);
const fatPct = Math.round((fatKcal / net) * 100);
const carbPct = Math.max(0, 100 - proteinPct - fatPct);

const barTotal = proteinKcal + carbKcal + fatKcal;
const w = (k: number) => `${(k / barTotal) * 100}%`;

// Backend protein ko goal ke hisab se khud tay karta hai, slider sirf dikhata hai
const ppk = body.weight > 0 ? proteinG / body.weight : 0;
const sliderPct = Math.min(
  100,
  Math.max(0, ((ppk - PPK_MIN) / (PPK_MAX - PPK_MIN)) * 100),
);

  const goalNote =
    goal === "maintain"
      ? `Holds you steady at ${body.weight} kg`
      : goal === "lose"
        ? `Moves you toward ${body.target} kg`
        : `Fuels you toward ${body.target} kg`;

  const micro = {
    iron: body.sex === "Female" ? 18 : 8,
    fiber: body.sex === "Female" ? 25 : 38,
  };

  const GOAL_LABEL = {
  lose: "Lose weight",
  maintain: "Maintain weight",
  build: "Gain weight",
} as const;

const confirm = async () => {
  const saved = readJSON(CALIBRATION_KEY);
  const about = readJSON(ABOUT_KEY);

  setConfirming(true);
  setConfirmError(null);

  const err = await saveProfile(
    {
      ...profile,
      name:
        typeof saved?.name === "string" && saved.name.trim()
          ? saved.name.trim()
          : profile.name,
      sex: body.sex,
      age: body.age,
      height: body.height,
      weight: body.weight,
      calories: net,
      goal: GOAL_LABEL[goal],
    },
    {
      activity,
      goal,
      target: body.target,
      cookTime: about?.cookTime,
      diet: Array.isArray(about?.diet) ? about.diet : undefined,
      equipment: Array.isArray(about?.equipment) ? about.equipment : undefined,
    },
  );

  if (err) {
    setConfirmError(err);
    setConfirming(false);
    return;
  }

  try {
    localStorage.setItem(
      userKey(TARGETS_KEY),
      JSON.stringify({
        calories: net,
        proteinG,
        carbG,
        fatG,
        proteinPerKg: ppk,
      }),
    );
  } catch {
    /* ignore */
  }
  router.push(AFTER_CONFIRM);
};

  const adjText =
    adjShown === 0
      ? "0 kcal"
      : adjShown > 0
        ? `+ ${fmt(adjShown)} kcal`
        : `− ${fmt(Math.abs(adjShown))} kcal`;

  return (
    <>
      <div className=" max-w-[980px] pt-[22px] w-full mx-auto animate-[viewin_0.5s_var(--ease)]">
        <div className="flex items-center justify-between text-[13px] text-[#8E978F] mb-[26px]">
          <span>
            Kcalm /{" "}
            <b className="text-[#1D2A22] font-[500]">Onboarding calibration</b>
          </span>
          <Link
            href="/dashboard"
            className="text-[#2E6B3E] font-[500] text-[13.5px] inline-flex items-center gap-[4px]"
          >
            Save &amp; exit
          </Link>
        </div>

        <h1
          className={`${bricolage.className} text-[clamp(30px,4vw,46px)] font-semibold tracking-[-0.03em] leading-[1.1] m-0 text-balance`}
        >
          Review your{" "}
          <span className={`${serif.className} tracking-[-.01em]`}>
            personalized targets.
          </span>
        </h1>
        <p className="text-[#5B665F] max-w-[596px] mt-[8px]">
          Based on your biometrics, {act.label} activity and a goal to{" "}
          {g.phrase}, here&apos;s your daily plan.
        </p>

        <div className="bg-white border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0 mt-[26px] grid gap-0">
          {/* ---------- calories ---------- */}
          <Section
            title="Total daily calorie target"
            hint="Balanced against your TDEE and goal."
            tag={g.tag}
            tagTone="green"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
              <div className="rounded-[20px] border border-[#CFE9C8] bg-[linear-gradient(160deg,#F1F9F3,#FFFFFF)] px-[18px] py-[26px] text-center grid content-center">
                <small className="text-[10.5px] uppercase tracking-[.14em] text-[#8E978F]">
                  Net caloric intake
                </small>
                <div className="mt-[8px] flex items-baseline justify-center gap-[6px]">
                  <b
                    className={`${bricolage.className} text-[clamp(44px,6vw,62px)] font-semibold tracking-[-.04em] leading-none tabular-nums`}
                  >
                    {fmt(net)}
                  </b>
                  <span className="text-[13px] text-[#8E978F]">kcal / day</span>
                </div>
                <small className="mt-[10px] text-[12px] text-[#8E978F]">
                  {goalNote}
                </small>
              </div>

              <div className="rounded-[20px] border border-[#1d2a2214] p-[16px]">
                <b className="block text-[13.5px] font-semibold mb-[6px]">
                  Metabolic formula breakdown
                </b>
                <dl className="m-0 text-[13px]">
                  {[
                    ["Basal metabolic rate (BMR)", `${fmt(bmr)} kcal`],
                    [`Active burn (${act.label})`, `+ ${fmt(active)} kcal`],
                    ["Thermic effect of food", `+ ${fmt(tef)} kcal`],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex text-[#5B665F] items-center justify-between gap-[10px] py-[7px]"
                    >
                      <dt className="">{k}</dt>
                      <b className="text-[#1D2A22] tabular-nums">{v}</b>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-[10px] pt-[12px] text-[#2E6B3E] border-t border-[#1d2a2214] font-semibold">
                    <dt>Total energy expenditure</dt>
                    <b className="m-0 tabular-nums">{fmt(tdee)} kcal</b>
                  </div>
                  <div className="flex items-center justify-between gap-[10px] pt-[7px]">
                    <dt className="text-[#5B665F]">Goal adjustment</dt>
                    <b className="m-0 tabular-nums">{adjText}</b>
                  </div>
                </dl>
              </div>
            </div>
          </Section>

          {/* ---------- macros ---------- */}
          <Section
            title="Macronutrient breakdown"
            hint="Protein anchored to bodyweight, a fat floor, carbs fill the rest."
            tag="Based on your goal"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[12px]">
              <MacroCard
                tone="green"
                Icon={Dumbbell}
                label="Protein"
                pct={proteinPct}
                grams={proteinG}
                note={`${ppk.toFixed(1)} g per kg bodyweight`}
                kcal={proteinKcal}
              />
              <MacroCard
                tone="blue"
                Icon={Wheat}
                label="Complex carbs"
                pct={carbPct}
                grams={carbG}
                note="Fills the remaining energy"
                kcal={carbKcal}
              />
              <MacroCard
                tone="orange"
                Icon={Heart}
                label="Healthy fats"
                pct={fatPct}
                grams={fatG}
                note={`${fatPct}% of calories for hormones`}
                kcal={fatKcal}
              />
            </div>

            {/* stacked bar */}
            <div
              className="flex h-[8px] rounded-[8px] overflow-hidden gap-[2px] mt-[14px] "
              role="img"
              aria-label={`Calories split: ${proteinPct}% protein, ${carbPct}% carbs, ${fatPct}% fats`}
            >
              <i
                className="block h-full bg-[#4E9E5C] transition-[width] duration-300"
                style={{ width: w(proteinKcal) }}
              />
              <i
                className="block h-full bg-[#3F8FC4] transition-[width] duration-300"
                style={{ width: w(carbKcal) }}
              />
              <i
                className="block h-full bg-[#E8895F] transition-[width] duration-300"
                style={{ width: w(fatKcal) }}
              />
            </div>

            {/* protein per kg slider */}
            <div className="mt-[16px] flex items-center gap-[14px]">
              <label
                htmlFor="ppk"
                className="shrink-0 text-[13px] text-[#1D2A22]"
              >
                Protein per kg
              </label>
              <input
                id="ppk"
                type="range"
                min={PPK_MIN}
                max={PPK_MAX}
                step={0.1}
                value={Number(ppk.toFixed(1))}
                disabled
                aria-valuetext={`${ppk.toFixed(1)} grams per kilogram`}
                className={sliderCls}
                style={{ "--p": `${sliderPct}%` } as React.CSSProperties}
              />
              <b className="shrink-0 w-[44px] text-right text-[13px] tabular-nums">
                {ppk.toFixed(1)} g
              </b>
            </div>
          </Section>

          {/* ---------- micronutrients ---------- */}
          <Section
            title="Core micronutrients"
            hint="Tracked daily to prevent fatigue and support immunity."
            tag="Satiety score 9.6/10"
            tagTone="green"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px]">
              <MicroTile Icon={Sun} label="Vitamin D3" value="2,000 IU" bg="bg-[#FFF5DB]" />
              <MicroTile Icon={Bone} label="Calcium" value="1,000 mg" bg="bg-[#E8F2FB]" />
              <MicroTile
                Icon={Activity}
                label="Bioavailable iron"
                value={`${micro.iron} mg`}
                bg="bg-[#FCE9EE]"
              />
              <MicroTile
                Icon={Leaf}
                label="Prebiotic fiber"
                value={`${micro.fiber} g`}
                bg="bg-[#E9F6EC]"
              />
            </div>
          </Section>
        </div>

        {confirmError && (
  <p
    role="alert"
    className="mt-[16px] rounded-[12px] bg-[#FFEFE7] px-[12px] py-[10px] text-[13px] text-[#A4502B]"
  >
    {confirmError}
  </p>
)}
        <div className="flex items-center justify-between mt-[22px]">
          <Link
            href={ONBOARDING_STEPS[1].href}
            className="inline-flex items-center justify-center gap-2 rounded-full py-[10px] px-[18px] text-sm font-medium whitespace-nowrap bg-white border border-[#1d2a2224] transition-colors duration-200 hover:bg-[#F2F5F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
          >
            <ChevronLeft size={14} />
            Back
          </Link>
          <button
            type="button"
            disabled={confirming}
            onClick={confirm}
            className="inline-flex items-center justify-center gap-2 rounded-full py-[11px] px-[20px] font-medium text-sm whitespace-nowrap cursor-pointer bg-[#2e6b3e] text-white shadow-[0_10px_24px_-12px_rgba(46,107,62,0.6)] transition-[translate,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-[0_14px_28px_-12px_rgba(46,107,62,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
          >
            {confirming ? "Saving…" : "Confirm targets & build meal plan"}
            <ChevronRight size={14} />
          </button>
        </div>

        <p className="text-center text-[12px] text-[#8E978F] mt-[26px]">
          Kcalm is not a medical device. If you have a diagnosed condition or a
          history of disordered eating, talk to a professional first.
        </p>
      </div>
    </>
  );
}
