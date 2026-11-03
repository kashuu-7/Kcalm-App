"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import { userKey } from "../../lib/userStorage";
import { useAuth } from "../../components/auth/AuthContext";

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

const NEXT_ROUTE = "/calibration/about"; // step 2 ka route, apne hisab se badal lena
const STORAGE_KEY = "kcalm-calibration";

type Form = {
  name: string;
  sex: "Male" | "Female";
  age: string;
  height: string;
  weight: string;
  target: string;
};
type Errors = Partial<Record<keyof Form, string>>;

// demo values (screenshot jaisi), real app mein name: "" aur baaki khali rakh sakte ho
const EMPTY: Form = {
  name: "",
  sex: "Male",
  age: "",
  height: "",
  weight: "",
  target: "",
};

// Pehle save kiya hua data (agar user wapas aaye), warna account ka naam + khaali numbers
function loadInitial(accountName: string): Form {
  const base: Form = { ...EMPTY, name: accountName };
  try {
    const raw = localStorage.getItem(userKey(STORAGE_KEY));
    if (!raw) return base;
    const s = JSON.parse(raw);
    return {
      name: typeof s.name === "string" && s.name ? s.name : accountName,
      sex: s.sex === "Female" ? "Female" : "Male",
      age: s.age != null ? String(s.age) : "",
      height: s.height != null ? String(s.height) : "",
      weight: s.weight != null ? String(s.weight) : "",
      target: s.target != null ? String(s.target) : "",
    };
  } catch {
    return base;
  }
}

function validate(f: Form): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Please enter your name";

  const range = (
    key: "age" | "height" | "weight" | "target",
    label: string,
    min: number,
    max: number
  ) => {
    const n = Number(f[key]);
    if (f[key].trim() === "" || !Number.isFinite(n) || n < min || n > max) {
      e[key] = `${label} must be between ${min} and ${max}`;
    }
  };
  range("age", "Age", 13, 120);
  range("height", "Height", 100, 250);
  range("weight", "Weight", 20, 300);
  range("target", "Target weight", 20, 300);
  return e;
}

/* ---------- small pieces ---------- */

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
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
      </div>
      {children}
    </section>
  );
}

const boxBase =
  "rounded-[12px] border bg-white px-[14px] py-[12px] text-[14px] text-[#1D2A22] focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-[#4E9E5C] focus-within:[outline-style:solid]";
const boxBorder = (error?: string) =>
  error ? "border-[#E8895F]" : "border-[#1d2a2224]";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-[6px] content-start">
      <label htmlFor={id} className="text-[13px] font-medium text-[#1D2A22]">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-[12px] text-[#B8633A]">
          {error}
        </p>
      )}
    </div>
  );
}

function UnitInput({
  id,
  label,
  unit,
  value,
  onChange,
  error,
  decimal,
}: {
  id: string;
  label: string;
  unit: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  decimal?: boolean;
}) {
  return (
    <Field id={id} label={label} error={error}>
      <div className={`flex items-center gap-[8px] ${boxBase} ${boxBorder(error)}`}>
        <input
          id={id}
          type="number"
          inputMode={decimal ? "decimal" : "numeric"}
          step={decimal ? "any" : 1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="min-w-0 flex-1 bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span className="text-[12.5px] text-[#8E978F]" aria-hidden="true">
          {unit}
        </span>
      </div>
    </Field>
  );
}

/* ---------- page ---------- */

export default function CalibrationPage() {
  const router = useRouter();
  const { user } = useAuth();
const [form, setForm] = useState<Form>(() => loadInitial(user?.name ?? ""));
  const [errors, setErrors] = useState<Errors>({});

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);

    const firstInvalid = Object.keys(errs)[0];
    if (firstInvalid) {
      document.getElementById(`c-${firstInvalid}`)?.focus();
      return;
    }

    try {
      localStorage.setItem(
        userKey(STORAGE_KEY),
        JSON.stringify({
          name: form.name.trim(),
          sex: form.sex,
          age: Number(form.age),
          height: Number(form.height),
          weight: Number(form.weight),
          target: Number(form.target),
        })
      );
    } catch {
      /* ignore */
    }
    router.push(NEXT_ROUTE);
  };

  return (
    <>
      <div className="max-w-[980px] pt-[22px] w-full mx-auto animate-[viewin_0.5s_var(--ease)]">
        <div className="flex items-center justify-between text-[13px] text-[#8E978F] mb-[26px] ">
          <span>
            Kcalm /{" "}
            <b className="text-[#1D2A22] font-[500] ">Onboarding calibration</b>
          </span>
          <Link
            href="/dashboard"
            className="text-[#2E6B3E] font-[500] text-[13.5px] inline-flex items-center gap-[4px] "
          >
            Save &amp; exit
          </Link>
        </div>

        <h1
          className={`${bricolage.className} text-[clamp(30px,4vw,46px)] font-semibold tracking-[-0.03em] leading-[1.1] m-0 text-balance`}
        >
          Let&apos;s start with{" "}
          <span className={`${serif.className} tracking-[-.01em] `}>
            the basics.
          </span>
        </h1>
        <p className="text-[#5B665F] max-w-[596px] mt-[8px]">
          These numbers power your metabolic calculation. We use the Mifflin–St
          Jeor equation, the clinical standard for estimating resting energy.
        </p>

        <form onSubmit={onSubmit} noValidate>
          <div className="bg-white border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0 mt-[26px] grid gap-0">
            {/* About you */}
            <Section title="About you" hint="How should we address you?">
              <Field id="c-name" label="Full name" error={errors.name}>
                <input
                  id="c-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "c-name-error" : undefined}
                  className={`w-full ${boxBase} ${boxBorder(errors.name)} outline-none focus:outline-2 focus:outline-offset-1 focus:outline-[#4E9E5C]`}
                />
              </Field>
            </Section>

            {/* Sex */}
            <Section title="Sex" hint="Used only for the metabolic formula.">
              <div role="radiogroup" aria-label="Sex" className="flex gap-[10px]">
                {(["Male", "Female"] as const).map((s) => (
                  <label key={s} className="cursor-pointer">
                    <input
                      type="radio"
                      name="sex"
                      value={s}
                      checked={form.sex === s}
                      onChange={() => set("sex", s)}
                      className="peer sr-only"
                    />
                    <span className="inline-flex items-center rounded-full border border-[#1d2a2224] bg-white px-[16px] py-[9px] text-[14px] transition-[background-color,border-color] duration-200 peer-checked:border-[#4E9E5C] peer-checked:bg-[#E9F6EC] peer-checked:text-[#2E6B3E] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#4E9E5C]">
                      {s}
                    </span>
                  </label>
                ))}
              </div>
            </Section>

            {/* Body measurements */}
            <Section
              title="Body measurements"
              hint="Metric units. You can update these anytime from your profile."
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px]">
                <UnitInput
                  id="c-age"
                  label="Age"
                  unit="yrs"
                  value={form.age}
                  onChange={(v) => set("age", v)}
                  error={errors.age}
                />
                <UnitInput
                  id="c-height"
                  label="Height"
                  unit="cm"
                  decimal
                  value={form.height}
                  onChange={(v) => set("height", v)}
                  error={errors.height}
                />
                <UnitInput
                  id="c-weight"
                  label="Current weight"
                  unit="kg"
                  decimal
                  value={form.weight}
                  onChange={(v) => set("weight", v)}
                  error={errors.weight}
                />
                <UnitInput
                  id="c-target"
                  label="Target weight"
                  unit="kg"
                  decimal
                  value={form.target}
                  onChange={(v) => set("target", v)}
                  error={errors.target}
                />
              </div>
            </Section>
          </div>

          <div className="flex justify-end mt-[22px]">
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

