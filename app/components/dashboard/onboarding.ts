// Calibration (onboarding) flow ki settings. Raasta badalna ho to sirf yahan badlo.
export const CALIBRATION_BASE = "/calibration";

export type OnboardingStep = {
  id: string;
  title: string;
  desc: string; // jab ye step chal raha ho tab neeche ye text dikhta hai
  href: string;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "basics",
    title: "Basics",
    desc: "Age, sex, height, weight",
    href: CALIBRATION_BASE,
  },
  {
    id: "about",
    title: "About you",
    desc: "Activity, goals, cooking & food",
    href: `${CALIBRATION_BASE}/about`,
  },
  {
    id: "review",
    title: "Review targets",
    desc: "Calories, macros & micronutrients",
    href: `${CALIBRATION_BASE}/review`,
  },
];

export function isOnboardingPath(pathname: string) {
  return (
    pathname === CALIBRATION_BASE || pathname.startsWith(`${CALIBRATION_BASE}/`)
  );
}

// Abhi kaun sa step chal raha hai (0, 1 ya 2)
export function onboardingStepIndex(pathname: string) {
  const idx = ONBOARDING_STEPS.findIndex((s) => s.href === pathname);
  return idx === -1 ? 0 : idx;
}