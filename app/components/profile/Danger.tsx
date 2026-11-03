"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Download, Trash2, X } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { apiFetch, ApiError } from "../../lib/api/client";
import { clearUserStorage } from "../../lib/userStorage";
import { useAuth } from "../auth/AuthContext";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export default function Danger() {
  const { signOut } = useAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (confirmOpen && !d.open) {
      setTyped("");
      setDeleteError(null);
      d.showModal();
    } else if (!confirmOpen && d.open) {
      d.close();
    }
  }, [confirmOpen]);

  const exportData = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const data = await apiFetch<unknown>("/users/me/export");
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kcalm-data.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(
        err instanceof ApiError
          ? err.message
          : "Couldn't export your data. Please try again.",
      );
    } finally {
      setExporting(false);
    }
  };

  const deleteAccount = async () => {
    if (typed.trim() !== "DELETE") return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await apiFetch<void>("/users/me", { method: "DELETE" });
      clearUserStorage();
      await signOut();
      // Poora page naya load, taaki login wale redirect se takkar na ho
      window.location.assign("/");
    } catch (err) {
      setDeleteError(
        err instanceof ApiError
          ? err.message
          : "Couldn't delete your account. Please try again.",
      );
      setDeleting(false);
    }
  };

  return (
    <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
      <div className="flex items-center gap-[10px] mb-[16px]">
        <span className="text-[#D0566B]">
          <Trash2 size={17} />
        </span>
        <div>
          <h3
            className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            Danger zone
          </h3>
          <small className="text-[#8E978F]">Manage your account data</small>
        </div>
      </div>

      <button
        type="button"
        onClick={exportData}
        disabled={exporting}
        className="flex items-center gap-3 py-[12px] px-[4px] border-b border-[#1d2a2214] text-sm w-full text-left cursor-pointer hover:bg-[#F8FAF8] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
      >
        <span className="w-[34px] h-[34px] rounded-[11px] bg-[#F2F5F2] grid place-items-center">
          <Download size={15} />
        </span>
        Download my data (JSON)
        <span className="ml-auto flex items-center gap-[8px] text-[#8e978f] text-[12.5px]">
          {exporting ? "Preparing…" : <ChevronRight size={15} />}
        </span>
      </button>
      {exportError && (
        <p role="alert" className="px-[4px] pt-[8px] text-[12.5px] text-[#B8633A]">
          {exportError}
        </p>
      )}

      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        aria-haspopup="dialog"
        className="text-[#A3263D] flex items-center gap-3 py-[12px] px-[4px] border-b border-[#1d2a2214] text-sm w-full text-left cursor-pointer hover:bg-[#F8FAF8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
      >
        <span className="w-[34px] h-[34px] rounded-[11px] bg-[#FDE8EC] grid place-items-center">
          <Trash2 size={15} />
        </span>
        Delete account
        <span className="ml-auto flex items-center gap-[8px] text-[#8e978f] text-[12.5px]">
          <ChevronRight size={15} />
        </span>
      </button>

      {/* delete confirm */}
      <dialog
        ref={dialogRef}
        aria-labelledby="delTitle"
        onClose={() => setConfirmOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget && !deleting) setConfirmOpen(false);
        }}
        className="m-auto w-[min(440px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] overflow-auto rounded-[24px] border border-[#1d2a2214] bg-white p-0 text-[#1D2A22] shadow-[0_30px_60px_-20px_rgba(29,42,34,0.4)] backdrop:bg-[#1d2a22]/35 backdrop:backdrop-blur-[3px]"
      >
        <div className="p-[22px]">
          <div className="mb-[12px] flex items-start justify-between gap-[12px]">
            <h2
              id="delTitle"
              className={`${bricolage.className} text-[20px] font-semibold leading-[1.1] tracking-[-.03em] text-[#A3263D]`}
            >
              Delete your account?
            </h2>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              disabled={deleting}
              aria-label="Close"
              className="grid h-[32px] w-[32px] shrink-0 cursor-pointer place-items-center rounded-full border border-[#1d2a2224] transition-colors duration-200 hover:bg-[#F2F5F2] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-[13.5px] text-[#5B665F]">
            This permanently deletes your profile, meal plans, logs and
            everything else. This can&apos;t be undone. You can download your
            data first.
          </p>

          <label htmlFor="del-confirm" className="mt-[16px] block text-[13px] font-medium">
            Type <b>DELETE</b> to confirm
          </label>
          <input
            id="del-confirm"
            type="text"
            autoComplete="off"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            className="mt-[6px] w-full rounded-[12px] border border-[#1d2a2224] bg-white px-[14px] py-[12px] text-[14px] focus:outline-2 focus:outline-offset-1 focus:outline-[#D0566B] focus:[outline-style:solid]"
          />

          {deleteError && (
            <p
              role="alert"
              className="mt-[12px] rounded-[12px] bg-[#FFEFE7] px-[12px] py-[10px] text-[13px] text-[#A4502B]"
            >
              {deleteError}
            </p>
          )}

          <div className="mt-[20px] flex justify-end gap-[10px]">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              disabled={deleting}
              className="cursor-pointer rounded-full border border-[#1d2a2224] bg-white px-[18px] py-[9px] text-[14px] font-medium transition-colors duration-200 hover:bg-[#F2F5F2] disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={deleteAccount}
              disabled={typed.trim() !== "DELETE" || deleting}
              className="cursor-pointer rounded-full bg-[#A3263D] px-[18px] py-[9px] text-[14px] font-medium text-white transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete account"}
            </button>
          </div>
        </div>
      </dialog>
    </article>
  );
}