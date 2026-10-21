"use client";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { HistoricalEvent } from "@/lib/types";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

/** Placeholder canvas animation: a stick figure walking. Replace with real clips per event. */
function CanvasFigure() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, g = c.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, t = 0;
    const draw = () => {
      g.clearRect(0, 0, c.width, c.height);
      g.strokeStyle = "#E3EBEE"; g.lineWidth = 3; g.lineCap = "round";
      const x = reduce ? 160 : ((t * 1.2) % (c.width + 60)) - 30, y = 90, s = Math.sin(t * 0.15) * 14;
      g.beginPath(); g.arc(x, y - 38, 9, 0, Math.PI * 2);              // head
      g.moveTo(x, y - 29); g.lineTo(x, y + 10);                         // body
      g.moveTo(x, y - 20); g.lineTo(x + s, y);                          // arms
      g.moveTo(x, y - 20); g.lineTo(x - s, y);
      g.moveTo(x, y + 10); g.lineTo(x + s, y + 40);                     // legs
      g.moveTo(x, y + 10); g.lineTo(x - s, y + 40);
      g.stroke();
      g.strokeStyle = "#D2A24C"; g.beginPath(); g.moveTo(0, y + 41); g.lineTo(c.width, y + 41); g.stroke();
      t++; if (!reduce) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} width={320} height={150} className="w-full rounded bg-abyss" aria-hidden />;
}

export default function StickFigurePlayer({ animation }: { animation: HistoricalEvent["animation"] }) {
  return (
    <figure>
      {animation.kind === "video" && animation.src ? (
        <video src={animation.src} controls className="w-full rounded" />
      ) : animation.kind === "lottie" && animation.src ? (
        <LottieFromUrl src={animation.src} />
      ) : (
        <CanvasFigure />
      )}
      <figcaption className="mt-2 text-sm text-chalk/70">{animation.caption}</figcaption>
    </figure>
  );
}

function LottieFromUrl({ src }: { src: string }) {
  const ref = useRef<any>(null);
  useEffect(() => { fetch(src).then((r) => r.json()).then((d) => (ref.current = d)); }, [src]);
  return ref.current ? <Lottie animationData={ref.current} loop /> : <p className="text-sm">Loading animation…</p>;
}
