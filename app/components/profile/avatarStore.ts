"use client";

import { useSyncExternalStore } from "react";
import { userKey } from "../../lib/userStorage";

const SIZE = 256; // photo ko 256x256 ka chhota square bana ke rakhte hain
const MAX_FILE_MB = 8;

const listeners = new Set<() => void>();
const keyFor = () => userKey("avatar");

function read(): string | null {
  try {
    return localStorage.getItem(keyFor());
  } catch {
    return null;
  }
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

export async function setAvatarFromFile(file: File): Promise<void> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    throw new Error(`Image is too large (max ${MAX_FILE_MB} MB).`);
  }
  const dataUrl = await toSquareJpeg(file);
  try {
    localStorage.setItem(keyFor(), dataUrl);
  } catch {
    throw new Error("Couldn't save the photo on this device.");
  }
  emit();
}

export function removeAvatar() {
  try {
    localStorage.removeItem(keyFor());
  } catch {
    /* ignore */
  }
  emit();
}