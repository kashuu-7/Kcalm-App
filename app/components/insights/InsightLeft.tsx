"use client";

import { useEffect, useMemo, useState } from "react";
import { useProfile } from "../profile/ProfileContext";
import { addDays, fetchWeightLogs, isoLocal, type WeightPoint } from "../../lib/api/tracking";
import { Bricolage_Grotesque } from "next/font/google";
import useReveal from "./useReveal";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type Point = { label: string; kg: number };

const WEEKS_BACK = 12;

// Pichle 12 hafte ke wazan ke points: har hafte ka aakhri maloom wazan
function buildWeekly(logs: WeightPoint[], fallbackKg: number): Point[] {
  const today = new Date();
  return Array.from({ length: WEEKS_BACK }, (_, i) => {
    const day = addDays(today, -(WEEKS_BACK - 1 - i) * 7);
    const iso = isoLocal(day);
    let kg: number | undefined;
    for (const l of logs) {
      if (l.date <= iso) kg = l.kg;
    }
    // Us hafte se pehle koi record nahi: sabse purana record (ya profile ka wazan)
    if (kg === undefined) kg = logs.length > 0 ? logs[0].kg : fallbackKg;
    return {
      label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      kg: Math.round(kg * 10) / 10,
    };
  });
}

const VW = 520;
const VH = 200;
const X0 = 34;
const X1 = 506;
const Y_TOP = 16;
const Y_BASE = 176;

type Tip = { x: number; y: number; title: string; sub: string };

export default function InsightLeft() {
  const [weeks, setWeeks] = useState(8);
  const [tip, setTip] = useState<Tip | null>(null);
  const drawn = useReveal(weeks);
    const { profile } = useProfile();
  const [logs, setLogs] = useState<WeightPoint[]>([]);

  // Wazan ke records backend se
  useEffect(() => {
    let cancelled = false;
    const end = new Date();
    fetchWeightLogs(isoLocal(addDays(end, -WEEKS_BACK * 7)), isoLocal(end))
      .then((rows) => {
        if (!cancelled) setLogs(rows);
      })
      .catch(() => {
        /* nahi aaye to profile ke wazan ki seedhi line dikhegi */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const data = useMemo(
    () => buildWeekly(logs, profile.weight).slice(-weeks),
    [logs, profile.weight, weeks],
  );

  const first = data[0];
  const last = data[data.length - 1];
  const delta = last.kg - first.kg;

  const values = data.map((d) => d.kg);
  const yMin = Math.floor(Math.min(...values)) - 1;
  const yMax = Math.floor(Math.max(...values)) + 1;
  const ticks = Array.from({ length: yMax - yMin + 1 }, (_, i) => yMin + i);

  const stepX = (X1 - X0) / (data.length - 1);
  const x = (i: number) => X0 + i * stepX;
  const y = (v: number) =>
    Y_BASE - ((v - yMin) / (yMax - yMin)) * (Y_BASE - Y_TOP);

  const linePath = data
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(d.kg).toFixed(1)}`,
    )
    .join("");
  const areaPath = `${linePath} L${X1} ${Y_BASE} L${X0} ${Y_BASE}Z`;

  return (
    <article className="bg-white border border-[#1d2a2214] rounded-[24px] p-[22px] shadow-[var(--shadow)] min-w-0">
      {/* header */}
      <div className="flex items-center gap-[10px] mb-[16px]">
        <div>
          <h3
            className={`${bricolage.className} font-semibold text-[18px] tracking-[-.03em] m-0 leading-[1.1] text-balance`}
          >
            Weight trend
          </h3>
          <div className="flex items-baseline gap-[10px] mt-[8px]">
            <b
              className={`${bricolage.className} text-[32px] tracking-[-.04em] tabular-nums `}
            >
              {last.kg} kg
            </b>
            <span className="bg-[#E9F6EC] text-[#2E6B3E] inline-flex items-center text-[12px] gap-[6px] py-[4px] px-[10px] rounded-full whitespace-nowrap">
              {delta >= 0 ? "+" : ""}
              {delta.toFixed(1)} kg since {first.label}
            </span>
          </div>
        </div>

        <div className="ml-auto flex gap-[8px] items-center ">
          <label className="sr-only" htmlFor="wRange">
            Range
          </label>
          <select
            id="wRange"
            value={weeks}
            onChange={(e) => {
              setTip(null);
              setWeeks(Number(e.target.value));
            }}
            className="appearance-none border border-[#1d2a2224] bg-[#ffffff] bg-[url('/dropdown.svg')] bg-no-repeat bg-[right_12px_center] rounded-full py-[7px] pr-[32px] pl-[14px] text-[13px] cursor-pointer focus:outline-2 focus:outline-[#e8895f] focus:outline-offset-2 focus:[outline-style:solid]"
          >
            <option value={4}>Last 4 weeks</option>
            <option value={8}>Last 8 weeks</option>
            <option value={12}>Last 12 weeks</option>
          </select>
        </div>
      </div>

      {/* chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          role="img"
          aria-label="Weekly weight trend"
          className="block w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="lg1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#4E9E5C" stopOpacity=".22" />
              <stop offset="1" stopColor="#4E9E5C" stopOpacity="0" />
            </linearGradient>
          </defs>

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
                {t}
              </text>
            </g>
          ))}

          {/* area + line */}
          <g key={weeks}>
            <path d={areaPath} fill="url(#lg1)" />
            <path
              d={linePath}
              fill="none"
              stroke="#4E9E5C"
              strokeWidth="2.2"
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={drawn ? 0 : 1}
              className="transition-[stroke-dashoffset] duration-[1600ms] ease-[var(--ease)] motion-reduce:transition-none"
            />
          </g>

          {/* points, hit areas, x labels */}
          {data.map((d, i) => {
            const isLast = i === data.length - 1;
            const tipData: Tip = {
              x: x(i),
              y: y(d.kg),
              title: `${d.kg} kg`,
              sub: `Week of ${d.label}`,
            };
            return (
              <g key={d.label}>
                <circle
                  cx={x(i)}
                  cy={y(d.kg)}
                  r={isLast ? 5 : 3}
                  fill={isLast ? "#4E9E5C" : "#fff"}
                  stroke="#4E9E5C"
                  strokeWidth="2"
                />
                <rect
                  x={x(i) - (stepX - 2.5) / 2}
                  y={Y_TOP}
                  width={stepX - 2.5}
                  height={Y_BASE - Y_TOP}
                  fill="transparent"
                  tabIndex={0}
                  className="cursor-pointer focus:outline-2 focus:outline-[#1d2a22] focus:[outline-style:solid]"
                  aria-label={`${d.kg} kg, week of ${d.label}`}
                  onClick={() => setTip(tipData)}
                  onMouseEnter={() => setTip(tipData)}
                  onFocus={() => setTip(tipData)}
                  onMouseLeave={() => setTip(null)}
                  onBlur={() => setTip(null)}
                />
                <text
                  x={x(i)}
                  y={194}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#8E978F"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* tooltip */}
        {tip && (
          <div
            className="absolute pointer-events-none bg-[#1d2a22] text-white text-xs py-[7px] px-[10px] rounded-[10px] whitespace-nowrap translate-[-50%_-110%] "
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
