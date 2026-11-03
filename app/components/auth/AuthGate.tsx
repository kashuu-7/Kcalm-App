"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";

// ?next=/profile jaisa param. Sirf apni site ke andar ka path allow hota hai.
export function safeNext(): string | null {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null;
}

/** App ke pages: login nahi to /login par bhej do */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, router, pathname]);

  if (status !== "authenticated") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="grid min-h-screen place-items-center bg-[#F8FAF8] text-[13px] text-[#8E978F]"
      >
        Loading…
      </div>
    );
  }
  return <>{children}</>;
}

/** Login/signup pages: pehle se logged in user ko dashboard par bhej do */
export function GuestGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const wasGuest = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") wasGuest.current = true;
    // Sirf tab jab user pehle se logged in tha. Abhi login karne wale ko
    // form khud sahi jagah bhejta hai (signup ke baad calibration par).
    if (status === "authenticated" && !wasGuest.current) {
      router.replace(safeNext() ?? "/dashboard");
    }
  }, [status, router]);

  return <>{children}</>;
}