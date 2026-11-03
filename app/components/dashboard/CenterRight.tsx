"use client";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { useMeals } from "./MealsContext"; // BADLA HUA
import { useTargets } from "../profile/useTargets"; // BADLA HUA
import { fetchMonthIntake } from "../../lib/api/intake";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export type IntakeDay = { day: number; kcal: number; today?: boolean };

type CenterRightProps = {
  target?: number;
};

// Colors (yahan se badal sakte ho)
const SOFT = "#CDE8D1"; // within target
const OVER = "#F4C3AA"; // over target by 5%+
const TODAY = "#5FAE6E"; // today
const GRID = "#1d2a2214";
const AXIS_TEXT = "#8E978F";
const TARGET_LINE = "#F4A07E";
const TARGET_TEXT = "#B8633A";
const INK = "#1D2A22";

// Hover effect
const DIM_OPACITY = 0.5; // baaki bars kitni halki hon (0 se 1)
const DIM_STAGGER_MS = 20; // har agli bar kitni der baad halki ho (kam = tez)
const DIM_DURATION_MS = 250; // ek bar ke halka hone ka time

// SVG ki geometry (original se)
const W = 560;
const H = 230;
const LEFT = 36;
const RIGHT = 552;
const BASE = 206;
const TOP = 34.571428571428605;

// Kitne mahine dropdown mein dikhane hain (current + pichle)
const MONTHS_BACK = 3;

// Mahine ke shuru mein bars bahut moti na hon, is liye kam se kam itni bars
// ki jagah bantti hai. Bilkul poori width chahiye to 1 kar do.
const MIN_SLOTS = 7;

/* ---------- MOCK DATA (baad mein API se replace karna) ---------- */
// history = backend se roz ka khaya hua kcal (din ke number se).
// Aaj ka din live meals se aata hai, taaki tick karte hi bar badhe.
function buildMonthData(
  year: number,
  month: number,
  now: Date,
  todayKcal: number,
  history: Record<number, number>,
): IntakeDay[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const isCurrent = now.getFullYear() === year && now.getMonth() === month;
  const lastDay = isCurrent ? now.getDate() : daysInMonth;

  const out: IntakeDay[] = [];
  for (let d = 1; d <= lastDay; d++) {
    if (isCurrent && d === now.getDate()) {
      out.push({ day: d, kcal: todayKcal, today: true });
    } else {
      out.push({ day: d, kcal: history[d] ?? 0 });
    }
  }
  return out;
}

// BADLA HUA: number ko smoothly purani value se nayi value tak le jata hai
// (taaki tick karne par bar achanak nahi, dheere se badhe)
function useAnimatedNumber(target: number, duration = 600) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const from = fromRef.current;

    if (reduce || from === target) {
      fromRef.current = target;
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
            const p = Math.min(1, Math.max(0, (t - start) / duration));
      const eased = 1 - Math.pow(1 - p, 3);
      const v = from + (target - from) * eased;
      fromRef.current = v;
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

const subscribeNoop = () => () => {};
// Aaj ki date ka timestamp (din badalne par hi badalta hai)
function todayStamp() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/* ---------------------------------------------------------------- */

export default function CenterRight({ target: targetProp }: CenterRightProps) {
  // BADLA HUA: target prop na mile to calibration wala target use hota hai
  const { calories } = useTargets();
  const target = targetProp ?? calories;

  // BADLA HUA: aaj kitne kcal khaye (tick kiye hue meals + add kiye hue snacks)
  const { meals, logged, snacks } = useMeals("today");
  const todayKcal = [...meals.filter((_, i) => logged[i]), ...snacks].reduce(
    (sum, m) => sum + m.kcal,
    0,
  );

  const stamp = useSyncExternalStore(subscribeNoop, todayStamp, () => 0);
  const now = useMemo(() => (stamp ? new Date(stamp) : null), [stamp]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  // Month badalne par bars dobara animate hon
  useEffect(() => {
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setMounted(true));
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [monthOffset, now]);

  // Dropdown ke options
  const options = now
    ? Array.from({ length: MONTHS_BACK }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
          offset: i,
          year: d.getFullYear(),
          month: d.getMonth(),
          label: d.toLocaleString("en-US", { month: "long", year: "numeric" }),
          short: d.toLocaleString("en-US", { month: "short" }),
        };
      })
    : [];

  const selected = options[monthOffset];
  const [history, setHistory] = useState<Record<number, number>>({});
const selYear = selected?.year;
const selMonth = selected?.month;

// Chuna hua mahina badle to backend se uska intake lao
useEffect(() => {
  if (selYear === undefined || selMonth === undefined) return;
  let cancelled = false;
  setHistory({});
  fetchMonthIntake(selYear, selMonth)
    .then((h) => {
      if (!cancelled) setHistory(h);
    })
    .catch(() => {
      /* backend na mile to bars khali rahengi */
    });
  return () => {
    cancelled = true;
  };
}, [selYear, selMonth]);
  const data: IntakeDay[] =
    now && selected
      ? buildMonthData(selected.year, selected.month, now, todayKcal, history)
      : [];
  const monthShort = selected?.short ?? "";
  const hasToday = data.some((d) => d.today);

  // BADLA HUA: aaj ki bar ki height smoothly badalti hai
  const todayEntry = data.find((d) => d.today);
  const animatedToday = useAnimatedNumber(todayEntry?.kcal ?? 0);

  // Average sirf un dino ka jin mein kuch khaya gaya (aaj ka adhura din shamil nahi)
const loggedDays = data.filter((d) => !d.today && d.kcal > 0);
const avgBase = loggedDays.length ? loggedDays : data.filter((d) => d.kcal > 0);
const average = avgBase.length
  ? Math.round(avgBase.reduce((s, d) => s + d.kcal, 0) / avgBase.length)
  : 0;

  const maxKcal = Math.max(...data.map((d) => d.kcal), target);
  const axisMax = Math.max(2400, Math.ceil(maxKcal / 100) * 100);
  const pxPerKcal = (BASE - TOP) / axisMax;
  const yOf = (v: number) => BASE - v * pxPerKcal;

  // Original mein beech ka tick 1.3k tha
  const midTick = Math.round((axisMax * 0.54) / 100) * 100;
  const ticks = [0, midTick, axisMax];
  const fmtTick = (v: number) => (v === 0 ? "0" : `${(v / 1000).toFixed(1)}k`);

  // Jitne din ka data hai utni bars poori width mein baant di jati hain
  // (din badhte hain to bars patli hoti jati hain)
  const slotCount = Math.max(data.length, MIN_SLOTS);
  const step = (RIGHT - LEFT) / slotCount;
  const barW = step * 0.8837;
  const barOffset = step * 0.0581;

  const targetY = yOf(target);
  const activeItem = active !== null ? data[active] : null;

  return (
    <article className="bg-white border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
      <div className="flex items-center gap-[10px] mb-[16px]">
        <div>
          <span className="text-[#8E978F] text-[11px] tracking-[.08em] uppercase">
            Daily intake
          </span>
          <h3
            className={`${bricolage.className} mt-[4px] text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            <span className="tabular-nums">
              {average.toLocaleString("en-US")}{" "}
            </span>
            kcal{" "}
            <span className="text-[#8E978F] text-[13px] tracking-[0]">
              daily average
            </span>
          </h3>
        </div>
        <div className="ml-auto flex gap-[8px] items-center ">
          <label htmlFor="intake-month" className="sr-only">
            Month
          </label>
          <select
            id="intake-month"
            value={monthOffset}
            onChange={(e) => {
              setMonthOffset(Number(e.target.value));
              setMounted(false);
              setActive(null);
            }}
            className="appearance-none border border-[#1d2a2224] bg-[#ffffff] bg-[url('/dropdown.svg')] bg-no-repeat bg-[right_12px_center] rounded-full py-[7px] pr-[32px] pl-[14px] text-[13px] cursor-pointer focus:outline-2 focus:outline-[#e8895f] focus:outline-offset-2 focus:[outline-style:solid]"
          >
            {options.map((o) => (
              <option key={o.offset} value={o.offset}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative">
        {now ? (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={`Daily calories for ${selected?.label}`}
            className="block w-full h-auto overflow-visible"
          >
            {/* Gridlines + y-axis labels */}
            {ticks.map((t) => (
              <g key={t}>
                <line
                  x1={LEFT}
                  x2={RIGHT}
                  y1={yOf(t)}
                  y2={yOf(t)}
                  stroke={GRID}
                  strokeWidth={1}
                />
                <text
                  x={30}
                  y={yOf(t) + 3}
                  textAnchor="end"
                  fontSize={11}
                  fill={AXIS_TEXT}
                >
                  {fmtTick(t)}
                </text>
              </g>
            ))}

            {/* Bars + hit areas + x labels */}
            {data.map((d, i) => {
              // BADLA HUA: aaj ki bar animate hoti hui value se, baaki asli value se
              const shownKcal = d.today ? animatedToday : d.kcal;
              const h = Math.max(0, shownKcal * pxPerKcal);
              const isOver = !d.today && d.kcal > target * 1.05;
              const fill = d.today ? TODAY : isOver ? OVER : SOFT;
              const slotX = LEFT + i * step;
              const showLabel = slotCount <= 15 || i % 3 === 0 || d.today;

              // Hover: jis bar par cursor hai wo same, baaki halki
              const dimmed = active !== null && i !== active;
              // Halki hone mein left se stagger, wapas normal hone mein koi delay nahi
              const opacityDelay = dimmed ? i * DIM_STAGGER_MS : 0;

              return (
                <g key={`${selected?.offset}-${d.day}`}>
                  <rect
                    x={slotX + barOffset}
                    y={BASE - h}
                    width={barW}
                    height={h}
                    rx={4}
                    fill={fill}
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "bottom",
                      transform: mounted ? "scaleY(1)" : "scaleY(0)",
                      opacity: dimmed ? DIM_OPACITY : 1,
                      transition: `transform 900ms cubic-bezier(.2,.8,.2,1), opacity ${DIM_DURATION_MS}ms ease`,
                      transitionDelay: `${i * 18}ms, ${opacityDelay}ms`,
                    }}
                  />
                  <rect
                    x={slotX}
                    y={14}
                    width={step}
                    height={192}
                    fill="transparent"
                    tabIndex={0}
                    className="outline-none cursor-pointer"
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                  />
                  {showLabel && (
                    <text
                      x={slotX + step / 2}
                      y={224}
                      textAnchor="middle"
                      fontSize={11}
                      fill={d.today ? INK : AXIS_TEXT}
                      fontWeight={d.today ? 600 : 400}
                    >
                      {d.day}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Target line */}
            <line
              x1={LEFT}
              x2={RIGHT}
              y1={targetY}
              y2={targetY}
              stroke={TARGET_LINE}
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <text
              x={RIGHT}
              y={targetY - 5}
              textAnchor="end"
              fontSize={11}
              fill={TARGET_TEXT}
            >
              Target {target.toLocaleString("en-US")}
            </text>
          </svg>
        ) : (
          // Date load hone tak chart ki jagah khali rakhte hain (layout na hile)
          <div className="w-full" style={{ aspectRatio: `${W} / ${H}` }} />
        )}

        {/* Tooltip */}
        {activeItem && active !== null && (
          <div
            className="absolute pointer-events-none z-10 whitespace-nowrap rounded-[10px] bg-[#1D2A22] text-white py-[7px] px-[10px] shadow-[0_10px_24px_-10px_rgba(29,42,34,0.5)]"
            style={{
              left: `clamp(56px, ${
                ((LEFT + active * step + step / 2) / W) * 100
              }%, calc(100% - 56px))`,
              // BADLA HUA: aaj ki bar par tooltip bar ke saath saath chalta hai
              top: `${
                (yOf(activeItem.today ? animatedToday : activeItem.kcal) / H) *
                100
              }%`,
              transform: "translate(-50%, calc(-100% - 10px))",
            }}
          >
            <b className="block text-[13px] font-semibold leading-[1.2]">
              {activeItem.kcal.toLocaleString("en-US")} kcal
            </b>
            <span className="block text-[11px] text-white/70 leading-[1.3]">
              {monthShort} {activeItem.day}
              {activeItem.today ? " · today so far" : ""}
            </span>
          </div>
        )}
      </div>

      <div className="mt-[12px] flex gap-[14px] flex-wrap text-[12.5px] text-[#5B665F] ">
        <span className="inline-flex items-center gap-[6px] ">
          <i className="w-[10px] h-[10px] rounded-[3px] bg-[#D5EEDA] "></i>
          Within target
        </span>
        <span className="inline-flex items-center gap-[6px] ">
          <i className="w-[10px] h-[10px] rounded-[3px] bg-[#F4C3AA] "></i>
          Over target by 5%+
        </span>
        {hasToday && (
          <span className="inline-flex items-center gap-[6px] ">
            <i className="w-[10px] h-[10px] rounded-[3px] bg-[#4e9e5c] "></i>
            Today
          </span>
        )}
      </div>
    </article>
  );
}
