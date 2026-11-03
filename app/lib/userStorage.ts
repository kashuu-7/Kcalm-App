// Har localStorage key ke aage current user ka email laga deta hai,
// taake ek browser par do accounts ka data mix na ho.
let owner = "";

export function setStorageOwner(email: string | null) {
  owner = (email ?? "").trim().toLowerCase();
}

export const userKey = (base: string) => `u:${owner}:${base}`;

// Is user ka saara browser data hata do (account delete par)
export function clearUserStorage() {
  try {
    const prefix = `u:${owner}:`;
    const dead: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) dead.push(k);
    }
    dead.forEach((k) => localStorage.removeItem(k));
    // Bina user ke naam wali keys
    ["kcalm-profile", "kcalm-plan", "kcalm-targets-cache"].forEach((k) =>
      localStorage.removeItem(k),
    );
  } catch {
    /* ignore */
  }
}