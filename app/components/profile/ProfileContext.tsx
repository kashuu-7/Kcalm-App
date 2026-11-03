"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import EditProfileModal from "./EditProfileModal";
import { useAuth } from "../auth/AuthContext";
import { ApiError, apiFetch } from "../../lib/api/client";
import { refreshTargets, useTargets } from "./useTargets";
import {
  fetchProfile,
  goalLabelToId,
  upsertProfile,
  type ProfileFields,
} from "../../lib/api/profile";

export type ProfileData = {
  name: string;
  email: string;
  age: number;
  sex: string;
  height: number;
  weight: number;
  calories: number;
  goal: string;
};

export const DEFAULT_PROFILE: ProfileData = {
  name: "",
  email: "",
  age: 28,
  sex: "Male",
  height: 175,
  weight: 70,
  calories: 2280,
  goal: "Maintain weight",
};

const STORAGE_KEY = "kcalm-profile";

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

type ProfileContextValue = {
  profile: ProfileData;
  isEditOpen: boolean;
  openEdit: () => void;
  closeEdit: () => void;
  // Backend par save karta hai. null = ho gaya, string = error ka message
  saveProfile: (next: ProfileData, extra?: ProfileFields) => Promise<string | null>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider>");
  return ctx;
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const authEmail = user?.email;
  const authName = user?.name;

  const [profile, setProfile] = useState<ProfileData>(() => ({
    ...DEFAULT_PROFILE,
    name: authName ?? "",
    email: authEmail ?? "",
  }));

  const [isEditOpen, setIsEditOpen] = useState(false);
  const targets = useTargets();

// Login par (aur account badalne par) backend se targets lao
useEffect(() => {
  if (authEmail) void refreshTargets(authEmail);
}, [authEmail]);

  // Profile hamesha login wale account ka hona chahiye
  useEffect(() => {
    if (!authEmail) return;
    let cancelled = false;

    const fresh = {
      ...DEFAULT_PROFILE,
      name: authName ?? DEFAULT_PROFILE.name,
      email: authEmail,
    };

    // 1) Browser ka saved profile (naam, calories ke liye)
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved = raw ? JSON.parse(raw) : null;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage mount ke baad padhte hain (hydration)
      setProfile(
        saved?.email?.toLowerCase() === authEmail.toLowerCase()
          ? { ...DEFAULT_PROFILE, ...saved }
          : fresh,
      );
    } catch {
      setProfile(fresh);
    }

    // 2) Backend ka profile: age, sex, height, weight, goal wahan se aate hain
    fetchProfile().then((b) => {
      if (cancelled || !b) return;
      setProfile((p) => ({ ...p, ...b }));
    });

    return () => {
      cancelled = true;
    };
  }, [authEmail, authName]);

  const openEdit = useCallback(() => setIsEditOpen(true), []);
  const closeEdit = useCallback(() => setIsEditOpen(false), []);

  const saveProfile = useCallback(
    async (next: ProfileData, extra?: ProfileFields): Promise<string | null> => {
      // Pehle backend, tabhi screen par badlo (galat data na dikhe)
      try {
        if (next.name.trim() !== authName) {
          await apiFetch("/users/me", {
            method: "PATCH",
            json: { full_name: next.name.trim() },
          });
        }
        await upsertProfile({
          age: next.age,
          sex: next.sex,
          height: next.height,
          weight: next.weight,
          goal: goalLabelToId(next.goal),
          ...extra,
        });
      } catch (e) {
        return e instanceof ApiError
          ? e.message
          : "Couldn't save your profile. Please try again.";
      }

      setProfile(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      if (authEmail) void refreshTargets(authEmail);
      setIsEditOpen(false);
      return null;
    },
    [authEmail, authName],
  );

  const value = useMemo(
  () => ({
    profile: {
      ...profile,
      calories: targets.ready ? targets.calories : profile.calories,
    },
    isEditOpen,
    openEdit,
    closeEdit,
    saveProfile,
  }),
  [profile, targets.ready, targets.calories, isEditOpen, openEdit, closeEdit, saveProfile],
);

  return (
    <ProfileContext.Provider value={value}>
      {children}
      {/* modal poori app mein sirf ek baar */}
      <EditProfileModal />
    </ProfileContext.Provider>
  );
}
