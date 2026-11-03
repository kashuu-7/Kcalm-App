"use client";

import { HelpCircle } from "lucide-react";
import { useHelp } from "./HelpContext";

export default function Help() {
  const { openHelp } = useHelp();

  return (
    <button
      type="button"
      onClick={openHelp}
      aria-haspopup="dialog"
      className="flex w-full items-center gap-[12px] rounded-[12px] px-[12px] py-[9px] text-left text-[14px] text-[#5B665F] cursor-pointer transition-colors duration-200 hover:bg-[#F5F7F5] hover:text-[#1D2A22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4E9E5C]"
    >
      <HelpCircle size={18} />
      Help
    </button>
  );
}