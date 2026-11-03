"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Bricolage_Grotesque } from "next/font/google";
import { Plus, X } from "lucide-react";
import { AISLES, type AisleId } from "./groceryStore";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

type AddItemProps = {
  onAdd: (input: { name: string; qty: string; aisle: AisleId }) => void;
  onClose: () => void;
};

const inputClass =
  "w-full rounded-[14px] border border-[#1d2a2224] bg-white py-[11px] px-[14px] text-[14px] text-[#1D2A22] outline-none transition-colors duration-200 focus:border-[#4E9E5C]";

export default function AddItem({ onAdd, onClose }: AddItemProps) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [aisle, setAisle] = useState<AisleId>("vegetables");
  const [error, setError] = useState("");

  // Escape se band ho, aur box khula ho to peeche page scroll na ho
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Enter an item name.");
      return;
    }
    onAdd({ name: name.trim(), qty: qty.trim() || "1", aisle });
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-[#1d2a22]/[0.28] backdrop-blur-[4px] z-[90] grid place-items-center p-4 animate-[fade_250ms]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add an item"
        className="bg-white rounded-[26px] shadow-[var(--shadow-lg)] w-[min(440px,100%)] max-h-[86vh] overflow-auto p-6 max-sm:p-[18px] animate-[popin_350ms_var(--ease)]"
      >
        <div className="flex items-start gap-[12px] mb-[16px]">
          <div>
            <h3
              className={`${bricolage.className} text-[17px] font-semibold tracking-[-.02em] leading-[1.1] text-balance`}
            >
              Add an item
            </h3>
            <p className="text-[13.5px] text-[#8E978F] mt-[4px]">
              It's added to the aisle you pick.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close popup"
            className="ml-auto w-[34px] h-[34px] rounded-[50%] border border-[#1d2a2224] grid place-items-center bg-[#ffffff] flex-none transition-colors duration-200 hover:bg-[#f2f5f2] cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={submit} className="grid gap-[14px]">
          <label className="block">
            <span className="block text-[12.5px] text-[#5B665F] mb-[6px]">
              Item name
            </span>
            <input
              type="text"
              value={name}
              maxLength={40}
              autoFocus
              placeholder="e.g. Avocados"
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              className={inputClass}
            />
            {error && (
              <span className="block text-[12.5px] text-[#A4502B] mt-[6px]">
                {error}
              </span>
            )}
          </label>

          <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-[12px]">
            <label className="block">
              <span className="block text-[12.5px] text-[#5B665F] mb-[6px]">
                Quantity
              </span>
              <input
                type="text"
                value={qty}
                maxLength={24}
                placeholder="e.g. 2 kg, 6 pieces"
                onChange={(e) => setQty(e.target.value)}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="block text-[12.5px] text-[#5B665F] mb-[6px]">
                Aisle
              </span>
              <select
                value={aisle}
                onChange={(e) => setAisle(e.target.value as AisleId)}
                className={`${inputClass} appearance-none bg-[url('/dropdown.svg')] bg-no-repeat bg-[right_14px_center] pr-[36px] cursor-pointer`}
              >
                {AISLES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="mt-[4px] w-full inline-flex items-center justify-center gap-[8px] bg-[#2E6B3E] text-white rounded-full py-[13px] px-[22px] font-medium text-[15px] cursor-pointer shadow-[0_10px_26px_-12px_rgba(46,107,62,0.55)] transition-[transform,box-shadow,background] duration-300 ease-[var(--ease)] hover:-translate-y-[2px]"
          >
            <Plus size={16} />
            Add to list
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}