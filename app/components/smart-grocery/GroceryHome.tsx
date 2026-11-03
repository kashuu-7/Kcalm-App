import React from "react";
import GroceryLeft from "./GroceryLeft";
import GroceryRight from "./GroceryRight";

export default function GroceryHome() {
  return (
    <main>
      <div className="grid gap-[18px] animate-[viewin_.5s_var(--ease)]">
        <div className="items-start grid grid-cols-[minmax(0,1fr)_300px] max-[940px]:grid-cols-1 gap-[18px] ">
          <GroceryLeft />
          <GroceryRight />
        </div>
      </div>
    </main>
  );
}