"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Leaf,
  Milk,
  Shield,
  Wheat,
  Nut,
  Fish,
  Egg,
  type LucideIcon,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { ApiError } from "../../lib/api/client";
import { fetchDietPrefs, saveDietPrefs } from "../../lib/api/profile";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

type Option = { id: string; label: string; icon: LucideIcon };

const DIET_OPTIONS: Option[] = [
  { id: "vegetarian", label: "Vegetarian", icon: Leaf },
  { id: "lactose-free", label: "Lactose free", icon: Milk },
  { id: "gluten-free", label: "Gluten free", icon: Wheat },
  { id: "halal", label: "Halal", icon: Check },
];

const ALLERGENS: Option[] = [
  { id: "nuts", label: "Nuts", icon: Nut },
  { id: "seafood", label: "Seafood", icon: Fish },
  { id: "eggs", label: "Eggs", icon: Egg },
  { id: "soy", label: "Soy", icon: Leaf },
];

const DIET_IDS = DIET_OPTIONS.map((o) => o.id);
const ALLERGEN_IDS = ALLERGENS.map((o) => o.id);

// Selected hone par rang (yahan se badal sakte ho)
const TONES = {
  green: {
    card: "bg-[#E9F6EC] border-[#4E9E5C]",
    icon: "bg-[#4E9E5C] text-white",
    status: "text-[#2E6B3E]",
  },
  pink: {
    card: "bg-[#FCE9ED] border-[#E9A2B0]",
    icon: "bg-[#D95A74] text-white",
    status: "text-[#C2415C] font-[500]",
  },
};

type ToggleChipProps = {
  label: string;
  icon: LucideIcon;
  on: boolean;
  onToggle: () => void;
  tone: keyof typeof TONES;
  onText: string;
  offText: string;
  disabled: boolean;
};

function ToggleChip({
  label,
  icon: Icon,
  on,
  onToggle,
  tone,
  onText,
  offText,
  disabled,
}: ToggleChipProps) {
  const t = TONES[tone];

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={on}
      className={`flex flex-col items-center gap-1.5 py-[12px] px-[6px] rounded-[14px] border text-[12.5px] text-center cursor-pointer transition-all duration-[250ms] ${
        on ? t.card : "bg-white border-[#1d2a2214] hover:bg-[#F7F9F7]"
      }`}
    >
      <span
        className={`w-[40px] h-[40px] rounded-[50%] grid place-items-center transition-all duration-[250ms] ${
          on ? t.icon : "bg-[#F2F5F2] text-[#1D2A22]"
        }`}
      >
        <Icon size={17} />
      </span>
      {label}
      <small
        className={`text-[10px] transition-colors duration-[250ms] ${
          on ? t.status : "text-[#8E978F]"
        }`}
      >
        {on ? onText : offText}
      </small>
    </button>
  );
}

type Status = "loading" | "ready" | "noprofile" | "error";

const flip = (list: string[], id: string) =>
  list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

export default function Dietary() {
  const [diet, setDiet] = useState<string[]>([]);
  const [excluded, setExcluded] = useState<string[]>([]);
  // Backend mein jo cheezein hain par is page par chip nahi (jaise vegan, wheat):
  // save karte waqt inhe wapas bhejte hain, taake ye ghalti se mit na jayein
  const [hiddenDiet, setHiddenDiet] = useState<string[]>([]);
  const [hiddenAllergens, setHiddenAllergens] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Backend se padho: wahi asli source hai
  useEffect(() => {
    let cancelled = false;
    fetchDietPrefs()
      .then((prefs) => {
        if (cancelled) return;
        if (!prefs) {
          setStatus("noprofile");
          return;
        }
        // Backend "dairy-free" kehta hai, is page par chip ka naam "lactose-free" hai
        const backendDiet = prefs.diet.map((id) => (id === "dairy-free" ? "lactose-free" : id));
        setDiet(backendDiet.filter((id) => DIET_IDS.includes(id)));
        setHiddenDiet(backendDiet.filter((id) => !DIET_IDS.includes(id)));
        setExcluded(prefs.allergens.filter((id) => ALLERGEN_IDS.includes(id)));
        setHiddenAllergens(prefs.allergens.filter((id) => !ALLERGEN_IDS.includes(id)));
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Pehle screen badlo, phir backend mein save; fail ho to wapas purani halat
  const toggle = async (kind: "diet" | "allergen", id: string) => {
    if (status !== "ready" || saving) return;

    const prevDiet = diet;
    const prevExcluded = excluded;
    const nextDiet = kind === "diet" ? flip(diet, id) : diet;
    const nextExcluded = kind === "allergen" ? flip(excluded, id) : excluded;

    setDiet(nextDiet);
    setExcluded(nextExcluded);
    setSaving(true);
    setSaveError(null);

    try {
      await saveDietPrefs({
        diet: [...nextDiet, ...hiddenDiet],
        allergens: [...nextExcluded, ...hiddenAllergens],
      });
    } catch (e) {
      setDiet(prevDiet);
      setExcluded(prevExcluded);
      setSaveError(
        e instanceof ApiError
          ? e.message
          : "Couldn't save your preferences. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const locked = status !== "ready" || saving;

  return (
    <div className="grid gap-[12px]">
      {status === "noprofile" && (
        <p className="text-[13px] text-[#5B665F] bg-[#FFF3CF] rounded-[14px] py-[10px] px-[14px]">
          Finish your{" "}
          <Link href="/calibration" className="underline font-[500]">
            calibration
          </Link>{" "}
          first, then you can save your dietary preferences here.
        </p>
      )}
      {status === "error" && (
        <p
          role="alert"
          className="text-[13px] text-[#C2415C] bg-[#FCE9ED] rounded-[14px] py-[10px] px-[14px]"
        >
          Couldn&apos;t load your preferences. Refresh the page to try again.
        </p>
      )}
      {saveError && (
        <p
          role="alert"
          className="text-[13px] text-[#C2415C] bg-[#FCE9ED] rounded-[14px] py-[10px] px-[14px]"
        >
          {saveError}
        </p>
      )}

      <div className="grid grid-cols-2 max-[940px]:grid-cols-1 gap-[18px]">
        <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
          <div className="flex items-center gap-[10px] mb-[16px]">
            <span className="text-[#4E9E5C]">
              <Leaf size={17} />
            </span>
            <div>
              <h3
                className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
              >
                Dietary preferences
              </h3>
              <small className="text-[#8E978F] ">Shapes your meal plan</small>
            </div>
          </div>
          <div className="grid grid-cols-4 max-sm:grid-cols-2 gap-[10px] ">
            {DIET_OPTIONS.map((o) => (
              <ToggleChip
                key={o.id}
                label={o.label}
                icon={o.icon}
                on={diet.includes(o.id)}
                onToggle={() => toggle("diet", o.id)}
                tone="green"
                onText="Yes"
                offText="No"
                disabled={locked}
              />
            ))}
          </div>
        </article>

        <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
          <div className="flex items-center gap-[10px] mb-[16px]">
            <span className="text-[#D0566B]">
              <Shield size={17} />
            </span>
            <div>
              <h3
                className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
              >
                Allergies &amp; restrictions
              </h3>
              <small className="text-[#8E978F] ">
                Always excluded from recipes
              </small>
            </div>
          </div>
          <div className="grid grid-cols-4 max-sm:grid-cols-2 gap-[10px] ">
            {ALLERGENS.map((o) => (
              <ToggleChip
                key={o.id}
                label={o.label}
                icon={o.icon}
                on={excluded.includes(o.id)}
                onToggle={() => toggle("allergen", o.id)}
                tone="pink"
                onText="Excluded"
                offText="Allowed"
                disabled={locked}
              />
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}