"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "../../components/auth/AuthShell";
import {
  FormError,
  SubmitButton,
  TextField,
} from "../../components/auth/AuthFields";
import { requestPasswordReset } from "../../components/auth/authApi";
import { validateEmail } from "../../components/auth/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    if (err) {
      document.getElementById("f-email")?.focus();
      return;
    }

    setBusy(true);
    setFormError(null);
    try {
      await requestPasswordReset(email.trim());
      setSentTo(email.trim());
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Reset your"
      accent="password."
      subtitle="Enter your email and we'll send you a link to set a new one."
      footer={
        <Link href="/login" className="font-medium text-[#2E6B3E] hover:underline">
          Back to log in
        </Link>
      }
    >
      {sentTo ? (
        <p
          role="status"
          className="rounded-[12px] bg-[#E9F6EC] px-[14px] py-[12px] text-[13.5px] text-[#2E6B3E]"
        >
          If an account exists for <b>{sentTo}</b>, a reset link is on its way.
          Check your inbox.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="grid gap-[16px]">
          <TextField
            id="f-email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          <FormError message={formError} />
          <SubmitButton busy={busy} busyText="Sending…">
            Send reset link
          </SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}