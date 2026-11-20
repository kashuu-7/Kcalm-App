"use client";

import { useSyncExternalStore } from "react";
import { userKey } from "../../lib/userStorage";
import {
  avatarErrorMessage,
  deleteAvatarOnServer,
  putAvatar,
} from "../../lib/api/avatar";

const SIZE = 256; // photo ko 256x256 ka chhota square bana ke bhejte hain (backend limit 300 KB)
const MAX_FILE_MB = 8;

// Asli photo backend par hai. localStorage sirf cache hai, taake page jaldi dikhe.
const listeners = new Set<() => void>();
const keyFor = () => userKey("avatar");
const syncedKeyFor = () => userKey("avatar-synced");

function readKey(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function read(): string | null {
  return readKey(keyFor());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb); // doosre tab mein badle to yahan bhi
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function emit() {
  listeners.forEach((l) => l());
}

// Cache likho ya hata do. Na likha jaye (storage full) to bhi app chalti rahe.
function writeCache(key: string, value: string | null) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  emit();
}

/** User ki photo (data URL). Photo na ho to null, tab naam ke harf dikhte hain. */
export function useAvatarSrc(): string | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

// Photo ko beech se square kaato aur 256x256 ki chhoti JPEG bana do
function toSquareJpeg(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - side) / 2;
      const sy = (img.naturalHeight - side) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Couldn't process this image."));
        return;
      }
      ctx.fillStyle = "#ffffff"; // transparent PNG ke peeche safed
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read this image. Try a JPG, PNG or WebP."));
    };
    img.src = url;
  });
}

/** Photo chuno: resize karo, backend par save karo, kamyab ho to hi screen par badlo. */
export async function setAvatarFromFile(file: File): Promise<void> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    throw new Error(`Image is too large (max ${MAX_FILE_MB} MB).`);
  }
  const dataUrl = await toSquareJpeg(file);
  const key = keyFor();
  try {
    const saved = await putAvatar(dataUrl);
    writeCache(key, saved);
  } catch (e) {
    // Fail ho to purani photo wese hi rehti hai
    throw new Error(avatarErrorMessage(e));
  }
}

/** Photo hatao: pehle backend se, phir is device se. */
export async function removeAvatar(): Promise<void> {
  const key = keyFor();
  try {
    await deleteAvatarOnServer();
  } catch (e) {
    throw new Error(avatarErrorMessage(e));
  }
  writeCache(key, null);
}

/**
 * Login ya session check ke baad chalao: backend ki photo is device par utaro.
 * Backend hamesha jeetta hai (kisi aur device par badli ya hataai ho to yahan bhi wohi).
 *
 * Sirf ek baar (har user + device par): agar backend par photo nahi magar is device par
 * purani local photo hai (jab photo sirf browser mein save hoti thi), to use backend par
 * chadha do. Dobara kabhi nahi, warna doosre device se hataai hui photo wapas aa jati.
 */
export async function syncAvatarFromServer(server: string | null): Promise<void> {
  // Keys abhi pakdo: await ke baad user badal bhi jaye to galat key na likhi jaye
  const key = keyFor();
  const flag = syncedKeyFor();
  const markSynced = () => {
    try {
      localStorage.setItem(flag, "1");
    } catch {
      /* ignore */
    }
  };

  if (server) {
    writeCache(key, server);
    markSynced();
    return;
  }

  const local = readKey(key);
  if (local && readKey(flag) !== "1") {
    try {
      await putAvatar(local);
      markSynced();
    } catch {
      /* abhi upload na ho saka: local photo rehne do, agle login par dobara try hoga */
    }
    return;
  }

  markSynced();
  writeCache(key, null);
}