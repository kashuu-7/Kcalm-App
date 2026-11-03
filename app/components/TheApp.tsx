"use client";

import { useEffect, useState } from "react";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import { CalendarDays, ShoppingCart, BarChart3, Play } from "lucide-react";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const features = [
  {
    title: "Weekly meal planner",
    description:
      "Seven days of breakfasts, lunches, snacks and dinners, each one matched to your calorie and macro targets.",
    icon: CalendarDays,
    iconBg: "#E9F6EC",
    iconColor: "#2E6B3E",
  },
  {
    title: "Smart grocery list",
    description:
      "Your plan becomes a precise grocery list with quantities and recipes ready to shop.",
    icon: ShoppingCart,
    iconBg: "#FFF4D8",
    iconColor: "#A77B00",
  },
  {
    title: "Progress insights",
    description:
      "See your progress clearly with simple insights based on your meals and goals.",
    icon: BarChart3,
    iconBg: "#EEE9FF",
    iconColor: "#7561C9",
  },
  {
    title: "Animated recipes",
    description:
      "Follow easy animated recipes with built-in timers and step-by-step guidance.",
    icon: Play,
    iconBg: "#FFECE4",
    iconColor: "#D46E42",
  },
];

const days = [
  { day: "M", date: "21" },
  { day: "T", date: "22" },
  { day: "W", date: "23" },
  { day: "T", date: "24" },
  { day: "F", date: "25" },
  { day: "S", date: "26" },
  { day: "S", date: "27" },
];

export default function TheApp() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const [checkedItems, setCheckedItems] = useState({
    spinach: true,
    tomatoes: false,
    lemons: false,
    chickpeas: true,
    chicken: false,
    yogurt: false,
    oats: false,
    oliveOil: false,
  });

  const toggleItem = (item: keyof typeof checkedItems) => {
    setCheckedItems((current) => ({
      ...current,
      [item]: !current[item],
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((current) => (current + 1) % features.length);
    }, 6000);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <section id="the-app" className="pt-0 py-[clamp(72px,10vw,128px)]">
      <div className="flex flex-wrap items-end justify-between gap-6 max-sm:gap-4 mb-[clamp(36px,5vw,56px)] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-[160ms]">
        <div>
          <span className="block mb-[14px] text-[12px] tracking-[.08em] uppercase text-[#8E978F]">
            Inside The app
          </span>
          <h2
            className={`${bricolage.className} text-[clamp(34px,5vw,60px)] font-semibold tracking-[-0.035em] leading-[1.02] m-0 text-balance`}
          >
            Everything for eating well,
            <span className={`${serif.className} tracking-[-.01em] `}>
              in one place.
            </span>
          </h2>
        </div>
        <p className="text-[#5B665F] text-[clamp(16px,1.4vw,18px)] max-w-[620px]">
          Plan the week, shop in one trip, cook with guidance and watch your
          progress add up.
        </p>
      </div>
      <div className="grid grid-cols-2 max-[940px]:grid-cols-1 gap-[clamp(24px,5vw,72px)] items-center">
        <div className="grid gap-[10px]">
          {features.map((feature, index) => {
            const isActive = activeIndex === index;
            const Icon = feature.icon;

            return (
              <button
                key={feature.title}
                onClick={() => setActiveIndex(index)}
                className={`box-border cursor-pointer grid grid-cols-[48px_1fr] max-sm:grid-cols-[40px_1fr] gap-[16px] max-sm:gap-[12px] items-start py-[18px] px-[20px] max-sm:py-[14px] max-sm:px-[14px] rounded-[20px] relative overflow-hidden transition-[background,border-color,box-shadow] duration-[350ms] hover:bg-[#FAFBFA] ${
  isActive
    ? "bg-[#ffffff] border border-[#1d2a2214] shadow-[0_1px_2px_rgba(29,42,34,0.04),0_18px_40px_-22px_rgba(29,42,34,0.16)]"
    : "bg-transparent border border-transparent"
}`}
              >
                <span
                  className="w-[48px] h-[48px] max-sm:w-[40px] max-sm:h-[40px] rounded-[15px] max-sm:rounded-[12px] grid place-items-center"
                  style={{
                    backgroundColor: feature.iconBg,
                    color: feature.iconColor,
                  }}
                >
                  <Icon className="w-[22px] h-[22px]" />
                </span>

                <div className="text-start">
                  <h3
                    className={`${bricolage.className} text-[22px] max-sm:text-[19px] font-semibold tracking-[-.02em] leading-[1.02] m-0 text-balance`}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className={`text-[#5B665F] text-[14.5px] max-sm:text-[14px] mt-[4px] overflow-hidden transition-[max-height,opacity] duration-[450ms] ${
  isActive
    ? "max-h-[100px] max-sm:max-h-[150px] opacity-100"
    : "max-h-0 opacity-0"
}`}
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Active progress line */}
                {isActive && (
                  <span
                    key={activeIndex}
                    className="absolute bottom-0 left-0 h-[2px] bg-[#5FAE6E] animate-[tabProgress_6s_linear_forwards]"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="relative h-[600px] max-[940px]:w-full max-[940px]:max-w-[520px] max-[940px]:mx-auto grid place-items-center transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)] delay-0">
          <div className="inset-y-[4%] inset-x-0 absolute bg-[radial-gradient(circle,#F0EDFD,transparent_65%)] rounded-full animate-[breathe_6s_ease-in-out_infinite]"></div>
          <div className="relative left-auto top-auto m-0 animate-none w-[270px] h-[560px] rounded-[44px] bg-white p-[10px] shadow-[0_40px_70px_-30px_rgba(29,42,34,0.25),0_0_0_1px_rgba(29,42,34,0.08)] [transform-style:preserve-3d] transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)]">
            <div className="h-full rounded-[35px] bg-[#F8FAF9] overflow-hidden py-[18px] px-[16px] flex flex-col gap-[12px] text-[#1D2A22]">
              <div className="w-[90px] h-[24px] rounded-[20px] bg-[#EEF1EE] mt-[-8px] mx-auto mb-[2px]"></div>
              <div className="relative flex-1 min-h-0 ">
                {/* 1 mobile */}
                <div
                  className={`absolute inset-0 flex flex-col gap-[10px]
                          transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)]
                          ${
                            activeIndex === 0
                              ? "opacity-100 [transform:none] pointer-events-auto"
                              : "opacity-0 translate-x-[24px] scale-[0.98] pointer-events-none"
                          }`}
                >
                  <div className="flex items-center justify-between">
                    <h4
                      className={`${bricolage.className} text-[18px] tracking-[-0.03em] font-semibold`}
                    >
                      This week
                    </h4>
                    <span className="text-[9px] tracking-[.08em] uppercase text-[#8E978F]">
                      Sep 21 – 27
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((item, index) => {
                      const isActive = activeDay === index;

                      return (
                        <span
                          key={index}
                          onClick={() => setActiveDay(index)}
                          className={`text-center py-[7px] rounded-[12px] text-[10px] cursor-pointer transition-colors duration-300 ${
                            isActive
                              ? "bg-[#2E6B3E] text-[color-mix(in_srgb,#FFFFFF_75%,transparent)]"
                              : "bg-[#FFFFFF] text-[#8E978F]"
                          }`}
                        >
                          {item.day}

                          <b
                            className={`${bricolage.className} block text-[13px] ${
                              isActive ? "text-[#FFFFFF]" : "text-[#1D2A22]"
                            }`}
                          >
                            {item.date}
                          </b>
                        </span>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-[10px] bg-[#FFFFFF] rounded-[14px] py-[9px] px-[10px] text-[12px] leading-[1.3]">
                    <span className=" w-[32px] h-[32px] rounded-[10px] flex-none bg-[#FFF3CF] "></span>
                    <div>
                      Overnight oats & berries
                      <small className="text-[#8E978F] block text-[10px] ">
                        Breakfast
                      </small>
                    </div>
                    <span className="ml-auto text-[10px] text-[#5B665F] whitespace-nowrap">
                      340 kcal
                    </span>
                  </div>
                  <div className="flex items-center gap-[10px] bg-[#FFFFFF] rounded-[14px] py-[9px] px-[10px] text-[12px] leading-[1.3]">
                    <span className=" w-[32px] h-[32px] rounded-[10px] flex-none bg-[#E9F6EC] "></span>
                    <div>
                      Lemon chickpea salad
                      <small className="text-[#8E978F] block text-[10px] ">
                        Lunch
                      </small>
                    </div>
                    <span className="ml-auto text-[10px] text-[#5B665F] whitespace-nowrap">
                      480 kcal
                    </span>
                  </div>
                  <div className="flex items-center gap-[10px] bg-[#FFFFFF] rounded-[14px] py-[9px] px-[10px] text-[12px] leading-[1.3]">
                    <span className=" w-[32px] h-[32px] rounded-[10px] flex-none bg-[#FCE4EA] "></span>
                    <div>
                      Apple & peanut butter
                      <small className="text-[#8E978F] block text-[10px] ">
                        Snack
                      </small>
                    </div>
                    <span className="ml-auto text-[10px] text-[#5B665F] whitespace-nowrap">
                      210 kcal
                    </span>
                  </div>
                  <div className="flex items-center gap-[10px] bg-[#FFFFFF] rounded-[14px] py-[9px] px-[10px] text-[12px] leading-[1.3]">
                    <span className=" w-[32px] h-[32px] rounded-[10px] flex-none bg-[#E7F3FC] "></span>
                    <div>
                      Chicken karahi, light
                      <small className="text-[#8E978F] block text-[10px] ">
                        Dinner
                      </small>
                    </div>
                    <span className="ml-auto text-[10px] text-[#5B665F] whitespace-nowrap">
                      620 kcal
                    </span>
                  </div>
                  <div className="mt-auto bg-[#E9F6EC] rounded-[14px] py-[10px] px-[12px] text-[11px] text-[#2E6B3E]">
                    Day total{" "}
                    <b className={`${bricolage.className} text-[16px]`}>
                      1,650{" "}
                    </b>
                    / 1,850 kcal · room for a treat
                  </div>
                </div>
                {/* 2 mobile */}
                <div
                  className={`absolute inset-0 flex flex-col gap-[10px]
                          transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)]
                          ${
                            activeIndex === 1
                              ? "opacity-100 [transform:none] pointer-events-auto"
                              : "opacity-0 translate-x-[24px] scale-[0.98] pointer-events-none"
                          }`}
                >
                  <div className="flex items-center justify-between">
                    <h4
                      className={`${bricolage.className} text-[18px] tracking-[-0.03em] font-semibold`}
                    >
                      Grocery list
                    </h4>
                    <span className="text-[9px] tracking-[.08em] uppercase text-[#8E978F]">
                      2 / 8
                    </span>
                  </div>
                  <div className="text-[9.5px] tracking-[.1em] uppercase text-[#8E978F] mt-[4px]">
                    Produce
                  </div>
                  <div
                    onClick={() => toggleItem("spinach")}
                    className={`flex items-center gap-[10px] bg-[#FFFFFF] rounded-[12px] py-[8px] px-[10px] text-[12px] cursor-pointer transition-opacity duration-300 ${
                      checkedItems.spinach ? "opacity-[.5]" : "opacity-100"
                    }`}
                  >
                    <span
                      className={`w-[18px] h-[18px] rounded-[6px] border-[1.5px] grid place-items-center flex-none transition-all duration-300 relative ${
                        checkedItems.spinach
                          ? "bg-[#5FAE6E] border-[#1d2a2224]"
                          : "bg-transparent border-[#1d2a2240]"
                      }`}
                    >
                      {checkedItems.spinach && (
                        <span className="w-[5px] h-[9px] border-r-[2px] border-b-[2px] border-white rotate-45 translate-[-1px_-1px]" />
                      )}
                    </span>

                    <span
                      className={checkedItems.spinach ? "line-through" : ""}
                    >
                      Spinach
                    </span>

                    <span className="ml-auto text-[10px] text-[#8E978F]">
                      200 g
                    </span>
                  </div>
                  <div
                    onClick={() => toggleItem("tomatoes")}
                    className={`flex items-center gap-[10px] bg-[#FFFFFF] rounded-[12px] py-[8px] px-[10px] text-[12px] cursor-pointer transition-opacity duration-300 ${
                      checkedItems.tomatoes ? "opacity-[.5]" : "opacity-100"
                    }`}
                  >
                    <span
                      className={`w-[18px] h-[18px] rounded-[6px] border-[1.5px] grid place-items-center flex-none transition-all duration-300 ${
                        checkedItems.tomatoes
                          ? "bg-[#5FAE6E] border-[#1d2a2224]"
                          : "bg-transparent border-[#1d2a2240]"
                      }`}
                    >
                      {checkedItems.tomatoes && (
                        <span className="w-[5px] h-[9px] border-r-[2px] border-b-[2px] border-white rotate-45 translate-[-1px_-1px]" />
                      )}
                    </span>

                    <span
                      className={checkedItems.tomatoes ? "line-through" : ""}
                    >
                      Tomatoes
                    </span>

                    <span className="ml-auto text-[10px] text-[#8E978F]">
                      4
                    </span>
                  </div>
                  <div
                    onClick={() => toggleItem("lemons")}
                    className={`flex items-center gap-[10px] bg-[#FFFFFF] rounded-[12px] py-[8px] px-[10px] text-[12px] cursor-pointer transition-opacity duration-300 ${
                      checkedItems.lemons ? "opacity-[.5]" : "opacity-100"
                    }`}
                  >
                    <span
                      className={`w-[18px] h-[18px] rounded-[6px] border-[1.5px] grid place-items-center flex-none transition-all duration-300 ${
                        checkedItems.lemons
                          ? "bg-[#5FAE6E] border-[#1d2a2224]"
                          : "bg-transparent border-[#1d2a2240]"
                      }`}
                    >
                      {checkedItems.lemons && (
                        <span className="w-[5px] h-[9px] border-r-[2px] border-b-[2px] border-white rotate-45 translate-[-1px_-1px]" />
                      )}
                    </span>

                    <span className={checkedItems.lemons ? "line-through" : ""}>
                      Lemons
                    </span>

                    <span className="ml-auto text-[10px] text-[#8E978F]">
                      3
                    </span>
                  </div>
                  <div className="text-[9.5px] tracking-[.1em] uppercase text-[#8E978F] mt-[4px]">
                    Protein & Dairy
                  </div>
                  <div
                    onClick={() => toggleItem("chickpeas")}
                    className={`flex items-center gap-[10px] bg-[#FFFFFF] rounded-[12px] py-[8px] px-[10px] text-[12px] cursor-pointer transition-opacity duration-300 ${
                      checkedItems.chickpeas ? "opacity-[.5]" : "opacity-100"
                    }`}
                  >
                    <span
                      className={`w-[18px] h-[18px] rounded-[6px] border-[1.5px] grid place-items-center flex-none transition-all duration-300 ${
                        checkedItems.chickpeas
                          ? "bg-[#5FAE6E] border-[#1d2a2224]"
                          : "bg-transparent border-[#1d2a2240]"
                      }`}
                    >
                      {checkedItems.chickpeas && (
                        <span className="w-[5px] h-[9px] border-r-[2px] border-b-[2px] border-white rotate-45 translate-[-1px_-1px]" />
                      )}
                    </span>

                    <span
                      className={checkedItems.chickpeas ? "line-through" : ""}
                    >
                      Chickpeas
                    </span>

                    <span className="ml-auto text-[10px] text-[#8E978F]">
                      2 cans
                    </span>
                  </div>
                  <div
                    onClick={() => toggleItem("chicken")}
                    className={`flex items-center gap-[10px] bg-[#FFFFFF] rounded-[12px] py-[8px] px-[10px] text-[12px] cursor-pointer transition-opacity duration-300 ${
                      checkedItems.chicken ? "opacity-[.5]" : "opacity-100"
                    }`}
                  >
                    <span
                      className={`w-[18px] h-[18px] rounded-[6px] border-[1.5px] grid place-items-center flex-none transition-all duration-300 ${
                        checkedItems.chicken
                          ? "bg-[#5FAE6E] border-[#1d2a2224]"
                          : "bg-transparent border-[#1d2a2240]"
                      }`}
                    >
                      {checkedItems.chicken && (
                        <span className="w-[5px] h-[9px] border-r-[2px] border-b-[2px] border-white rotate-45 translate-[-1px_-1px]" />
                      )}
                    </span>

                    <span
                      className={checkedItems.chicken ? "line-through" : ""}
                    >
                      Chicken breast
                    </span>

                    <span className="ml-auto text-[10px] text-[#8E978F]">
                      600g
                    </span>
                  </div>
                  <div
                    onClick={() => toggleItem("yogurt")}
                    className={`flex items-center gap-[10px] bg-[#FFFFFF] rounded-[12px] py-[8px] px-[10px] text-[12px] cursor-pointer transition-opacity duration-300 ${
                      checkedItems.yogurt ? "opacity-[.5]" : "opacity-100"
                    }`}
                  >
                    <span
                      className={`w-[18px] h-[18px] rounded-[6px] border-[1.5px] grid place-items-center flex-none transition-all duration-300 ${
                        checkedItems.yogurt
                          ? "bg-[#5FAE6E] border-[#1d2a2224]"
                          : "bg-transparent border-[#1d2a2240]"
                      }`}
                    >
                      {checkedItems.yogurt && (
                        <span className="w-[5px] h-[9px] border-r-[2px] border-b-[2px] border-white rotate-45 translate-[-1px_-1px]" />
                      )}
                    </span>

                    <span className={checkedItems.yogurt ? "line-through" : ""}>
                      Greek yogurt
                    </span>

                    <span className="ml-auto text-[10px] text-[#8E978F]">
                      500 g
                    </span>
                  </div>
                  <div className="text-[9.5px] tracking-[.1em] uppercase text-[#8E978F] mt-[4px]">
                    Pantry
                  </div>
                  <div
                    onClick={() => toggleItem("oats")}
                    className={`flex items-center gap-[10px] bg-[#FFFFFF] rounded-[12px] py-[8px] px-[10px] text-[12px] cursor-pointer transition-opacity duration-300 ${
                      checkedItems.oats ? "opacity-[.5]" : "opacity-100"
                    }`}
                  >
                    <span
                      className={`w-[18px] h-[18px] rounded-[6px] border-[1.5px] grid place-items-center flex-none transition-all duration-300 ${
                        checkedItems.oats
                          ? "bg-[#5FAE6E] border-[#1d2a2224]"
                          : "bg-transparent border-[#1d2a2240]"
                      }`}
                    >
                      {checkedItems.oats && (
                        <span className="w-[5px] h-[9px] border-r-[2px] border-b-[2px] border-white rotate-45 translate-[-1px_-1px]" />
                      )}
                    </span>

                    <span className={checkedItems.oats ? "line-through" : ""}>
                      Rolled oats
                    </span>

                    <span className="ml-auto text-[10px] text-[#8E978F]">
                      300 g
                    </span>
                  </div>
                  <div
                    onClick={() => toggleItem("oliveOil")}
                    className={`flex items-center gap-[10px] bg-[#FFFFFF] rounded-[12px] py-[8px] px-[10px] text-[12px] cursor-pointer transition-opacity duration-300 ${
                      checkedItems.oliveOil ? "opacity-[.5]" : "opacity-100"
                    }`}
                  >
                    <span
                      className={`w-[18px] h-[18px] rounded-[6px] border-[1.5px] grid place-items-center flex-none transition-all duration-300 ${
                        checkedItems.oliveOil
                          ? "bg-[#5FAE6E] border-[#1d2a2224]"
                          : "bg-transparent border-[#1d2a2240]"
                      }`}
                    >
                      {checkedItems.oliveOil && (
                        <span className="w-[5px] h-[9px] border-r-[2px] border-b-[2px] border-white rotate-45 translate-[-1px_-1px]" />
                      )}
                    </span>

                    <span
                      className={checkedItems.oliveOil ? "line-through" : ""}
                    >
                      Olive oil
                    </span>

                    <span className="ml-auto text-[10px] text-[#8E978F]">
                      250 ml
                    </span>
                  </div>
                </div>
                {/* 3 mobile */}
                <div
                  className={`absolute inset-0 flex flex-col gap-[10px]
                          transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)]
                          ${
                            activeIndex === 2
                              ? "opacity-100 [transform:none] pointer-events-auto"
                              : "opacity-0 translate-x-[24px] scale-[0.98] pointer-events-none"
                          }`}
                >
                  <div className="flex items-center justify-between">
                    <h4
                      className={`${bricolage.className} text-[18px] tracking-[-0.03em] font-semibold`}
                    >
                      Progress
                    </h4>
                    <span className="text-[9px] tracking-[.08em] uppercase text-[#8E978F]">
                      Last 7 days
                    </span>
                  </div>
                  <div className="bg-[#ffffff] rounded-[14px] p-[12px] ">
                    <span className="text-[12px] tracking-[.08em] uppercase text-[#8E978F]"></span>
                    <div className="flex items-end gap-[7px] h-[110px] mt-[10px] relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[72%] after:border-t after:border-dashed after:border-[#F4A07E]">
                      <div className="flex-1 rounded-[6px_6px_3px_3px] bg-[#E9F6EC] h-[64%] transition-[height] duration-1000 ease-[cubic-bezier(.2,.8,.2,1)]"></div>
                      <div className="flex-1 rounded-[6px_6px_3px_3px] bg-[#E9F6EC] h-[70%] transition-[height] duration-1000 ease-[cubic-bezier(.2,.8,.2,1)]"></div>
                      <div className="flex-1 rounded-[6px_6px_3px_3px] bg-[#E9F6EC] h-[58%] transition-[height] duration-1000 ease-[cubic-bezier(.2,.8,.2,1)]"></div>
                      <div className="flex-1 rounded-[6px_6px_3px_3px] bg-[#E9F6EC] h-[75%] transition-[height] duration-1000 ease-[cubic-bezier(.2,.8,.2,1)]"></div>
                      <div className="flex-1 rounded-[6px_6px_3px_3px] bg-[#E9F6EC] h-[68%] transition-[height] duration-1000 ease-[cubic-bezier(.2,.8,.2,1)]"></div>
                      <div className="flex-1 rounded-[6px_6px_3px_3px] bg-[#E9F6EC] h-[80%] transition-[height] duration-1000 ease-[cubic-bezier(.2,.8,.2,1)]"></div>
                      <div className="flex-1 rounded-[6px_6px_3px_3px] bg-[#5FAE6E] h-[66%] transition-[height] duration-1000 ease-[cubic-bezier(.2,.8,.2,1)]"></div>
                    </div>
                    <div className="flex gap-[7px] mt-[6px]">
                      <span className="flex-1 text-center text-[9px] text-[#8E978F]">
                        T
                      </span>
                      <span className="flex-1 text-center text-[9px] text-[#8E978F]">
                        F
                      </span>
                      <span className="flex-1 text-center text-[9px] text-[#8E978F]">
                        S
                      </span>
                      <span className="flex-1 text-center text-[9px] text-[#8E978F]">
                        S
                      </span>
                      <span className="flex-1 text-center text-[9px] text-[#8E978F]">
                        M
                      </span>
                      <span className="flex-1 text-center text-[9px] text-[#8E978F]">
                        T
                      </span>
                      <span className="flex-1 text-center text-[9px] text-[#8E978F]">
                        W
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-[8px]">
                    <div className="bg-[#ffffff] rounded-[14px] py-[10px] px-[12px] text-[10px] text-[#8E978F]">
                      Weight
                      <b
                        className={`${bricolage.className} block text-[20px] text-[#1D2A22] tracking-[-.03em] `}
                      >
                        72 kg
                      </b>
                      −4 kg this month
                    </div>
                    <div className="bg-[#ffffff] rounded-[14px] py-[10px] px-[12px] text-[10px] text-[#8E978F]">
                      Streak
                      <b
                        className={`${bricolage.className} block text-[20px] text-[#1D2A22] tracking-[-.03em] `}
                      >
                        12 days
                      </b>
                      on plan
                    </div>
                    <div className="bg-[#ffffff] rounded-[14px] py-[10px] px-[12px] text-[10px] text-[#8E978F]">
                      Avg protien
                      <b
                        className={`${bricolage.className} block text-[20px] text-[#1D2A22] tracking-[-.03em] `}
                      >
                        118 g
                      </b>
                      goal 125 g
                    </div>
                    <div className="bg-[#ffffff] rounded-[14px] py-[10px] px-[12px] text-[10px] text-[#8E978F]">
                      Water
                      <b
                        className={`${bricolage.className} block text-[20px] text-[#1D2A22] tracking-[-.03em] `}
                      >
                        2.1 L
                      </b>
                      per day
                    </div>
                  </div>
                </div>
                {/* 4 mobile */}
                <div
                  className={`absolute inset-0 flex flex-col gap-[10px]
                          transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)]
                          ${
                            activeIndex === 3
                              ? "opacity-100 [transform:none] pointer-events-auto"
                              : "opacity-0 translate-x-[24px] scale-[0.98] pointer-events-none"
                          }`}
                >
                  <div className="flex items-center justify-between">
                    <h4
                      className={`${bricolage.className} text-[18px] tracking-[-0.03em] font-semibold`}
                    >
                      Cook along
                    </h4>
                    <span className="text-[9px] tracking-[.08em] uppercase text-[#8E978F]">
                      sep 2 of 4
                    </span>
                  </div>
                  <div
                    className="h-[120px] rounded-[16px] relative"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 40%, #FFD9C4 0 18%, transparent 19%), radial-gradient(circle at 62% 55%, #CDEBC9 0 22%, transparent 23%), radial-gradient(circle at 45% 70%, #FFF0B8 0 12%, transparent 13%), radial-gradient(circle at 50% 50%, #FFFFFF 0 42%, #F1EDE6 43% 46%, transparent 47%), #E7F3FC",
                    }}
                  >
                    <span className="absolute right-[10px] bottom-[10px] w-[36px] h-[36px] rounded-full bg-[#2E6B3E] text-[#ffffff] grid place-items-center text-[12px]">
                      <Play className="w-[12px] h-[12px] text-[#ffffff] fill-[#ffffff] " />
                    </span>
                  </div>
                  <div
                    className={`${bricolage.className} text-[17px]  tracking-[-.02em] leading-[1.25] `}
                  >
                    Dice cucumber, tomato and red onion into small cubes.
                  </div>
                  <div className="flex items-center gap-[12px] bg-[#ffffff] rounded-[14px] py-[10px] px-[12px] text-[12px]">
                    <svg
                      viewBox="0 0 44 44"
                      className="w-[44px] h-[44px] rotate-[-90deg] flex-none"
                    >
                      <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        strokeWidth="5"
                        stroke="#1d2a2214"
                      />

                      <circle
                        cx="22"
                        strokeWidth="5"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="#F4A07E"
                        strokeLinecap="round"
                        strokeDasharray="113"
                        className="animate-[tick_20s_linear_infinite]"
                      />
                    </svg>
                    <div>
                      <b className="font-[500]">01:30</b>
                      <small className="text-[#8E978F] block text-[10px]">
                        Timer running · voice on
                      </small>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-[6px]">
                    <span className="text-[10px] py-[4px] px-[8px] rounded-[999px] bg-[#ffffff] text-[#5B665F]">
                      Chickpeas
                    </span>
                    <span className="text-[10px] py-[4px] px-[8px] rounded-[999px] bg-[#ffffff] text-[#5B665F]">
                      Cucumber
                    </span>
                    <span className="text-[10px] py-[4px] px-[8px] rounded-[999px] bg-[#ffffff] text-[#5B665F]">
                      Tomato  
                    </span>
                    <span className="text-[10px] py-[4px] px-[8px] rounded-[999px] bg-[#ffffff] text-[#5B665F]">
                      Red onion
                    </span>
                    <span className="text-[10px] py-[4px] px-[8px] rounded-[999px] bg-[#ffffff] text-[#5B665F]">
                      Feta
                    </span>
                    <span className="text-[10px] py-[4px] px-[8px] rounded-[999px] bg-[#ffffff] text-[#5B665F]">
                      Lemon
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
