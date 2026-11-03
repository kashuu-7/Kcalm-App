import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:8001";
const API_PREFIX = "/api/v1";
const ACCESS = "kcalm_token";
const REFRESH = "kcalm_refresh";

// Backend ke sab route prefixes
const ALLOWED = new Set([
  "auth", "users", "nutrition", "foods", "recipes", "meal-plans",
  "weekly-meal-plans", "grocery-lists", "recipe-execution-sessions",
  "insights", "achievements", "habits", "weight-logs", "steps",
  "notifications", "ai", "integrations", "daily-metrics",
]);

type Ctx = { params: Promise<{ path: string[] }> };
type Store = Awaited<ReturnType<typeof cookies>>;
type Tokens = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
};

const base = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

function saveTokens(store: Store, t: Tokens) {
  store.set(ACCESS, t.access_token, { ...base, maxAge: t.expires_in });
  if (t.refresh_token) {
    store.set(REFRESH, t.refresh_token, { ...base, maxAge: t.refresh_expires_in });
  }
}

function clearTokens(store: Store) {
  store.delete(ACCESS);
  store.delete(REFRESH);
}

const fail = (status: number, code: string, message: string) =>
  NextResponse.json({ error: { code, message, details: {} } }, { status });

async function refreshSession(store: Store): Promise<string | null> {
  const refresh = store.get(REFRESH)?.value;
  if (!refresh) return null;
  try {
    const r = await fetch(`${API_URL}${API_PREFIX}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refresh }),
      cache: "no-store",
    });
    if (!r.ok) {
  // Refresh token expire ya revoke: dono cookies saaf kar do
  if (r.status === 401 || r.status === 403) clearTokens(store);
  return null;
}
    const data = (await r.json()) as Tokens;
    saveTokens(store, data);
    return data.access_token;
  } catch {
    return null;
  }
}

async function handler(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  if (path.some((p) => p === ".." || p === ".") || !ALLOWED.has(path[0])) {
    return fail(404, "NOT_FOUND", "Not found");
  }
  const joined = path.join("/");
  const store = await cookies();

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;
  const contentType = req.headers.get("content-type");

    // Asli user ka IP backend tak pahunchao (backend ki rate limit isi IP par chalti hai)
  const clientIp =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    null;

  const send = (token?: string) => {
    const headers = new Headers({ Accept: "application/json" });
    if (contentType) headers.set("Content-Type", contentType);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (clientIp) headers.set("X-Forwarded-For", clientIp);
    return fetch(`${API_URL}${API_PREFIX}/${joined}${req.nextUrl.search}`, {
      method: req.method,
      headers,
      body,
      cache: "no-store",
    });
  };

    // Logout: pehle backend ko batao (wo is user ke saare tokens band kar deta hai), phir cookies hatao
  if (joined === "auth/logout" && req.method === "POST") {
    try {
      const access = store.get(ACCESS)?.value;
      const r = access ? await send(access) : null;
      if (!r || r.status === 401) {
        // Access token purana ho gaya ho to refresh se naya lekar logout karo
        const fresh = await refreshSession(store);
        if (fresh) await send(fresh);
      }
    } catch {
      /* backend band ho to bhi is browser se nikal do */
    }
    clearTokens(store);
    return new NextResponse(null, { status: 204 });
  }

  let token = store.get(ACCESS)?.value;
  let upstream: Response;
  try {
    upstream = await send(token);
    // Access token expire: refresh se naya lo aur ek baar dobara try karo
    if (upstream.status === 401 && joined !== "auth/login") {
      const fresh = await refreshSession(store);
      if (fresh) {
        token = fresh;
        upstream = await send(fresh);
      }
    }
  } catch {
    return fail(502, "BACKEND_UNREACHABLE", "Can't reach the server. Is the backend running?");
  }

  // Login: tokens browser ko nahi, httpOnly cookies mein jate hain
  if (joined === "auth/login" && req.method === "POST" && upstream.ok) {
    let data: Tokens | null = null;
    try { data = (await upstream.json()) as Tokens; } catch { /* neeche handle */ }
    if (!data?.access_token) return fail(502, "BAD_UPSTREAM", "Unexpected server response.");
    saveTokens(store, data);
    return NextResponse.json({ ok: true });
  }

  if (upstream.status === 401 && token) clearTokens(store);
  if (upstream.status === 204) return new NextResponse(null, { status: 204 });

  return new NextResponse(await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("content-type") ?? "application/json" },
  });
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
