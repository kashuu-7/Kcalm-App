"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import AuthShell from "../../components/auth/AuthShell";
import {
  FormError,
  PasswordField,
  SubmitButton,
} from "../../components/auth/AuthFields";
import { AuthError, resetPassword } from "../../components/auth/authApi";
import { validateNewPassword } from "../../components/auth/validation";

const subscribe = () => () => {};
const readToken = () =>
  new URLSearchParams(window.location.search).get("token");

export default function ResetPasswordPage() {
  // undefined = abhi URL padha nahi (server), null = token hai hi nahi
const token = useSyncExternalStore(subscribe, readToken, () => undefined);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const err = validateNewPassword(password);
    setError(err);
    if (err) {
      document.getElementById("r-password")?.focus();
      return;
    }

    setBusy(true);
    setFormError(null);
    try {
      await resetPassword({ token, newPassword: password });
      setDone(true);
    } catch (caught) {
      setFormError(
        caught instanceof AuthError
          ? caught.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Choose a new"
      accent="password."
      subtitle="Use at least 8 characters."
      footer={
        <Link href="/login" className="font-medium text-[#2E6B3E] hover:underline">
          Back to log in
        </Link>
      }
    >
      {token === undefined ? null : token === null ? (
        <div className="grid gap-[12px]">
          <FormError message="This reset link is invalid or has expired." />
          <Link
            href="/forgot-password"
            className="text-[13.5px] font-medium text-[#2E6B3E] hover:underline"
          >
            Request a new link
          </Link>
        </div>
      ) : done ? (
        <p
          role="status"
          className="rounded-[12px] bg-[#E9F6EC] px-[14px] py-[12px] text-[13.5px] text-[#2E6B3E]"
        >
          Your password has been reset. You can log in now.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="grid gap-[16px]">
          <PasswordField
            id="r-password"
            label="New password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
          />
          <FormError message={formError} />
          <SubmitButton busy={busy} busyText="Saving…">
            Reset password
          </SubmitButton>
        </form>
      )}
    </AuthShell>
  );
}