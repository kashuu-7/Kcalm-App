export class ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, unknown>;

  constructor(
    status: number,
    message: string,
    code?: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type ErrorBody = {
  error?: { code?: string; message?: string; details?: Record<string, unknown> };
};

// FastAPI ke validation errors se pehla saaf message nikalo
function validationMessage(details?: Record<string, unknown>): string | null {
  const errors = details?.errors;
  if (!Array.isArray(errors) || errors.length === 0) return null;
  const first = errors[0] as { loc?: unknown[]; msg?: string };
  if (!first.msg) return null;
  const field = first.loc?.[first.loc.length - 1];
  return typeof field === "string" ? `${field}: ${first.msg}` : first.msg;
}

// Next ka proxy (app/api/[...path]/route.ts), backend ka /api/v1 yahan nahi likhna
const BASE = "/api";

export async function apiFetch<T>(
  path: string,
  init: { method?: string; json?: unknown; headers?: Record<string, string> } = {},
): Promise<T> {
  const { json, headers, method } = init;

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: json !== undefined ? JSON.stringify(json) : undefined,
    });
  } catch {
    throw new ApiError(
      0,
      "Can't reach the server. Check your connection and try again.",
      "network",
    );
  }

  if (res.status === 204) return undefined as T;

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* body khali ya JSON nahi */
  }

  if (!res.ok) {
    const e = (data as ErrorBody | null)?.error;
    throw new ApiError(
      res.status,
      validationMessage(e?.details) ??
        e?.message ??
        "Something went wrong. Please try again.",
      e?.code,
      e?.details,
    );
  }
  return data as T;
}