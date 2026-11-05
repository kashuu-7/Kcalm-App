"use client";

import { useLayoutEffect } from "react";
import { applyTheme, THEME_KEY } from "./ThemeToggle";

export default function ThemeScope() {
  useLayoutEffect(() => {
    let dark = false;
    try {
      dark = localStorage.getItem(THEME_KEY) === "dark";
    } catch {
      /* ignore */
    }
    applyTheme(dark);
    // App se bahar (landing / login) hamesha light
    return () => applyTheme(false);
  }, []);

  return null;
}