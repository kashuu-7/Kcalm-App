"use client";

import { usePathname } from "next/navigation";
import DashboardHeader from "./DashboardHeader";
import { isOnboardingPath } from "./onboarding";

export default function HeaderGate() {
  const pathname = usePathname();

  if (isOnboardingPath(pathname)) return null;
  return <DashboardHeader />;
}