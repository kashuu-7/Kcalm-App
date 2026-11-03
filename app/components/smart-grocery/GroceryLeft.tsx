"use client";

import React, { useEffect, useState } from "react";
import { ShoppingCart, Search, Calendar, X } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import {
  AISLES,
  ALL_GROUPS,
  type AisleId,
  useGrocery,
  toggleItem,
  setItemsChecked,
  startShopping,
  exitShopping,
  itemAbbr,
  fmtMoney,
} from "./groceryStore";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const TICK =
  "after:content-[''] after:w-[5px] after:h-[10px] after:border-solid after:border-white after:border-t-0 after:border-l-0 after:border-r-2 after:border-b-2 after:rotate-45 after:translate-x-[-1px] after:translate-y-[-1px] after:animate-[tick_.25s_var(--ease)]";

export default function GroceryLeft() {
  const { items, total, checked, percent, shopping, shoppingIds } =
    useGrocery();
  const [filter, setFilter] = useState<AisleId | "all">("all");
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  // Pehli baar bar 0 se apni value tak uthe
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const q = query.trim().toLowerCase();
  const shoppingSet = shoppingIds ? new Set(shoppingIds) : null;

  // Shopping mode mein sirf wahi items jo mode shuru hote waqt cart mein nahi the
  const groups = ALL_GROUPS.filter(
    (g) => filter === "all" || g.id === filter,
  )
    .map((group) => {
      const groupItems = items.filter(
        (i) => i.aisle === group.id && (!shoppingSet || shoppingSet.has(i.id)),
      );
      const shown = q
        ? groupItems.filter((i) => i.name.toLowerCase().includes(q))
        : groupItems;
      return { group, groupItems, shown };
    })
    .filter((g) => g.shown.length > 0);

  const leftToBuy = shoppingSet
    ? items.filter((i) => shoppingSet.has(i.id) && !i.checked).length
    : 0;

  const emptyText =
    shopping && shoppingIds && shoppingIds.length === 0
      ? "Everything is already in your cart. Nothing left to buy."
      : q
        ? `No items match "${query.trim()}".`
        : "No items to show here.";

  const tabs: { id: AisleId | "all"; label: string }[] = [
    { id: "all", label: "All" },
    ...AISLES.map((a) => ({ id: a.id, label: a.label })),
  ];

  return (
    <div className="grid gap-[18px] ">
      <article className="flex gap-[18px] items-center flex-wrap bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
        <span className="bg-[#E9F6EC] text-[#2E6B3E] w-[48px] h-[48px] rounded-[15px] grid place-items-center ">
          <ShoppingCart size={22} />
        </span>
        <div className="flex-1 min-w-[200px] ">
          <div className="flex justify-between ">
            <h3
              className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
            >
              This week's grocery list
            </h3>
            <b className="tabular-nums">{Math.round(percent)}%</b>
          </div>
          <p className="text-[13px] mt-[4px] mb-[10px] text-[#8E978F] ">
            {checked} of {total} items in your cart
          </p>
          <div className="h-[6px] bg-[#F2F5F2] rounded-[6px] overflow-hidden">
            <i
              className="block h-full rounded-[6px] bg-[#4E9E5C] transition-[width] duration-[1200ms] ease-[var(--ease)]"
              style={{ width: mounted ? `${percent}%` : "0%" }}
            ></i>
          </div>
        </div>
        <div className="bg-[#E9F6EC] rounded-[16px] py-[10px] px-[18px] text-center ">
          <b
            className={`${bricolage.className} text-[28px] text-[#2E6B3E] tabular-nums`}
          >
            {total}
          </b>
          <div className="text-[12px] text-[#5B665F] ">Total items</div>
        </div>
      </article>

      <div className="flex gap-[10px] flex-wrap items-center ">
        <div className="flex gap-[8px] flex-wrap ">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              aria-pressed={filter === t.id}
              className={`py-[7px] px-[14px] rounded-full border text-[13px] transition-all duration-200 cursor-pointer ${
                filter === t.id
                  ? "border-transparent bg-[#2E6B3E] text-white"
                  : "border-[#1d2a2224] bg-[#ffffff]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <label className=" cursor-text ml-auto max-sm:ml-0 max-sm:w-full min-w-[200px] flex items-center gap-[8px] bg-[#ffffff] border border-[#1d2a2214] rounded-[999px] py-[9px] px-[14px] text-[14px] text-[#8E978F] shadow-[var(--shadow)] transition-colors duration-200 ">
          <span className="sr-only">Search items</span>
          <Search size={15} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full outline-none text-[#1D2A22] "
          />
        </label>
      </div>

      <div className="grid grid-cols-3 max-[1050px]:grid-cols-2 max-[600px]:grid-cols-1 gap-[18px] ">
        {groups.map(({ group, groupItems, shown }) => {
          const allChecked = groupItems.every((i) => i.checked);
          const toBuy = groupItems.filter((i) => !i.checked).length;

          return (
            <article
              key={group.id}
              className=" bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[18px] shadow-[var(--shadow)] min-w-0"
            >
              <div className="flex items-center gap-[10px] ">
                <span
                  className={`${bricolage.className} w-[34px] h-[34px] flex-none rounded-[10px] grid place-items-center font-semibold text-[13px] text-[#1d2a22a6] `}
                  style={{ backgroundColor: group.color }}
                >
                  {group.letter}
                </span>
                <div>
                  <h3
                    className={`${bricolage.className} font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
                  >
                    {group.label}
                  </h3>
                  <small className="text-[#8E978F] ">
                    {shopping
                      ? `${toBuy} to buy`
                      : `${groupItems.length} ${groupItems.length === 1 ? "item" : "items"}`}
                  </small>
                </div>
                <div className="ml-auto flex gap-[8px] items-center ">
                  <button
                    type="button"
                    onClick={() =>
                      setItemsChecked(
                        groupItems.map((i) => i.id),
                        !allChecked,
                      )
                    }
                    className="text-[#2E6B3E] font-[500] text-[13.5px] inline-flex items-center gap-[4px] cursor-pointer hover:underline"
                  >
                    {allChecked ? "Uncheck all" : "Check all"}
                  </button>
                </div>
              </div>

              {shown.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-pressed={item.checked}
                  className="flex items-center gap-[11px] py-[9px] px-[6px] rounded-xl cursor-pointer transition-colors duration-200 w-full text-left hover:bg-[#F7F9F7]"
                >
                  <span
                    className={`${bricolage.className} w-[34px] h-[34px] rounded-[10px] grid place-items-center font-semibold text-[13px] text-[#1d2a22a6] flex-none`}
                    style={{ backgroundColor: group.color }}
                  >
                    {itemAbbr(item.name)}
                  </span>
                  <span
                    className={`text-[14px] font-[500] leading-[1.2] min-w-0 ${
                      item.checked ? "text-[#8E978F] line-through" : ""
                    }`}
                  >
                    {item.name}
                    <small className="text-[#8E978F] block text-[11.5px] font-[400] ">
                      {item.qty}
                      {item.price !== null && ` · ${fmtMoney(item.price)}`}
                    </small>
                  </span>
                  <span
                    className={`ml-auto w-[22px] h-[22px] rounded-[7px] border-[1.5px] border-[#1d2a2224] grid place-items-center flex-none transition-all duration-[250ms] ease-[var(--ease)] ${
                      item.checked ? `bg-[#4e9e5c] ${TICK}` : ""
                    }`}
                  ></span>
                </button>
              ))}
            </article>
          );
        })}

        {groups.length === 0 && (
          <div className="col-span-full bg-[#ffffff] border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] text-center text-[14px] text-[#8E978F]">
            {emptyText}
          </div>
        )}
      </div>

      <div className="flex items-center gap-[16px] rounded-[24px] py-[18px] px-[22px] bg-[linear-gradient(120deg,#e9f6ec,#f0edfd)] flex-wrap">
        <span className="text-[#2E6B3E] w-[44px] h-[44px] rounded-[14px] bg-[#fff] grid place-items-center ">
          <Calendar size={20} />
        </span>
        <div className="min-w-0">
          <h3
            className={`${bricolage.className} text-[16px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            {shopping ? "Shopping mode is on" : "Built from your meal plan"}
          </h3>
          <p className="text-[13.5px] text-[#5B665F] ">
            {!shopping
              ? "These ingredients come from this week's meals, with quantities merged across recipes."
              : leftToBuy === 0
                ? "Everything on your list is in the cart. You can exit shopping mode."
                : `Showing only items you still need to buy (${leftToBuy} left). Tick each one as it goes in your cart.`}
          </p>
        </div>
        <button
          type="button"
          onClick={shopping ? exitShopping : startShopping}
          className="ml-auto max-sm:ml-0 max-sm:w-full inline-flex items-center justify-center gap-2 rounded-full py-[11px] px-[20px] font-medium text-sm cursor-pointer transition-[transform,box-shadow,background] duration-[250ms] ease-[var(--ease)] whitespace-nowrap bg-[#2e6b3e] text-white shadow-[0_10px_24px_-12px_rgba(46,107,62,0.6)]"
        >
          {shopping ? <X size={15} /> : <ShoppingCart size={15} />}
          {shopping ? "Exit shopping mode" : "Start shopping"}
        </button>
      </div>
    </div>
  );
}