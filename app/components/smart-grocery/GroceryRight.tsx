"use client";

import React, { useEffect, useState } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ChevronRight,
  CreditCard,
  Plus,
  RefreshCcw,
  List,
  X,
} from "lucide-react";
import AddItem from "./AddItem";
import {
  AISLES,
  type AisleId,
  useGrocery,
  addItem,
  uncheckAll,
  resetList,
  buildListText,
  fmtMoney,
} from "./groceryStore";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

// Ring ki geometry (r = 68.5)
const RADIUS = 68.5;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // 430.4

const actionClass =
  "flex items-center gap-3 p-3 rounded-[14px] border border-[#1d2a2214] w-full text-left font-medium text-sm cursor-pointer transition-all duration-250 hover:bg-[#F2F5F2] hover:translate-x-[2px]";

export default function GroceryRight() {
  const { items, total, checked, remaining, totalCost, remainingCost } =
    useGrocery();
  const [mounted, setMounted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  // Pehli baar ring khali se apni value tak bhare
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Chhota message 2 second baad hat jaye
  useEffect(() => {
    if (!note) return;
    const t = setTimeout(() => setNote(null), 2200);
    return () => clearTimeout(t);
  }, [note]);

  const progress = total ? checked / total : 0;
  const dashOffset = mounted ? CIRCUMFERENCE * (1 - progress) : CIRCUMFERENCE;

  const handleAdd = (input: { name: string; qty: string; aisle: AisleId }) => {
    addItem(input);
    setAdding(false);
    const label = AISLES.find((a) => a.id === input.aisle)?.label;
    setNote(`${input.name} added to ${label}`);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildListText(items));
      setNote("List copied to clipboard");
    } catch {
      setNote("Couldn't copy the list");
    }
  };

  const handleRegenerate = () => {
    resetList();
    setNote("List restored to your meal plan");
  };

  const handleUncheck = () => {
    uncheckAll();
    setNote("All items unchecked");
  };

  return (
    <div className="grid gap-[18px] ">
      <article className=" bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
        <div className="flex items-center gap-[10px] mb-[16px]">
          <h3
            className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            Shopping progress
          </h3>
        </div>
        <div className="grid place-items-center gap-[12px] pb-[14px]">
          <div className="relative w-[150px] h-[150px] ">
            <svg
              className="w-[150px] h-[150px] rotate-[-90deg]"
              width="150"
              height="150"
              viewBox="0 0 150 150"
            >
              <circle
                cx="75"
                cy="75"
                r={RADIUS}
                fill="none"
                stroke="#E9F6EC"
                strokeWidth="13"
              />

              <circle
                cx="75"
                cy="75"
                r={RADIUS}
                fill="none"
                stroke="#4E9E5C"
                strokeWidth="13"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{
                  opacity: progress === 0 ? 0 : 1, // 0 par round cap ka dot na dikhe
                  transition:
                    "stroke-dashoffset 1000ms cubic-bezier(.2,.8,.2,1), opacity 300ms",
                }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center ">
              <div>
                <div
                  className={`${bricolage.className} text-[36px] tracking-[-.05em] tabular-nums `}
                >
                  {checked}
                </div>
                <small className="text-[#8E978F] ">of {total} items</small>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-[8px] text-[13.5px] ">
          <div className="flex justify-between">
            <span>Added to cart</span>
            <b className="tabular-nums">{checked}</b>
          </div>
          <div className="flex justify-between">
            <span>Remaining</span>
            <b className="tabular-nums">{remaining}</b>
          </div>
        </div>
      </article>

      <article className="bg-[linear-gradient(160deg,#e9f6ec,#fff)] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
        <span className="bg-[#4E9E5C] w-[40px] h-[40px] rounded-[12px] text-[#fff] grid place-items-center ">
          <CreditCard size={18} />
        </span>
        <p className="text-[13px] mt-[12px] text-[#8E978F] ">Estimated cost</p>
        <div
          className={`${bricolage.className} text-[36px] tracking-[-.04em] tabular-nums `}
        >
          {fmtMoney(totalCost)}
        </div>
        <p className="text-[12.5px] text-[#8E978F] ">
          {fmtMoney(remainingCost)} still to buy · based on average local
          prices
        </p>
      </article>

      <article className="bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
        <div className="flex items-center gap-[10px] mb-[16px]">
          <h3
            className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            Quick actions
          </h3>
        </div>
        <div className="grid gap-[8px] ">
          <button
            type="button"
            onClick={() => setAdding(true)}
            className={actionClass}
          >
            <span className="w-[34px] h-[34px] rounded-[11px] bg-[#e9f6ec] text-[#2e6b3e] grid place-items-center">
              <Plus size={16} />
            </span>
            Add item
            <span className="text-[#8e978f] ml-auto ">
              <ChevronRight size={15} />
            </span>
          </button>
          <button
            type="button"
            onClick={handleRegenerate}
            className={actionClass}
          >
            <span className="w-[34px] h-[34px] rounded-[11px] bg-[#F0EDFD] text-[#6457B0] grid place-items-center">
              <RefreshCcw size={16} />
            </span>
            Regenerate list
            <span className="text-[#8e978f] ml-auto ">
              <ChevronRight size={15} />
            </span>
          </button>
          <button type="button" onClick={handleCopy} className={actionClass}>
            <span className="w-[34px] h-[34px] rounded-[11px] bg-[#E7F3FC] text-[#2B6A93] grid place-items-center">
              <List size={16} />
            </span>
            Copy list as text
            <span className="text-[#8e978f] ml-auto ">
              <ChevronRight size={15} />
            </span>
          </button>
          <button type="button" onClick={handleUncheck} className={actionClass}>
            <span className="w-[34px] h-[34px] rounded-[11px] bg-[#FFEFE7] text-[#A4502B] grid place-items-center">
              <X size={16} />
            </span>
            Uncheck everything
            <span className="text-[#8e978f] ml-auto ">
              <ChevronRight size={15} />
            </span>
          </button>
        </div>
        {note && (
          <p
            role="status"
            className="text-[12.5px] text-[#2E6B3E] mt-[12px] animate-[fade_250ms]"
          >
            {note}
          </p>
        )}
      </article>

      {adding && <AddItem onAdd={handleAdd} onClose={() => setAdding(false)} />}
    </div>
  );
}