"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { apiFetch, ApiError } from "../../lib/api/client";
import { useAuth } from "../auth/AuthContext";
import { FormError, PasswordField, SubmitButton } from "../auth/AuthFields";
import { validateNewPassword } from "../auth/validation";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Errors = { current?: string; next?: string; confirm?: string };

export default function ChangePasswordDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const { signOut } = useAuth();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      setCurrent("");
      setNext("");
      setConfirm("");
      setErrors({});
      setFormError(null);
      setBusy(false);
      setDone(false);
      d.showModal();
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs: Errors = {
      current: current ? undefined : "Enter your current password",
      next:
        validateNewPassword(next) ??
        (next === current ? "Choose a different password" : undefined),
      confirm: confirm === next ? undefined : "Passwords don't match",
    };
    setErrors(errs);

    const first = (["current", "next", "confirm"] as const).find((k) => errs[k]);
    if (first) {
      document.getElementById(`cp-${first}`)?.focus();
      return;
    }

    setBusy(true);
    setFormError(null);
    try {
      await apiFetch("/auth/change-password", {
        method: "POST",
        json: { current_password: current, new_password: next },
      });
      setDone(true);
      // Backend purane tokens band kar deta hai, to dobara login karna padega
      setTimeout(async () => {
        await signOut();
        router.replace("/login");
      }, 2200);
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "Couldn't change your password. Please try again.",
      );
      setBusy(false);
    }
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="cpTitle"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget && !done) onClose();
      }}
      className="m-auto w-[min(440px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] overflow-auto rounded-[24px] border border-[#1d2a2214] bg-white p-0 text-[#1D2A22] shadow-[0_30px_60px_-20px_rgba(29,42,34,0.4)] backdrop:bg-[#1d2a22]/35 backdrop:backdrop-blur-[3px]"
    >
      <div className="p-[22px]">
        <div className="mb-[16px] flex items-start justify-between gap-[12px]">
          <div>
            <h2
              id="cpTitle"
              className={`${bricolage.className} text-[20px] font-semibold leading-[1.1] tracking-[-.03em]`}
            >
              Change password
            </h2>
            <p className="mt-[4px] text-[13px] text-[#8E978F]">
              You&apos;ll be logged out after changing it.
            </p>
          </div>
          {!done && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-[32px] w-[32px] shrink-0 cursor-pointer place-items-center rounded-full border border-[#1d2a2224] transition-colors duration-200 hover:bg-[#F2F5F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {done ? (
          <p
            role="status"
            className="rounded-[12px] bg-[#E9F6EC] px-[14px] py-[12px] text-[13.5px] text-[#2E6B3E]"
          >
            Password changed. Redirecting you to log in…
          </p>
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-[14px]">
            <PasswordField
              id="cp-current"
              label="Current password"
              autoComplete="current-password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              error={errors.current}
            />
            <PasswordField
              id="cp-next"
              label="New password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              error={errors.next}
            />
            <PasswordField
              id="cp-confirm"
              label="Confirm new password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={errors.confirm}
            />
            <FormError message={formError} />
            <SubmitButton busy={busy} busyText="Saving…">
              Change password
            </SubmitButton>
          </form>
        )}
      </div>
    </dialog>
  );
}