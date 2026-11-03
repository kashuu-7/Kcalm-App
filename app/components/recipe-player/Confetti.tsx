"use client";

import { useEffect, useRef } from "react";

type Shape = "rect" | "ribbon" | "dot";

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  wobble: number;
  wobbleSpeed: number;
  color: string;
  shape: Shape;
};

// Yahan se badal sakte ho
const COLORS = [
  "#4E9E5C",
  "#2E6B3E",
  "#F4A07E",
  "#E8895F",
  "#FFE7A3",
  "#3F8FC4",
  "#C9A7EB",
  "#F4C3AA",
];
const COUNT = 190; // kitne tukde
const DURATION = 3.2; // kitne second chalega
const FADE = 0.9; // aakhri kitne second mein gayab ho
const GRAVITY = 520; // neeche girne ki raftaar

const rand = (min: number, max: number) => min + Math.random() * (max - min);

// trigger ko 1 se badhao to naya burst chalta hai (0 = kuch nahi)
export default function Confetti({ trigger }: { trigger: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (trigger === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = w / 2;
    const cy = h / 2;

    // Beech se har taraf phatne wale tukde
    const pieces: Piece[] = Array.from({ length: COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = rand(280, 980);
      const r = Math.random();
      const shape: Shape = r < 0.45 ? "rect" : r < 0.8 ? "ribbon" : "dot";

      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 120, // thoda upar ki taraf bhi
        w:
          shape === "ribbon"
            ? rand(3, 5)
            : shape === "dot"
              ? rand(5, 8)
              : rand(7, 11),
        h: shape === "ribbon" ? rand(16, 28) : shape === "dot" ? 0 : rand(5, 8),
        rot: rand(0, Math.PI * 2),
        vr: rand(-10, 10),
        wobble: rand(0, Math.PI * 2),
        wobbleSpeed: rand(6, 14),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape,
      };
    });

    const start = performance.now();
    let last = start;
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.04, (now - last) / 1000);
      last = now;
      const age = (now - start) / 1000;

      ctx.clearRect(0, 0, w, h);
      const alpha = age > DURATION - FADE ? Math.max(0, (DURATION - age) / FADE) : 1;

      for (const p of pieces) {
        // Hawa ki rukawat aur gravity
        p.vx *= Math.pow(0.2, dt);
        p.vy = p.vy * Math.pow(0.35, dt) + GRAVITY * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.wobble += p.wobbleSpeed * dt;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;

        if (p.shape === "dot") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // cos se palatne ka asar (ribbon hawa mein ghoomta lage)
          ctx.scale(1, Math.cos(p.wobble));
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }

      if (age < DURATION) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, w, h);
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full z-[100] pointer-events-none"
    />
  );
}