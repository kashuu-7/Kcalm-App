"use client";

import { useRef, useState, useEffect } from "react";
import { userKey } from "../../lib/userStorage";
import {
  Activity,
  Check,
  Crown,
  Heart,
  Link as LinkIcon,
  List,
  X,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

/* ---------- data (baad mein apna data yahan se replace kar lena) ---------- */

type PlanId = "basic" | "premium";

const PLANS: {
  id: PlanId;
  name: string;
  price: string;
  tagline: string;
  blurb: string;
  features: string[];
}[] = [
  {
    id: "basic",
    name: "Basic",
    price: "$0",
    tagline: "Calories, macros and manual logging",
    blurb: "Track your calories and macros with simple manual logging.",
    features: ["Calorie & macro tracking", "Manual food logging"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$24.99",
    tagline: "Everything, plus micronutrients and insights",
    blurb:
      "Get the most out of Kcalm with personalized plans, guided recipes and insights.",
    features: [
      "Personalized meal plans",
      "Guided recipe player",
      "Smart grocery lists",
      "Advanced analytics",
    ],
  },
];

const DEVICES = [
  { id: "apple", name: "Apple Health", Icon: Heart },
  { id: "google", name: "Google Fit", Icon: Heart },
  { id: "fitbit", name: "Fitbit", Icon: Activity },
  { id: "mfp", name: "MyFitnessPal", Icon: List },
];

const INITIAL_CONNECTED: Record<string, boolean> = {
  apple: true,
  google: false,
  fitbit: false,
  mfp: true,
};

const PLAN_KEY = "kcalm-plan";

/* ---------- component ---------- */

export default function Plan() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [connected, setConnected] = useState(INITIAL_CONNECTED);
  const [planId, setPlanId] = useState<PlanId>("basic");

// Signup par chuna hua (ya pehle badla hua) plan
useEffect(() => {
  try {
    const saved = localStorage.getItem(userKey(PLAN_KEY))
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage mount ke baad padhte hain (hydration)
if (saved && PLANS.some((p) => p.id === saved)) setPlanId(saved as PlanId);
  } catch {
    /* ignore */
  }
}, []);

  const plan = PLANS.find((p) => p.id === planId)!;

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  const choosePlan = (id: PlanId) => {
  setPlanId(id);
  try {
    localStorage.setItem(userKey(PLAN_KEY), id);
  } catch {
    /* ignore */
  }
  closeModal();
};

  const toggleDevice = (id: string) =>
    setConnected((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="grid grid-cols-2 max-[900px]:grid-cols-1 gap-[18px]">
      {/* ---------- Article 1: membership plan ---------- */}
      <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
        <div className="flex items-center gap-[10px] mb-[16px]">
          <span className="text-[#E2B232]">
            <Crown size={18} />
          </span>
          <div>
            <small className="text-[#8E978F] ">Membership plan</small>
            <h3
              className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
            >
              {plan.name} plan
            </h3>
          </div>
          <div className="ml-auto flex items-center gap-[10px]">
            <span className="bg-[#E9F6EC] text-[#2E6B3E] inline-flex items-center gap-[6px] text-[12px] py-[4px] px-[10px] rounded-full whitespace-nowrap ">
              Active
            </span>
          </div>
        </div>

        <p className="text-[#8E978F] text-[13.5px]">{plan.blurb}</p>

        <ul className="grid gap-[8px] text-[13.5px] list-none my-[12px]">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-[9px]">
              <i className="w-[18px] h-[18px] rounded-full bg-[#4E9E5C] text-[#FFF] grid place-items-center ">
                <Check size={10} />
              </i>
              {f}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={openModal}
          className="py-[7px] px-[13px] text-[13px] bg-[#ffffff] border border-[#1d2a2224] inline-flex items-center justify-center gap-2 rounded-full font-medium cursor-pointer transition-[translate,box-shadow,background-color] duration-200 ease-out whitespace-nowrap hover:bg-[#F2F5F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
        >
          Manage plan
        </button>
      </article>

      {/* ---------- Article 2: connected devices ---------- */}
      <article
  id="connected-devices"
  tabIndex={-1}
  className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0 scroll-mt-[110px] outline-none transition-shadow duration-300"
>
        <div className="flex items-center gap-[10px] mb-[16px]">
          <span className="text-[#E2B232]">
            <LinkIcon size={18} />
          </span>
          <div>
            <h3
              className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
            >
              Data & connected devices
            </h3>
            <small className="text-[#8E978F] ">Sync activity for better insights </small>
          </div>
        </div>

        {DEVICES.map(({ id, name, Icon }) => {
          const on = connected[id];
          return (
            <div
              key={id}
              className="flex items-center gap-[12px] py-[12px] px-[4px] border-b border-[#1d2a2214] text-[14px] w-full text-left "
            >
              <span className="w-[34px] h-[34px] rounded-[11px] bg-[#F2F5F2] grid place-items-center ">
                <Icon size={15} />
              </span>
              {name}
              <span className="ml-auto flex items-center gap-[8px] text-[#8E978F] text-[12.5px] ">
                {on ? "Connected" : "Not connected"}
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-label={`${on ? "Disconnect" : "Connect"} ${name}`}
                  onClick={() => toggleDevice(id)}
                  className={`w-[40px] h-[24px] rounded-full relative transition-colors duration-250 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C] after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:w-[18px] after:h-[18px] after:rounded-full after:bg-white after:shadow-[0_1px_3px_rgba(0,0,0,0.2)] after:transition-transform after:duration-300 after:ease-[var(--ease)] ${
                    on ? "bg-[#4E9E5C] after:translate-x-[16px]" : "bg-[#1d2a2224]"
                  }`}
                />
              </span>
            </div>
          );
        })}
      </article>

      {/* ---------- Manage plan modal ---------- */}
      <dialog
        ref={dialogRef}
        aria-labelledby="planTitle"
        onClick={(e) => {
          // backdrop click: target dialog khud hota hai
          if (e.target === e.currentTarget) closeModal();
        }}
        className="m-auto w-[min(440px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] overflow-auto rounded-[24px] border border-[#1d2a2214] bg-white p-0 text-[#1D2A22] shadow-[0_30px_60px_-20px_rgba(29,42,34,0.4)] backdrop:bg-[#1d2a22]/35 backdrop:backdrop-blur-[3px]"
      >
        <div className="p-[22px]">
          <div className="flex items-start justify-between gap-[12px] mb-[16px]">
            <div>
              <h2
                id="planTitle"
                className={`${bricolage.className} text-[20px] font-semibold tracking-[-.03em] leading-[1.1]`}
              >
                Manage plan
              </h2>
              <p className="text-[#8E978F] text-[13px] mt-[4px]">
                Illustrative pricing while in beta.
              </p>
            </div>
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="w-[32px] h-[32px] shrink-0 rounded-full border border-[#1d2a2224] grid place-items-center cursor-pointer transition-colors duration-200 hover:bg-[#F2F5F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid gap-[10px]">
            {PLANS.map((p) => {
              const current = p.id === planId;
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-current={current}
                  onClick={() => choosePlan(p.id)}
                  className={`flex items-center justify-between gap-[16px] w-full text-left rounded-[16px] border p-[16px] cursor-pointer transition-[border-color,background-color] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C] ${
                    current
                      ? "border-[#4E9E5C] bg-[#F4FAF5]"
                      : "border-[#1d2a2224] bg-white hover:bg-[#F7FAF7]"
                  }`}
                >
                  <div className="min-w-0">
                    <div
                      className={`${bricolage.className} text-[15px] font-semibold tracking-[-.02em]`}
                    >
                      {p.name}
                    </div>
                    <div className="text-[#8E978F] text-[12.5px] mt-[2px]">
                      {p.tagline}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div
                      className={`${bricolage.className} text-[15px] font-semibold tabular-nums`}
                    >
                      {p.price}
                    </div>
                    <div className="text-[#8E978F] text-[12px]">/mo</div>
                    {current && (
                      <span className="mt-[4px] bg-[#E9F6EC] text-[#2E6B3E] inline-flex items-center text-[11px] py-[2px] px-[8px] rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </dialog>
    </div>
  );
}