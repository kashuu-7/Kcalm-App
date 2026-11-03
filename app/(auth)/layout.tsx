import type { ReactNode } from "react";
import { GuestGate } from "../components/auth/AuthGate";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <GuestGate>{children}</GuestGate>;
}