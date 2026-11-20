import { apiFetch, ApiError } from "./client";

// Dev mock mode (NEXT_PUBLIC_USE_MOCK) mein backend nahi hota, to network call skip
const USE_MOCK =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_USE_MOCK === "true";

type UserWithAvatar = { avatar?: string | null };

/** Photo (data URL) backend par save karo. Server ki saved photo wapas milti hai. */
export async function putAvatar(dataUrl: string): Promise<string> {
  if (USE_MOCK) return dataUrl;
  const user = await apiFetch<UserWithAvatar>("/users/me/avatar", {
    method: "PUT",
    json: { image: dataUrl },
  });
  return user.avatar ?? dataUrl;
}

/** Backend se photo hata do (204). Pehle se na ho tab bhi theek hai. */
export async function deleteAvatarOnServer(): Promise<void> {
  if (USE_MOCK) return;
  await apiFetch<void>("/users/me/avatar", { method: "DELETE" });
}

/** Backend ke errors ko user ke liye saaf message bana do */
export function avatarErrorMessage(e: unknown): string {
  if (e instanceof ApiError) {
    if (e.status === 429) {
      const s = e.retryAfter;
      return s
        ? `Too many photo changes. Please try again in ${s} second${s === 1 ? "" : "s"}.`
        : "Too many photo changes. Please try again in a minute.";
    }
    if (e.code === "AVATAR_TOO_LARGE") return "This photo is too large. Try a smaller one.";
    if (e.code === "INVALID_AVATAR") return "Couldn't use this photo. Try a JPG, PNG or WebP.";
    return e.message;
  }
  return e instanceof Error ? e.message : "Couldn't save the photo.";
}