"use client";

import { useEffect, useState } from "react";
import { fetchSteps, isoLocal, weekDays } from "../../lib/api/tracking";
import { Bricolage_Grotesque } from "next/font/google";
import useReveal from "./useReveal";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TARGET = 10000;

const VW = 560;
const VH = 200;
const X0 = 36;
const X1 = 552;
const Y_TOP = 14;
const Y_BASE = 176;
const SLOT = (X1 - X0) / 7;
const GAP = 6;

const fmt = (n: number) => n.toLocaleString("en-US");

type Tip = { x: number; y: number; title: string; sub: string };

export default function InsightRight() {
  const [week, setWeek] = useState(0);
  const [tip, setTip] = useState<Tip | null>(null);
  const grown = useReveal(week);

    const [stepsByDate, setStepsByDate] = useState<Record<string, number>>({});

  // Is hafte ke (ya chuney hue hafte ke) steps backend se
  useEffect(() => {
    let cancelled = false;
    const d = weekDays(week);
    fetchSteps(d[0], d[6])
      .then((m) => {
        if (!cancelled) setStepsByDate(m);
      })
      .catch(() => {
        /* nahi aaye to khali dikhega */
      });
    return () => {
      cancelled = true;
    };
  }, [week]);

  const days = weekDays(week);
  const todayIso = isoLocal(new Date());
  // null = us din ka koi record nahi (ya din abhi aaya nahi)
  const values: (number | null)[] = days.map((d) =>
    d > todayIso ? null : (stepsByDate[d] ?? null),
  );
  const logged = values.filter((v): v is number => v !== null);
  const avg =
    logged.length > 0
      ? Math.round(logged.reduce((a, b) => a + b, 0) / logged.length)
      : 0;
  const todayIdx = days.indexOf(todayIso); // -1 agar aaj is hafte mein nahi

  // ~12% headroom above the tallest bar / target
  const yMax = Math.max(TARGET, ...logged) * 1.12;
  const y = (v: number) => Y_BASE - (v / yMax) * (Y_BASE - Y_TOP);

  const ticks = [0, 5000, 10000];

  return (
    <article className="bg-white border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
      {/* header */}
      <div className="flex items-center gap-[10px] mb-[16px]">
        <div>
          <h3
            className={`${bricolage.className} text-[18px] font-semibold tracking-[-.03em] leading-[1.1] text-balance`}
          >
            Activity level
          </h3>
          <div className="flex items-baseline gap-[10px] mt-[8px]">
            <b
              className={`${bricolage.className} text-[32px] tracking-[-.04em] tabular-nums `}
            >
              {fmt(avg)}
            </b>
            <span className="text-[13px] text-[#8E978F]">steps / day avg</span>
          </div>
        </div>

        <div className="ml-auto flex gap-[8px] items-center ">
          <label className="sr-only" htmlFor="aWeek">
            Week
          </label>
          <select
            id="aWeek"
            value={week}
            onChange={(e) => {
              setTip(null);
              setWeek(Number(e.target.value));
            }}
            className="appearance-none border border-[#1d2a2224] bg-[#ffffff] bg-[url('/dropdown.svg')] bg-no-repeat bg-[right_12px_center] rounded-full py-[7px] pr-[32px] pl-[14px] text-[13px] cursor-pointer focus:outline-2 focus:outline-[#e8895f] focus:outline-offset-2 focus:[outline-style:solid]"
          >
            <option value={0}>This week</option>
            <option value={1}>Last week</option>
            <option value={2}>2 weeks ago</option>
          </select>
        </div>
      </div>

      {/* chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          role="img"
          aria-label="Daily steps"
          className="block w-full h-auto"
        >
          {/* gridlines + y labels */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={X0}
                x2={X1}
                y1={y(t)}
                y2={y(t)}
                stroke="#1D2A22"
                strokeOpacity=".08"
              />
              <text
                x={X0 - 6}
                y={y(t) + 3}
                textAnchor="end"
                fontSize="11"
                fill="#8E978F"
              >
                {t === 0 ? "0" : `${(t / 1000).toFixed(1)}k`}
              </text>
            </g>
          ))}

          {/* bars */}
          <g key={week}>
            {values.map((v, i) => {
              const top = v === null ? Y_BASE : y(v);
              return (
                <rect
                  key={DAYS[i]}
                  x={X0 + i * SLOT + GAP / 2}
                  y={top}
                  width={SLOT - GAP}
                  height={Y_BASE - top}
                  rx={4}
                  fill={i === todayIdx ? "#4E9E5C" : "#CFE9C8"}
                  className="transition-transform duration-[600ms] ease-[var(--ease)] motion-reduce:transition-none"
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "bottom",
                    transform: grown ? "scaleY(1)" : "scaleY(0)",
                    transitionDelay: `${i * 18}ms`,
                  }}
                />
              );
            })}
          </g>

          {/* hit areas + x labels */}
          {values.map((v, i) => {
            const cx = X0 + i * SLOT + SLOT / 2;
            const top = v === null ? Y_BASE : y(v);
            const tipData: Tip = {
              x: cx,
              y: top,
              title: v === null ? "No data yet" : `${fmt(v)} steps`,
              sub: i === todayIdx ? `${DAYS[i]} · today` : DAYS[i],
            };
            return (
              <g key={DAYS[i]}>
                <rect
                  x={X0 + i * SLOT}
                  y={Y_TOP}
                  width={SLOT}
                  height={Y_BASE - Y_TOP}
                  fill="transparent"
                  tabIndex={0}
                  className="cursor-pointer focus:outline-2 focus:outline-[#1d2a22] focus:[outline-style:solid]"
                  aria-label={`${tipData.title}, ${tipData.sub}`}
                  onClick={() => setTip(tipData)}
                  onMouseEnter={() => setTip(tipData)}
                  onFocus={() => setTip(tipData)}
                  onMouseLeave={() => setTip(null)}
                  onBlur={() => setTip(null)}
                />
                <text
                  x={cx}
                  y={194}
                  textAnchor="middle"
                  fontSize="11"
                  fill={i === todayIdx ? "#1D2A22" : "#8E978F"}
                  fontWeight={i === todayIdx ? 600 : 400}
                >
                  {DAYS[i]}
                </text>
              </g>
            );
          })}

          {/* target line */}
          <line
            x1={X0}
            x2={X1}
            y1={y(TARGET)}
            y2={y(TARGET)}
            stroke="#E8895F"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={X1}
            y={y(TARGET) - 5}
            textAnchor="end"
            fontSize="11"
            fill="#B8633A"
          >
            Target {fmt(TARGET)}
          </text>
        </svg>

        {/* tooltip */}
        {tip && (
          <div
            className="absolute pointer-events-none z-10 -translate-x-1/2 -translate-y-[110%] bg-[#1d2a22] text-white text-xs py-[7px] px-[10px] rounded-[10px] whitespace-nowrap"
            style={{
              left: `${(tip.x / VW) * 100}%`,
              top: `${(tip.y / VH) * 100}%`,
            }}
          >
            <b className="block text-[13px]">{tip.title}</b>
            {tip.sub}
          </div>
        )}
      </div>
    </article>
  );
}
