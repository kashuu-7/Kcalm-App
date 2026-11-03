import React from "react";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const meals = [
  { name: "Oat & berry bowl", info: "312 kcal" },
  { name: "Miso salmon", info: "34g protein" },
  { name: "Lentil dal", info: "11g Fiber" },
  { name: "Halloumi wrap", info: "22g fat" },
  { name: "Chia pudding", info: "6g sugar" },
  { name: "Chicken karahi", info: "41g protein" },
  { name: "Roasted veg tray", info: "290 kcal" },

  // second set
  { name: "Oat & berry bowl", info: "312 kcal" },
  { name: "Miso salmon", info: "34g protein" },
  { name: "Lentil dal", info: "31g Fiber" },
  { name: "Halloumi wrap", info: "31g fat" },
  { name: "Chia pudding", info: "6g sugar" },
  { name: "Chicken karahi", info: "41g protein" },
  { name: "Roasted veg tray", info: "290 kcal" },
];

export default function Ticker() {
  return (
    <div className="border-y border-[#1d2a2214] overflow-hidden py-[18px] max-sm:py-[14px] [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)] max-sm:[mask-image:linear-gradient(90deg,transparent,#000_5%,#000_95%,transparent)]">
      <div className="flex gap-[44px] max-sm:gap-[24px] w-max animate-[marquee_38s_linear_infinite]">
        {meals.map((meal, index) => (
          <span
            key={index}
            className={`${bricolage.className} text-[clamp(20px,2.4vw,28px)] max-sm:text-[18px] tracking-[-0.03em] text-[#5B665F] flex items-center gap-[44px] max-sm:gap-[24px] whitespace-nowrap after:content-[''] after:w-[8px] after:h-[8px] max-sm:after:w-[6px] max-sm:after:h-[6px] after:rounded-full after:bg-[#F4A07E]`}
          >
            {meal.name}

            <em className="not-italic text-[13px] text-[#5FAE6E] tracking-normal ml-[10px]">
              {meal.info}
            </em>
          </span>
        ))}
      </div>
    </div>
  );
}