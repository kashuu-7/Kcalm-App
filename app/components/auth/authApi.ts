import { apiFetch, ApiError } from "../../lib/api/client";
import * as mock from "./authMock";
import { AuthError } from "./authMock";
import type { AuthUser } from "./authMock";
import { setStorageOwner, userKey } from "../../lib/userStorage";

export type { AuthUser };
export { AuthError };

const USE_MOCK =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_USE_MOCK === "true";

const EP = {
  me: "/auth/me",
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
  forgot: "/auth/forgot-password",
  reset: "/auth/reset-password",
};

type BackendUser = {
  id: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
};

const PROFILE_KEY = "kcalm-profile";
const PLAN_KEY = "kcalm-plan";

// Backend ka full_name authoritative hai; local profile ek legacy fallback hai.
function toUser(u: BackendUser): AuthUser {
  let name = u.full_name?.trim() || u.email.split("@")[0];
  try {
    const p = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? "null");
    if (!u.full_name && p?.email?.toLowerCase() === u.email.toLowerCase() && p?.name) {
      name = p.name;
    }
  } catch {
    /* ignore */
  }
  return { id: u.id, email: u.email, name };
}

// Forms AuthError pakadte hain, to backend ke errors ko wahi bana do
async function wrap<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ApiError) throw new AuthError(e.message);
    throw e;
  }
}

export async function getSession(): Promise<AuthUser | null> {
  if (USE_MOCK) return mock.getSession();
  try {
    return toUser(await apiFetch<BackendUser>(EP.me));
  } catch {
    return null; // 401 ya backend band: logged out maano
  }
}

export async function signIn(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  if (USE_MOCK) return mock.signIn(input);
  return wrap(async () => {
    await apiFetch(EP.login, {
      method: "POST",
      json: { email: input.email.trim(), password: input.password },
    });
    return toUser(await apiFetch<BackendUser>(EP.me));
  });
}

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
  plan?: "basic" | "plus" | "premium";
}): Promise<AuthUser> {
  if (USE_MOCK) return mock.signUp(input);
  return wrap(async () => {
    const email = input.email.trim().toLowerCase();

    await apiFetch(EP.register, {
      method: "POST",
      json: { email, password: input.password, full_name: input.name.trim() },
    });

try {
  await apiFetch(EP.login, { method: "POST", json: { email, password: input.password } });
} catch {
  throw new AuthError("Your account was created. Please log in to continue.");
}

    // Plan selection abhi local hai; backend par membership change endpoint nahi hai.
    setStorageOwner(email);
    try {
      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({ name: input.name.trim(), email }),
      );
      localStorage.setItem(userKey(PLAN_KEY), input.plan ?? "basic");
    } catch {
      /* ignore */
    }

    return toUser(await apiFetch<BackendUser>(EP.me));
  });
}

export async function signOut(): Promise<void> {
  if (USE_MOCK) return mock.signOut();
  try {
    await apiFetch<void>(EP.logout, { method: "POST" });
  } catch {
    /* server na bhi mile to local logout ho jaye */
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (USE_MOCK) return mock.requestPasswordReset(email);
  await wrap(() =>
    apiFetch(EP.forgot, { method: "POST", json: { email: email.trim() } }),
  );
}

export async function resetPassword(input: {
  token: string;
  newPassword: string;
}): Promise<void> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return;
  }
  await wrap(() =>
    apiFetch(EP.reset, {
      method: "POST",
      json: { token: input.token, new_password: input.newPassword },
    }),
  );
}
