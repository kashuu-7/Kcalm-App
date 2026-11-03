export type AuthUser = { id: string; name: string; email: string };

export class AuthError extends Error {}

const SESSION_KEY = "kcalm-session";
const PROFILE_KEY = "kcalm-profile";

const wait = (ms = 500) => new Promise((r) => setTimeout(r, ms));

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function writeSession(user: AuthUser) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {
    /* ignore */
  }
}

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now());

/* ------------------------------------------------------------------
   BACKEND AANE PAR: neeche ke 5 functions fetch() se replace karne hain.
   Password kabhi localStorage mein save nahi hota (mock mein bhi nahi).
------------------------------------------------------------------ */

// GET /api/auth/me  ->  { id, name, email } ya 401
export async function getSession(): Promise<AuthUser | null> {
  return readSession();
}

// POST /api/auth/login  { email, password }
export async function signIn(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  await wait();
  const email = input.email.trim().toLowerCase();

  // MOCK: sahi format wali koi bhi email chal jati hai.
  // Naam: agar isi email ka profile pehle se saved hai to wahi, warna email ka pehla hissa.
  let name = email.split("@")[0];
  try {
    const p = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "null");
    if (p?.email?.toLowerCase() === email && p?.name) name = p.name;
  } catch {
    /* ignore */
  }

  const user = { id: newId(), name, email };
  writeSession(user);
  return user;
}

// POST /api/auth/signup  { name, email, password }
const PLAN_KEY = "kcalm-plan";

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
  plan?: "basic" | "plus" | "premium";
}): Promise<AuthUser> {
  await wait();
  const user = {
    id: newId(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
  };
  writeSession(user);

  try {
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({ name: user.name, email: user.email }),
    );
    localStorage.setItem(PLAN_KEY, input.plan ?? "basic");
  } catch {
    /* ignore */
  }
  return user;
}

// POST /api/auth/logout
export async function signOut(): Promise<void> {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}

// POST /api/auth/forgot-password  { email }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function requestPasswordReset(_email: string): Promise<void> {
  await wait();
}
