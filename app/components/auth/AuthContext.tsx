"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as api from "./authApi";
import type { AuthUser } from "./authApi";
import { setStorageOwner } from "../../lib/userStorage";

type Status = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: AuthUser | null;
  status: Status;
  signIn: typeof api.signIn;
  signUp: typeof api.signUp;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  // Page khulte hi purani session wapas check karo
  useEffect(() => {
    let cancelled = false;
    api.getSession().then((u) => {
  if (cancelled) return;
  setStorageOwner(u?.email ?? null);   
  setUser(u);
  setStatus(u ? "authenticated" : "unauthenticated");
});

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback<AuthContextValue["signIn"]>(async (input) => {
  const u = await api.signIn(input);
  setStorageOwner(u.email);            
  setUser(u);
  setStatus("authenticated");
  return u;
}, []);

  const signUp = useCallback<AuthContextValue["signUp"]>(async (input) => {
  const u = await api.signUp(input);
  setStorageOwner(u.email);            
  setUser(u);
  setStatus("authenticated");
  return u;
}, []);

  const signOut = useCallback(async () => {
  await api.signOut();
  setStorageOwner(null);              
  setUser(null);
  setStatus("unauthenticated");
}, []);

  const value = useMemo(
    () => ({ user, status, signIn, signUp, signOut }),
    [user, status, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}