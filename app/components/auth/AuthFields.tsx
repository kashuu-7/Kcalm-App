"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

const inputCls = (error?: string) =>
  `w-full rounded-[12px] border bg-white px-[14px] py-[12px] text-[14px] text-[#1D2A22] placeholder:text-[#8E978F] focus:outline-2 focus:outline-offset-1 focus:outline-[#4E9E5C] focus:[outline-style:solid] ${
    error ? "border-[#E8895F]" : "border-[#1d2a2224]"
  }`;

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  aside?: React.ReactNode; // label ke saamne (jaise "Forgot password?")
};

type InputProps = FieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">;

function Field({
  id,
  label,
  error,
  aside,
  children,
}: FieldProps & { children: React.ReactNode }) {
  return (
    <div className="grid gap-[6px] content-start">
      <div className="flex items-center justify-between gap-[10px]">
        <label htmlFor={id} className="text-[13px] font-medium text-[#1D2A22]">
          {label}
        </label>
        {aside}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-[12px] text-[#B8633A]">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({ id, label, error, aside, ...rest }: InputProps) {
  return (
    <Field id={id} label={label} error={error} aside={aside}>
      <input
        id={id}
        className={inputCls(error)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
    </Field>
  );
}

export function PasswordField({ id, label, error, aside, ...rest }: InputProps) {
  const [show, setShow] = useState(false);
  return (
    <Field id={id} label={label} error={error} aside={aside}>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          className={`${inputCls(error)} pr-[46px]`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          aria-pressed={show}
          className="absolute right-[6px] top-1/2 grid h-[32px] w-[32px] -translate-y-1/2 cursor-pointer place-items-center rounded-full text-[#5B665F] transition-colors duration-200 hover:bg-[#F2F5F2] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#4E9E5C]"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </Field>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-[12px] bg-[#FFEFE7] px-[12px] py-[10px] text-[13px] text-[#A4502B]"
    >
      {message}
    </p>
  );
}

export function SubmitButton({
  busy,
  busyText,
  children,
}: {
  busy: boolean;
  busyText: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2e6b3e] px-[20px] py-[12px] text-sm font-medium text-white shadow-[0_10px_24px_-12px_rgba(46,107,62,0.6)] transition-[translate,box-shadow] duration-200 ease-out hover:-translate-y-[1px] hover:shadow-[0_14px_28px_-12px_rgba(46,107,62,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {busy ? busyText : children}
    </button>
  );
}