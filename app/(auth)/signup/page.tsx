"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "../../components/auth/AuthShell";
import {
  FormError,
  PasswordField,
  SubmitButton,
  TextField,
} from "../../components/auth/AuthFields";
import { useAuth } from "../../components/auth/AuthContext";
import { AuthError } from "../../components/auth/authApi";
import { ONBOARDING_STEPS } from "../../components/dashboard/onboarding";
import {
  validateEmail,
  validateName,
  validateNewPassword,
} from "../../components/auth/validation";

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  terms?: string;
};

const PLAN_LABELS = { basic: "Basic", plus: "Plus", premium: "Premium" } as const;
type PlanId = keyof typeof PLAN_LABELS;

// URL ka ?plan= bharosemand nahi hota, isliye sirf in 3 mein se hi maano
function readPlan(): PlanId | null {
  const p = new URLSearchParams(window.location.search).get("plan");
  return p && Object.keys(PLAN_LABELS).includes(p) ? (p as PlanId) : null;
}

const subscribe = () => () => {};

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const plan = useSyncExternalStore(subscribe, readPlan, () => null);


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs: Errors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validateNewPassword(password),
      terms: terms ? undefined : "Please accept to continue",
    };
    setErrors(errs);

    const first = (["name", "email", "password", "terms"] as const).find(
      (k) => errs[k],
    );
    if (first) {
      document.getElementById(`s-${first}`)?.focus();
      return;
    }

    setBusy(true);
    setFormError(null);
    try {
      await signUp({ name, email: email.trim(), password, plan: plan ?? "basic" });
      // Naya user seedha calibration (onboarding) par jata hai
      router.push(ONBOARDING_STEPS[0].href);
    } catch (err) {
      setFormError(
        err instanceof AuthError
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create your"
      accent="account."
      subtitle="Two minutes of setup and you get a plan that fits your day."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#2E6B3E] hover:underline">
            Log in
          </Link>
        </>
      }
    >
        {plan && (
  <p className="rounded-[12px] bg-[#E9F6EC] px-[12px] py-[10px] text-[13px] text-[#2E6B3E]">
    You&apos;re signing up for the <b>{PLAN_LABELS[plan]}</b> plan. You can
    change it anytime from your profile.
  </p>
)}
      <form onSubmit={onSubmit} noValidate className="grid gap-[16px]">
        <TextField
          id="s-name"
          label="Full name"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <TextField
          id="s-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <PasswordField
          id="s-password"
          label="Password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="grid gap-[6px]">
          <label className="flex cursor-pointer items-start gap-[10px] text-[13px] text-[#5B665F]">
            <input
              id="s-terms"
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              aria-invalid={errors.terms ? true : undefined}
              aria-describedby={errors.terms ? "s-terms-error" : undefined}
              className="mt-[2px] h-[16px] w-[16px] shrink-0 cursor-pointer accent-[#4E9E5C]"
            />
            <span>
              I agree to the{" "}
              <Link href="#" className="font-medium text-[#2E6B3E] hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="#" className="font-medium text-[#2E6B3E] hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {errors.terms && (
            <p id="s-terms-error" className="text-[12px] text-[#B8633A]">
              {errors.terms}
            </p>
          )}
        </div>

        <FormError message={formError} />
        <SubmitButton busy={busy} busyText="Creating account…">
          Create account
        </SubmitButton>
      </form>
    </AuthShell>
  );
}