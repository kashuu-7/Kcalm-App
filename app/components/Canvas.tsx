"use client";
import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  phase: number;
  color: string;
  alpha: number;
};

const COLORS = ["244,162,97", "143,191,143"]; // apricot, matcha (rgb)

export default function Canvas({ count = 40 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let particles: Particle[] = [];

    const make = (startAnywhere: boolean): Particle => ({
      x: Math.random() * width,
      y: startAnywhere ? Math.random() * height : height + 10,
      r: Math.random() * 1.8 + 0.8,
      speed: Math.random() * 0.35 + 0.15,
      drift: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.25,
    });

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: count }, () => make(true));
    };

    const tick = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speed;
        const x = p.x + Math.sin(t / 1500 + p.phase) * 12 * p.drift;

        // upar jaate hue fade out
        const fade = Math.min(1, p.y / (height * 0.3));
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha * Math.max(0, fade)})`;
        ctx.fill();

        if (p.y < -10) particles[i] = make(false);
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}