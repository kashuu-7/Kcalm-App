"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { useProfile, type ProfileData } from "./ProfileContext";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SEX_OPTIONS = ["Male", "Female"];
const GOAL_OPTIONS = ["Lose weight", "Maintain weight", "Gain weight"];

type Draft = Record<keyof ProfileData, string>;
type Errors = Partial<Record<keyof ProfileData, string>>;

const toDraft = (p: ProfileData): Draft => ({
  name: p.name,
  email: p.email,
  age: String(p.age),
  sex: p.sex,
  height: String(p.height),
  weight: String(p.weight),
  calories: String(p.calories),
  goal: p.goal,
});

function validate(d: Draft): Errors {
  const e: Errors = {};
  if (!d.name.trim()) e.name = "Name is required";
  if (!/^\S+@\S+\.\S+$/.test(d.email.trim())) e.email = "Enter a valid email";

  const range = (
    key: "age" | "height" | "weight" | "calories",
    label: string,
    min: number,
    max: number
  ) => {
    const n = Number(d[key]);
    if (d[key].trim() === "" || !Number.isFinite(n) || n < min || n > max) {
      e[key] = `${label} must be between ${min} and ${max}`;
    }
  };
  range("age", "Age", 13, 120);
  range("height", "Height", 100, 250);
  range("weight", "Weight", 20, 300);
  range("calories", "Calories", 800, 6000);
  return e;
}

const inputBase =
  "w-full rounded-[12px] border bg-white px-[12px] py-[9px] text-[14px] text-[#1D2A22] focus:outline-2 focus:outline-offset-1 focus:outline-[#4E9E5C] focus:[outline-style:solid]";
const inputCls = (error?: string) =>
  `${inputBase} ${error ? "border-[#E8895F]" : "border-[#1d2a2224]"}`;
const selectCls = (error?: string) =>
  `${inputCls(error)} appearance-none cursor-pointer bg-[url('/dropdown.svg')] bg-no-repeat bg-[right_12px_center] pr-[32px]`;

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
      <label htmlFor={id} className="text-[13px] font-medium">
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

export default function EditProfileModal() {
  const { profile, isEditOpen, closeEdit, saveProfile } = useProfile();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const [draft, setDraft] = useState<Draft>(toDraft(profile));
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
const [saveError, setSaveError] = useState<string | null>(null);

  // context ki state ke hisab se dialog kholo / band karo
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isEditOpen && !dialog.open) {
      setDraft(toDraft(profile));
      setErrors({});
      setSaveError(null);
      dialog.showModal();
      nameRef.current?.focus();
    } else if (!isEditOpen && dialog.open) {
      dialog.close();
    }
    // sirf isEditOpen par chalna chahiye, warna typing ke beech draft reset ho jayega
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditOpen]);

  const set = (key: keyof ProfileData, value: string) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const save = async (e: React.FormEvent) => {
  e.preventDefault();
  const errs = validate(draft);
  setErrors(errs);
  if (Object.keys(errs).length > 0) return;

  setSaving(true);
  setSaveError(null);
  const err = await saveProfile({
    name: draft.name.trim(),
    email: draft.email.trim(),
    age: Number(draft.age),
    sex: draft.sex,
    height: Number(draft.height),
    weight: Number(draft.weight),
    calories: Number(draft.calories),
    goal: draft.goal,
  });
  setSaving(false);
  if (err) setSaveError(err);
};

  const err = (key: keyof ProfileData) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `p-${key}-error` : undefined,
  });

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="editProfileTitle"
      onClose={closeEdit} // Esc dabane par bhi state sync rahe
      onClick={(e) => {
        if (e.target === e.currentTarget) closeEdit();
      }}
      className="m-auto w-[min(520px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] overflow-auto rounded-[24px] border border-[#1d2a2214] bg-white p-0 text-[#1D2A22] shadow-[0_30px_60px_-20px_rgba(29,42,34,0.4)] backdrop:bg-[#1d2a22]/35 backdrop:backdrop-blur-[3px]"
    >
      <form onSubmit={save} noValidate className="p-[22px]">
        <div className="flex items-start justify-between gap-[12px] mb-[18px]">
          <div>
            <h2
              id="editProfileTitle"
              className={`${bricolage.className} text-[20px] font-semibold tracking-[-.03em] leading-[1.1]`}
            >
              Edit profile
            </h2>
            <p className="text-[#8E978F] text-[13px] mt-[4px]">
              Update your personal details.
            </p>
          </div>
          <button
            type="button"
            onClick={closeEdit}
            aria-label="Close"
            className="w-[32px] h-[32px] shrink-0 rounded-full border border-[#1d2a2224] grid place-items-center cursor-pointer transition-colors duration-200 hover:bg-[#F2F5F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
          >
            <X size={14} />
          </button>
        </div>

        <div className="grid gap-[14px]">
          <Field id="p-name" label="Full name" error={errors.name}>
            <input
              id="p-name"
              ref={nameRef}
              type="text"
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputCls(errors.name)}
              {...err("name")}
            />
          </Field>

          <Field id="p-email" label="Email (used to log in)" error={errors.email}>
  <input
    id="p-email"
    type="email"
    value={draft.email}
    readOnly
    className={`${inputCls(errors.email)} bg-[#F7F9F7]! text-[#5B665F]! cursor-not-allowed`}
    {...err("email")}
  />
</Field>

          <div className="grid grid-cols-2 gap-[14px]">
            <Field id="p-age" label="Age" error={errors.age}>
              <input
                id="p-age"
                type="number"
                inputMode="numeric"
                value={draft.age}
                onChange={(e) => set("age", e.target.value)}
                className={inputCls(errors.age)}
                {...err("age")}
              />
            </Field>

            <Field id="p-sex" label="Sex">
              <select
                id="p-sex"
                value={draft.sex}
                onChange={(e) => set("sex", e.target.value)}
                className={selectCls()}
              >
                {SEX_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="p-height" label="Height (cm)" error={errors.height}>
              <input
                id="p-height"
                type="number"
                inputMode="decimal"
                step="any"
                value={draft.height}
                onChange={(e) => set("height", e.target.value)}
                className={inputCls(errors.height)}
                {...err("height")}
              />
            </Field>

            <Field id="p-weight" label="Weight (kg)" error={errors.weight}>
              <input
                id="p-weight"
                type="number"
                inputMode="decimal"
                step="any"
                value={draft.weight}
                onChange={(e) => set("weight", e.target.value)}
                className={inputCls(errors.weight)}
                {...err("weight")}
              />
            </Field>

            <Field id="p-calories" label="Daily calories (calculated)" error={errors.calories}>
  <input
    id="p-calories"
    type="number"
    value={draft.calories}
    readOnly
    className={`${inputCls(errors.calories)} bg-[#F7F9F7]! text-[#5B665F]! cursor-not-allowed`}
    {...err("calories")}
  />
</Field>

            <Field id="p-goal" label="Your goal">
              <select
                id="p-goal"
                value={draft.goal}
                onChange={(e) => set("goal", e.target.value)}
                className={selectCls()}
              >
                {GOAL_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {saveError && (
  <p
    role="alert"
    className="mt-[14px] rounded-[12px] bg-[#FFEFE7] px-[12px] py-[10px] text-[13px] text-[#A4502B]"
  >
    {saveError}
  </p>
)}
        <div className="flex justify-end gap-[10px] mt-[22px]">
          <button
            type="button"
            onClick={closeEdit}
            className="py-[9px] px-[18px] text-[14px] font-medium rounded-full border border-[#1d2a2224] bg-white cursor-pointer transition-colors duration-200 hover:bg-[#F2F5F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="py-[9px] px-[20px] text-[14px] font-medium rounded-full bg-[#2e6b3e] text-white cursor-pointer shadow-[0_10px_24px_-12px_rgba(46,107,62,0.6)] transition-[translate,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-[0_14px_28px_-12px_rgba(46,107,62,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </dialog>
  );
}