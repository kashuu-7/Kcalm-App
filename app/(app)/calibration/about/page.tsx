"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import { userKey } from "../../../lib/userStorage";
import { detectTimezone, fetchDaySettings } from "../../../lib/api/profile";
import { useProfile } from "../../../components/profile/ProfileContext";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Monitor,
  RefreshCw,
  Scale,
  Zap,
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

/* ---------- data (apne hisab se badal lena) ---------- */

const STORAGE_KEY = "kcalm-about";

const ACTIVITY = [
  { id: "sedentary", title: "Sedentary", sub: "Desk job, little exercise", mult: "1.2", Icon: Monitor, recommended: false },
  { id: "light", title: "Light", sub: "1–2 workouts per week", mult: "1.375", Icon: Zap, recommended: false },
  { id: "moderate", title: "Moderate", sub: "3–5 workouts per week", mult: "1.55", Icon: RefreshCw, recommended: true },
  { id: "active", title: "Very active", sub: "Daily intense workouts", mult: "1.725", Icon: Flame, recommended: false },
] as const;

const GOALS = [
  { id: "lose", label: "Lose fat", Icon: Flame },
  { id: "maintain", label: "Maintain weight", Icon: Scale },
  { id: "build", label: "Build muscle", Icon: Dumbbell },
] as const;

const MEAL_COUNTS = [
  { n: 2, label: "2 meals", plan: "Breakfast · Dinner" },
  { n: 3, label: "3 meals", plan: "Breakfast · Lunch · Dinner" },
  { n: 4, label: "4 meals", plan: "Breakfast · Lunch · Pre-workout · Dinner" },
  { n: 5, label: "5 meals", plan: "Breakfast · Lunch · Snack · Pre-workout · Dinner" },
] as const;

const COOK_TIMES = [
  { id: "10", label: "10 min" },
  { id: "20", label: "20 min" },
  { id: "30+", label: "30+ min" },
] as const;

const DIETS = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "dairy-free", label: "Dairy free" },
  { id: "gluten-free", label: "Gluten free" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "halal", label: "Halal" },
  { id: "none", label: "No restrictions" },
];

const EQUIPMENT = [
  { id: "stovetop", label: "Stovetop" },
  { id: "oven", label: "Oven" },
  { id: "air-fryer", label: "Air fryer" },
  { id: "slow-cooker", label: "Slow cooker" },
  { id: "microwave", label: "Microwave" },
  { id: "blender", label: "Blender" },
];

// Browser purani list na de to ye chhoti list dikhti hai
const FALLBACK_TIMEZONES = [
  "UTC",
  "Asia/Karachi",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Riyadh",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Australia/Sydney",
];

function timezoneList(): string[] {
  let list: string[] = [];
  try {
    const sv = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] })
      .supportedValuesOf;
    if (sv) list = sv("timeZone");
  } catch {
    /* ignore */
  }
  if (list.length === 0) list = FALLBACK_TIMEZONES;
  return [...new Set([...list, "UTC"])].sort();
}

const timeOk = (t: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t);

type Form = {
  activity: (typeof ACTIVITY)[number]["id"];
  goal: (typeof GOALS)[number]["id"];
  cookTime: (typeof COOK_TIMES)[number]["id"];
  diet: string[];
  equipment: string[];
  wake: string; // "HH:MM"
  sleep: string; // "HH:MM"
  timezone: string; // IANA naam
  meals: number; // 2 se 5
};

const DEFAULTS: Form = {
  activity: "light",
  goal: "maintain",
  cookTime: "20",
  diet: ["none"],
  equipment: ["stovetop", "oven", "air-fryer"],
  wake: "07:00",
  sleep: "23:00",
  timezone: "",
  meals: 4,
};

/* ---------- small pieces ---------- */

function Section({
  id,
  title,
  hint,
  tag,
  tagTone = "grey",
  role = "group",
  children,
}: {
  id: string;
  title: string;
  hint: string;
  tag?: string;
  tagTone?: "grey" | "green";
  role?: "group" | "radiogroup";
  children: React.ReactNode;
}) {
  return (
    <section className="py-[22px] border-b border-[#1d2a2214] first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-start justify-between gap-[10px] mb-[14px]">
        <div>
          <h3
            id={id}
            className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1]`}
          >
            {title}
          </h3>
          <p className="text-[13px] text-[#8E978F] mt-[3px]">{hint}</p>
        </div>
        {tag && (
          <span
            className={`shrink-0 rounded-full px-[10px] py-[4px] text-[11.5px] whitespace-nowrap ${
              tagTone === "green"
                ? "bg-[#E9F6EC] text-[#2E6B3E]"
                : "bg-[#F2F5F2] text-[#5B665F]"
            }`}
          >
            {tag}
          </span>
        )}
      </div>
      <div role={role} aria-labelledby={id}>
        {children}
      </div>
    </section>
  );
}

function Chip({
  type,
  name,
  label,
  checked,
  onChange,
  Icon,
}: {
  type: "radio" | "checkbox";
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  Icon?: LucideIcon;
}) {
  return (
    <label className="cursor-pointer">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={`inline-flex items-center gap-[8px] rounded-full border px-[16px] py-[9px] text-[14px] transition-[background-color,border-color,color] duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#4E9E5C] ${
          checked
            ? "border-[#4E9E5C] bg-[#E9F6EC] text-[#2E6B3E]"
            : "border-[#1d2a2224] bg-white hover:bg-[#F7FAF7]"
        }`}
      >
        {type === "checkbox" && checked ? (
          <Check size={14} />
        ) : Icon ? (
          <Icon size={14} />
        ) : null}
        {label}
      </span>
    </label>
  );
}

// Calibration ke pehle page jaisa input ka dabba (label + border wala box)
const boxBase =
  "rounded-[12px] border border-[#1d2a2224] bg-white px-[14px] py-[12px] text-[14px] text-[#1D2A22] focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-[#4E9E5C] focus-within:[outline-style:solid]";

function LabeledBox({
  id,
  label,
  className = "",
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`grid gap-[6px] content-start min-w-0 ${className}`}>
      <label htmlFor={id} className="text-[13px] font-medium text-[#1D2A22]">
        {label}
      </label>
      <div className={`flex items-center gap-[8px] ${boxBase}`}>{children}</div>
    </div>
  );
}

/* ---------- page ---------- */

export default function AboutPage() {
  const router = useRouter();
  const { profile, saveProfile } = useProfile();
  const [form, setForm] = useState<Form>(DEFAULTS);
  const [tzList, setTzList] = useState<string[]>([]);
  const [dayError, setDayError] = useState<string | null>(null);
  const [savingExit, setSavingExit] = useState(false);

  // Non-schedule answers browser se restore karo; persisted schedule backend se authoritative hai.
  /* eslint-disable react-hooks/set-state-in-effect -- Restore the saved form after hydration. */
  useEffect(() => {
    let cancelled = false;
    try {
      const raw = localStorage.getItem(userKey(STORAGE_KEY));
      if (raw) {
        const saved = JSON.parse(raw);
        setForm((f) => ({ ...f, ...saved }));
      }
    } catch {
      /* ignore */
    }

    const detected = detectTimezone();
    setTzList(timezoneList());

    fetchDaySettings().then((s) => {
      if (cancelled) return;
      if (s) {
        setForm((f) => ({
          ...f,
          wake: s.wake,
          sleep: s.sleep,
          timezone: s.timezone,
          meals: s.meals,
        }));
      } else {
        setForm((f) => ({ ...f, timezone: f.timezone || detected }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleDiet = (id: string) =>
    setForm((f) => {
      const has = f.diet.includes(id);
      // "No restrictions" baaki sab ko hata deta hai, aur baaki koi bhi usse hata deta hai
      if (id === "none") return { ...f, diet: has ? [] : ["none"] };
      const rest = f.diet.filter((d) => d !== "none");
      return {
        ...f,
        diet: has ? rest.filter((d) => d !== id) : [...rest, id],
      };
    });

  const toggleEquipment = (id: string) =>
    setForm((f) => ({
      ...f,
      equipment: f.equipment.includes(id)
        ? f.equipment.filter((e) => e !== id)
        : [...f.equipment, id],
    }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!timeOk(form.wake) || !timeOk(form.sleep)) {
      setDayError("Please enter both your wake-up time and your sleep time.");
      return;
    }
    if (form.wake === form.sleep) {
      setDayError("Your wake-up and sleep times can't be the same.");
      return;
    }
    if (!form.timezone) {
      setDayError("Please choose your timezone.");
      return;
    }
    setDayError(null);

    try {
      localStorage.setItem(userKey(STORAGE_KEY), JSON.stringify(form));
    } catch {
      /* ignore */
    }
    router.push(ONBOARDING_STEPS[2].href);
  };

  const onSaveAndExit = async () => {
    if (!timeOk(form.wake) || !timeOk(form.sleep)) {
      setDayError("Please enter both your wake-up time and your sleep time.");
      return;
    }
    if (form.wake === form.sleep) {
      setDayError("Your wake-up and sleep times can't be the same.");
      return;
    }
    if (!form.timezone) {
      setDayError("Please choose your timezone.");
      return;
    }

    let calibration: Record<string, unknown> | null = null;
    try {
      const raw = localStorage.getItem(userKey("kcalm-calibration"));
      calibration = raw ? JSON.parse(raw) : null;
    } catch {
      calibration = null;
    }

    const numberOr = (value: unknown, fallback: number) => {
      const n = typeof value === "number" ? value : Number(value);
      return Number.isFinite(n) && n > 0 ? n : fallback;
    };
    const goal = form.goal === "lose" ? "Lose weight" : form.goal === "build" ? "Gain weight" : "Maintain weight";
    const nextProfile = {
      ...profile,
      name: typeof calibration?.name === "string" && calibration.name.trim()
        ? calibration.name.trim()
        : profile.name,
      sex:
        calibration?.sex === "Female"
          ? "Female"
          : calibration?.sex === "Male"
            ? "Male"
            : profile.sex,
      age: numberOr(calibration?.age, profile.age),
      height: numberOr(calibration?.height, profile.height),
      weight: numberOr(calibration?.weight, profile.weight),
      goal,
    };

    setSavingExit(true);
    setDayError(null);
    const error = await saveProfile(nextProfile, {
      activity: form.activity,
      goal: form.goal,
      cookTime: form.cookTime,
      diet: form.diet,
      equipment: form.equipment,
      wake: form.wake,
      sleep: form.sleep,
      timezone: form.timezone,
      meals: form.meals,
    });
    setSavingExit(false);

    if (error) {
      setDayError(error);
      return;
    }

    try {
      localStorage.setItem(userKey(STORAGE_KEY), JSON.stringify(form));
    } catch {
      /* backend is the saved source of truth */
    }
    router.push("/dashboard");
  };

  const tzOptions = [...new Set([form.timezone, ...tzList].filter(Boolean))];

  return (
    <>
      <div className=" max-w-[980px] pt-[22px] w-full mx-auto animate-[viewin_0.5s_var(--ease)]">
        <div className="flex items-center justify-between text-[13px] text-[#8E978F] mb-[26px]">
          <span>
            Kcalm /{" "}
            <b className="text-[#1D2A22] font-[500]">Onboarding calibration</b>
          </span>
          <button
            type="button"
            onClick={() => void onSaveAndExit()}
            disabled={savingExit}
            className="text-[#2E6B3E] font-[500] text-[13.5px] inline-flex items-center gap-[4px] disabled:opacity-60"
          >
            {savingExit ? "Saving…" : "Save & exit"}
          </button>
        </div>

        <h1
          className={`${bricolage.className} text-[clamp(30px,4vw,46px)] font-semibold tracking-[-0.03em] leading-[1.1] m-0 text-balance`}
        >
          Tell us about{" "}
          <span className={`${serif.className} tracking-[-.01em]`}>
            your lifestyle.
          </span>
        </h1>
        <p className="text-[#5B665F] max-w-[596px] mt-[8px]">
          We use this to build calorie targets and meal plans that fit your
          daily routine.
        </p>

        <form onSubmit={onSubmit}>
          <div className="bg-white border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0 mt-[26px] grid gap-0">
            {/* Activity */}
            <Section
              id="q-activity"
              role="radiogroup"
              title="How active are you?"
              hint="Choose your average weekly activity level."
              tag="Calibrates TDEE burn"
              tagTone="green"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px] pt-[10px]">
                {ACTIVITY.map((a) => {
                  const on = form.activity === a.id;
                  return (
                    <label key={a.id} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="activity"
                        checked={on}
                        onChange={() => set("activity", a.id)}
                        className="peer sr-only"
                      />
                      <div
                        className={`h-full rounded-[18px] border p-[16px] pb-[14px] transition-[background-color,border-color] duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#4E9E5C] ${
                          on
                            ? "border-[#4E9E5C] bg-[#F4FAF5]"
                            : "border-[#1d2a2224] bg-white hover:bg-[#F7FAF7]"
                        }`}
                      >
                        <span
                          className={`w-[34px] h-[34px] rounded-[11px] grid place-items-center ${
                            on
                              ? "bg-[#E9F6EC] text-[#2E6B3E]"
                              : "bg-[#F2F5F2] text-[#5B665F]"
                          }`}
                        >
                          <a.Icon size={16} />
                        </span>
                        <b
                          className={`${bricolage.className} block mt-[14px] text-[15px] font-semibold tracking-[-.02em]`}
                        >
                          {a.title}
                        </b>
                        <small className="block mt-[2px] text-[12.5px] text-[#8E978F]">
                          {a.sub}
                        </small>
                        <div className="mt-[12px] pt-[10px] border-t border-[#1d2a2214] flex items-center justify-between font-mono text-[11px] text-[#8E978F]">
                          <span>{a.mult}× multiplier</span>
                          {on && <Check size={14} className="text-[#4E9E5C]" />}
                        </div>
                      </div>
                      {a.recommended && (
                        <span className="absolute left-1/2 -top-[9px] -translate-x-1/2 rounded-full bg-[#4E9E5C] px-[8px] py-[2px] text-[9px] font-medium uppercase tracking-[.08em] text-white">
                          Recommended
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </Section>

            {/* Goal */}
            <Section
              id="q-goal"
              role="radiogroup"
              title="What is your main goal?"
              hint="Sets your daily calorie deficit or surplus and macro split."
            >
              <div className="flex flex-wrap gap-[10px]">
                {GOALS.map((g) => (
                  <Chip
                    key={g.id}
                    type="radio"
                    name="goal"
                    label={g.label}
                    Icon={g.Icon}
                    checked={form.goal === g.id}
                    onChange={() => set("goal", g.id)}
                  />
                ))}
              </div>
            </Section>

            {/* Daily rhythm: wake, sleep, timezone */}
            <Section
              id="q-rhythm"
              title="What does your day look like?"
              hint="We time your meals around when you wake up and go to sleep."
              tag="Meal timing"
            >
              <div className="grid grid-cols-3 gap-[12px] max-[940px]:grid-cols-2 max-sm:grid-cols-1">
                <LabeledBox id="wake" label="Wake-up time">
                  <input
                    id="wake"
                    type="time"
                    value={form.wake}
                    onChange={(e) => set("wake", e.target.value)}
                    className="min-w-0 flex-1 bg-transparent outline-none"
                  />
                </LabeledBox>
                <LabeledBox id="sleep" label="Sleep time">
                  <input
                    id="sleep"
                    type="time"
                    value={form.sleep}
                    onChange={(e) => set("sleep", e.target.value)}
                    className="min-w-0 flex-1 bg-transparent outline-none"
                  />
                </LabeledBox>
                <LabeledBox
                  id="tz"
                  label="Timezone"
                  className="max-[940px]:col-span-2 max-sm:col-span-1"
                >
                  <select
                    id="tz"
                    value={form.timezone}
                    onChange={(e) => set("timezone", e.target.value)}
                    className="min-w-0 flex-1 bg-transparent outline-none"
                  >
                    {!form.timezone && (
                      <option value="" disabled>
                        Select timezone
                      </option>
                    )}
                    {tzOptions.map((z) => (
                      <option key={z} value={z}>
                        {z.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </LabeledBox>
              </div>
              {dayError && (
                <p
                  role="alert"
                  className="mt-[12px] rounded-[12px] bg-[#FFEFE7] px-[12px] py-[10px] text-[13px] text-[#A4502B]"
                >
                  {dayError}
                </p>
              )}
            </Section>

            {/* Meals per day */}
            <Section
              id="q-meals"
              role="radiogroup"
              title="How many meals a day?"
              hint="Your daily calories are split across these meals."
              tag="2 to 5"
            >
              <div className="flex flex-wrap gap-[10px]">
                {MEAL_COUNTS.map((m) => (
                  <Chip
                    key={m.n}
                    type="radio"
                    name="meals"
                    label={m.label}
                    checked={form.meals === m.n}
                    onChange={() => set("meals", m.n)}
                  />
                ))}
              </div>
              <p className="mt-[10px] text-[12.5px] text-[#8E978F]">
                {MEAL_COUNTS.find((m) => m.n === form.meals)?.plan}
              </p>
            </Section>

            {/* Cooking time */}
            <Section
              id="q-time"
              role="radiogroup"
              title="How much time do you usually have for cooking?"
              hint="Target prep and cooking time per meal."
              tag="Per recipe"
            >
              <div className="flex flex-wrap gap-[10px]">
                {COOK_TIMES.map((t) => (
                  <Chip
                    key={t.id}
                    type="radio"
                    name="cookTime"
                    label={t.label}
                    Icon={Clock}
                    checked={form.cookTime === t.id}
                    onChange={() => set("cookTime", t.id)}
                  />
                ))}
              </div>
            </Section>

            {/* Diet */}
            <Section
              id="q-diet"
              title="Dietary preferences"
              hint="Filters recipes and grocery calculations."
              tag="Multi-select"
            >
              <div className="flex flex-wrap gap-[10px]">
                {DIETS.map((d) => (
                  <Chip
                    key={d.id}
                    type="checkbox"
                    name="diet"
                    label={d.label}
                    checked={form.diet.includes(d.id)}
                    onChange={() => toggleDiet(d.id)}
                  />
                ))}
              </div>
            </Section>

            {/* Equipment */}
            <Section
              id="q-equipment"
              title="What equipment do you use?"
              hint="We only suggest recipes you can actually make."
              tag="Select all that apply"
            >
              <div className="flex flex-wrap gap-[10px]">
                {EQUIPMENT.map((q) => (
                  <Chip
                    key={q.id}
                    type="checkbox"
                    name="equipment"
                    label={q.label}
                    checked={form.equipment.includes(q.id)}
                    onChange={() => toggleEquipment(q.id)}
                  />
                ))}
              </div>
            </Section>
          </div>

          <div className="flex items-center justify-between mt-[22px]">
            <Link
              href={ONBOARDING_STEPS[0].href}
              className="inline-flex items-center justify-center gap-2 rounded-full py-[10px] px-[18px] text-sm font-medium whitespace-nowrap bg-white border border-[#1d2a2224] transition-colors duration-200 hover:bg-[#F2F5F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
            >
              <ChevronLeft size={14} />
              Back
            </Link>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full py-[11px] px-[20px] font-medium text-sm whitespace-nowrap cursor-pointer bg-[#2e6b3e] text-white shadow-[0_10px_24px_-12px_rgba(46,107,62,0.6)] transition-[translate,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-[0_14px_28px_-12px_rgba(46,107,62,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
            >
              Continue
              <ChevronRight size={14} />
            </button>
          </div>
        </form>

        <p className="text-center text-[12px] text-[#8E978F] mt-[26px]">
          Kcalm is not a medical device. If you have a diagnosed condition or a
          history of disordered eating, talk to a professional first.
        </p>
      </div>
    </>
  );
}
