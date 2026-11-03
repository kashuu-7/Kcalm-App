"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type HelpContextValue = {
  isOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;
};

const HelpContext = createContext<HelpContextValue | null>(null);

export function useHelp() {
  const ctx = useContext(HelpContext);
  if (!ctx) throw new Error("useHelp must be used inside <HelpProvider>");
  return ctx;
}

export function HelpProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openHelp = useCallback(() => setIsOpen(true), []);
  const closeHelp = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openHelp, closeHelp }),
    [isOpen, openHelp, closeHelp],
  );

  return <HelpContext.Provider value={value}>{children}</HelpContext.Provider>;
}