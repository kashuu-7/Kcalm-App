"use client";

import { useState } from "react";
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
import { safeNext } from "../../components/auth/AuthGate";
import {
  validateEmail,
  validatePassword,
} from "../../components/auth/validation";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(errs);
    if (errs.email || errs.password) {
      document.getElementById(errs.email ? "l-email" : "l-password")?.focus();
      return;
    }

    setBusy(true);
    setFormError(null);
    try {
      await signIn({ email: email.trim(), password });
      router.push(safeNext() ?? "/dashboard");
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
      title="Welcome"
      accent="back."
      subtitle="Log in to see today's plan and pick up where you left off."
      footer={
        <>
          New to Kcalm?{" "}
          <Link href="/signup" className="font-medium text-[#2E6B3E] hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="grid gap-[16px]">
        <TextField
          id="l-email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <PasswordField
          id="l-password"
          label="Password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          aside={
            <Link
              href="/forgot-password"
              className="text-[12.5px] font-medium text-[#2E6B3E] hover:underline"
            >
              Forgot password?
            </Link>
          }
        />

        <FormError message={formError} />
        <SubmitButton busy={busy} busyText="Logging in…">
          Log in
        </SubmitButton>
      </form>
    </AuthShell>
  );
}