"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { useHelp } from "./HelpContext";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const SHORTCUTS = [
  { keys: "⌘K / Ctrl K", text: "Search pages, recipes and groceries" },
  { keys: "Space", text: "Play or pause the recipe player" },
  { keys: "← →", text: "Previous / next cooking step" },
  { keys: "Esc", text: "Close any dialog" },
];

export default function HelpModal() {
  const { isOpen, closeHelp } = useHelp();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Context ki state ke hisab se dialog kholo / band karo
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (isOpen && !d.open) d.showModal();
    else if (!isOpen && d.open) d.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="helpTitle"
      onClose={closeHelp} // Esc dabane par bhi state sync rahe
      onClick={(e) => {
        // backdrop par click: target dialog khud hota hai
        if (e.target === e.currentTarget) closeHelp();
      }}
      className="m-auto w-[min(520px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] overflow-auto rounded-[24px] border border-[#1d2a2214] bg-white p-0 text-[#1D2A22] shadow-[0_30px_60px_-20px_rgba(29,42,34,0.4)] backdrop:bg-[#1d2a22]/35 backdrop:backdrop-blur-[3px]"
    >
      <div className="p-[22px]">
        {/* header */}
        <div className="mb-[14px] flex items-start justify-between gap-[12px]">
          <div>
            <h2
              id="helpTitle"
              className={`${bricolage.className} text-[20px] font-semibold leading-[1.1] tracking-[-.03em]`}
            >
              Help &amp; shortcuts
            </h2>
            <p className="mt-[4px] text-[13px] text-[#8E978F]">
              Quick ways to get around Kcalm.
            </p>
          </div>
          <button
            type="button"
            onClick={closeHelp}
            aria-label="Close"
            className="grid h-[32px] w-[32px] shrink-0 cursor-pointer place-items-center rounded-full border border-[#1d2a2224] transition-colors duration-200 hover:bg-[#F2F5F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
          >
            <X size={14} />
          </button>
        </div>

        {/* shortcuts */}
        <ul className="m-0 list-none p-0">
          {SHORTCUTS.map((s) => (
            <li
              key={s.keys}
              className="flex items-center justify-between gap-[16px] border-b border-[#1d2a2214] py-[14px] last:border-b-0"
            >
              <kbd className="rounded-[8px] bg-[#F2F5F2] px-[10px] py-[5px] font-mono text-[12px] text-[#1D2A22] whitespace-nowrap">
                {s.keys}
              </kbd>
              <span className="text-right text-[13px] text-[#5B665F]">
                {s.text}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-[8px] border-t border-[#1d2a2214] pt-[16px] text-[12px] text-[#8E978F]">
          Kcalm is not a medical device. For diagnosed conditions, talk to a
          registered dietitian.
        </p>
      </div>
    </dialog>
  );
}