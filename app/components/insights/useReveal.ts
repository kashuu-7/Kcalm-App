"use client";

import { useEffect, useState } from "react";

export default function useReveal(key: string | number) {
  const [revealedFor, setRevealedFor] = useState<string | number | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setRevealedFor(key))
    );
    return () => cancelAnimationFrame(id);
  }, [key]);

  return revealedFor === key;
}