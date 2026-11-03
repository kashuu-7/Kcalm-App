"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  ChefHat,
  Home,
  Play,
  Search,
  ShoppingBasket,
  ShoppingCart,
  Target,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { searchRecipes, type RecipeSummary } from "../../lib/api/recipes";
import { ONBOARDING_STEPS } from "./onboarding";
import { ALL_GROUPS, useGrocery } from "../smart-grocery/groceryStore";

/* ---------- search data ---------- */

type GroupName = "Pages" | "Recipes" | "Groceries";

type SearchItem = {
  id: string;
  group: GroupName;
  label: string;
  hint?: string; // right side ka chhota text
  keywords?: string; // extra shabd jin se bhi item mile
  href: string;
  Icon: LucideIcon;
};

const PAGES: SearchItem[] = [
  { id: "page-dashboard", group: "Pages", label: "Dashboard", href: "/dashboard", Icon: Home, keywords: "home overview today" },
  { id: "page-daily-plan", group: "Pages", label: "Daily Plan", href: "/daily-plan", Icon: CalendarDays, keywords: "meals schedule snack swap" },
  { id: "page-recipe-player", group: "Pages", label: "Recipe Player", href: "/recipe-player", Icon: Play, keywords: "cook steps video" },
  { id: "page-smart-grocery", group: "Pages", label: "Smart Grocery", href: "/smart-grocery", Icon: ShoppingCart, keywords: "shopping list ingredients" },
  { id: "page-insights", group: "Pages", label: "Insights", href: "/insights", Icon: BarChart3, keywords: "progress weight steps habits" },
  { id: "page-profile", group: "Pages", label: "Profile", href: "/profile", Icon: UserRound, keywords: "account settings plan" },
  { id: "page-recalibrate", group: "Pages", label: "Recalibrate targets", href: ONBOARDING_STEPS[0].href, Icon: Target, keywords: "calibration onboarding calories macros" },
];

const toRecipeItem = (r: RecipeSummary): SearchItem => ({
  id: `recipe-${r.id}`,
  group: "Recipes",
  label: r.name,
  hint: `${r.total_time_minutes} min${r.difficulty ? ` · ${r.difficulty}` : ""}`,
  href: `/recipe-player?recipe=${r.id}`,
  Icon: ChefHat,
});

const matches = (item: SearchItem, q: string) =>
  `${item.label} ${item.keywords ?? ""}`.toLowerCase().includes(q);

/* ---------- component ---------- */

export default function SearchPalette() {
  const router = useRouter();
  const { items: groceryItems } = useGrocery();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const q = query.trim().toLowerCase();

  const [defaultRecipes, setDefaultRecipes] = useState<SearchItem[]>([]);
const [found, setFound] = useState<SearchItem[]>([]);

// Khali search par dikhane ke liye pehli kuch recipes (ek hi baar)
useEffect(() => {
  let cancelled = false;
  searchRecipes(null, 5)
    .then((r) => {
      if (!cancelled) setDefaultRecipes(r.map(toRecipeItem));
    })
    .catch(() => {});
  return () => {
    cancelled = true;
  };
}, []);

// Likhte waqt backend mein recipes dhoondo (thodi der ruk kar)
useEffect(() => {
  const term = query.trim();
  if (!term) {
    setFound([]);
    return;
  }
  let cancelled = false;
  const t = setTimeout(() => {
    searchRecipes(term)
      .then((r) => {
        if (!cancelled) setFound(r.map(toRecipeItem));
      })
      .catch(() => {
        if (!cancelled) setFound([]);
      });
  }, 250);
  return () => {
    cancelled = true;
    clearTimeout(t);
  };
}, [query]);

const results = useMemo<SearchItem[]>(() => {
  if (!q) return [...PAGES, ...defaultRecipes];

  const groceries: SearchItem[] = groceryItems.map((g) => ({
    id: `grocery-${g.id}`,
    group: "Groceries",
    label: g.name,
    hint: `${ALL_GROUPS.find((a) => a.id === g.aisle)?.label ?? ""} · ${g.qty}`,
    href: "/smart-grocery",
    Icon: ShoppingBasket,
  }));

  return [
    ...PAGES.filter((p) => matches(p, q)),
    ...found,
    ...groceries.filter((g) => matches(g, q)).slice(0, 8),
  ];
}, [q, groceryItems, defaultRecipes, found]);

  const openPalette = useCallback(() => {
    const d = dialogRef.current;
    if (!d || d.open) return;
    setQuery("");
    setActive(0);
    d.showModal();
    inputRef.current?.focus();
  }, []);

  const closePalette = () => dialogRef.current?.close();

  const go = (item: SearchItem) => {
    closePalette();
    router.push(item.href);
  };

  // Ctrl+K / Cmd+K se kahin se bhi kholo ya band karo
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "k") return;
      const d = dialogRef.current;
      if (!d) return;

      // koi aur modal khula ho (jaise Edit profile) to kuch mat karo
      const other = document.querySelector("dialog[open]");
      if (other && other !== d) return;

      e.preventDefault();
      if (d.open) d.close();
      else openPalette();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openPalette]);

  // Arrow keys se neeche jao to active item list mein dikhta rahe
  useEffect(() => {
    document
      .getElementById(`sp-opt-${active}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item) go(item);
    }
  };

  return (
    <>
      {/* trigger button (header mein dikhta hai) */}
      <button
        type="button"
        onClick={openPalette}
        aria-haspopup="dialog"
        className="flex items-center gap-2 bg-white border border-[#1d2a2214] rounded-full py-[9px] px-[14px] min-w-[240px] max-[940px]:min-w-0 max-[600px]:flex-1 text-[#8e978f] text-sm shadow-[var(--shadow)] cursor-pointer transition-colors duration-200 hover:bg-[#F7F9F7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
      >
        <Search size={16} className="shrink-0" />
        <span className="block max-[940px]:hidden">Search recipes, foods…</span>
        <kbd className="ml-auto text-[10px] border border-[#1d2a2224] rounded-md py-[1px] px-[6px] block max-[940px]:hidden">
          ⌘K
        </kbd>
      </button>

      {/* search box */}
      <dialog
        ref={dialogRef}
        aria-label="Search"
        onClick={(e) => {
          if (e.target === e.currentTarget) closePalette();
        }}
        className="mx-auto mt-[12vh] mb-auto w-[min(600px,calc(100vw-32px))] overflow-hidden rounded-[22px] border border-[#1d2a2214] bg-white p-0 text-[#1D2A22] shadow-[0_30px_60px_-20px_rgba(29,42,34,0.4)] backdrop:bg-[#1d2a22]/35 backdrop:backdrop-blur-[3px]"
      >
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label="Search"
          aria-expanded="true"
          aria-controls="sp-list"
          aria-autocomplete="list"
          aria-activedescendant={results[active] ? `sp-opt-${active}` : undefined}
          autoComplete="off"
          spellCheck={false}
          placeholder="Search pages, recipes, groceries…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onInputKeyDown}
          className="w-full border-b border-[#1d2a2214] bg-transparent px-[20px] py-[18px] text-[15px] text-[#1D2A22] placeholder:text-[#8E978F] outline-none"
        />

        <ul
          id="sp-list"
          role="listbox"
          aria-label="Results"
          className="m-0 max-h-[min(420px,60dvh)] list-none overflow-y-auto p-[8px]"
        >
          {results.map((item, i) => (
            <Fragment key={item.id}>
              {(i === 0 || results[i - 1].group !== item.group) && (
                <li
                  role="presentation"
                  className="px-[12px] pt-[12px] pb-[6px] text-[10.5px] uppercase tracking-[.1em] text-[#8E978F]"
                >
                  {item.group}
                </li>
              )}
              <li
                id={`sp-opt-${i}`}
                role="option"
                aria-selected={i === active}
                onClick={() => go(item)}
                onMouseMove={() => i !== active && setActive(i)}
                className={`flex cursor-pointer items-center gap-[12px] rounded-[12px] px-[12px] py-[10px] text-[14px] transition-colors duration-100 ${
                  i === active ? "bg-[#E9F6EC] text-[#1D2A22]" : "text-[#1D2A22]"
                }`}
              >
                <item.Icon size={15} className="shrink-0 text-[#5B665F]" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.hint && (
                  <span className="shrink-0 text-[12px] text-[#8E978F] tabular-nums">
                    {item.hint}
                  </span>
                )}
              </li>
            </Fragment>
          ))}

          {results.length === 0 && (
            <li
              role="presentation"
              className="px-[12px] py-[28px] text-center text-[13.5px] text-[#8E978F]"
            >
              No results for &ldquo;{query.trim()}&rdquo;
            </li>
          )}
        </ul>

        <p className="m-0 border-t border-[#1d2a2214] px-[20px] py-[10px] text-[11.5px] text-[#8E978F]">
          ↑↓ to move · Enter to open · Esc to close
        </p>
        <p className="sr-only" role="status">
          {results.length} results
        </p>
      </dialog>
    </>
  );
}