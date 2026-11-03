"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import { userKey } from "../../../lib/userStorage";
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

type Form = {
  activity: (typeof ACTIVITY)[number]["id"];
  goal: (typeof GOALS)[number]["id"];
  cookTime: (typeof COOK_TIMES)[number]["id"];
  diet: string[];
  equipment: string[];
};

const DEFAULTS: Form = {
  activity: "light",
  goal: "maintain",
  cookTime: "20",
  diet: ["none"],
  equipment: ["stovetop", "oven", "air-fryer"],
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

/* ---------- page ---------- */

export default function AboutPage() {
  const router = useRouter();
  const [form, setForm] = useState<Form>(DEFAULTS);

  // Back se wapas aao to pehle ka jawab dikhe
  useEffect(() => {
    try {
      const raw = localStorage.getItem(userKey(STORAGE_KEY))
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore the saved form after hydration.
      if (raw) setForm((f) => ({ ...f, ...JSON.parse(raw) }));
    } catch {
      /* ignore */
    }
  }, []);

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
    try {
      localStorage.setItem(userKey(STORAGE_KEY), JSON.stringify(form))
    } catch {
      /* ignore */
    }
    router.push(ONBOARDING_STEPS[2].href);
  };

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
