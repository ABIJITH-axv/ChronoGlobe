"use client";
import { AnimatePresence, motion } from "framer-motion";
import { EVENT_TYPES, type HistoricalEvent } from "@/lib/types";
import { fmtYear } from "@/lib/format";
import StickFigurePlayer from "./StickFigurePlayer";

interface Props {
  event: HistoricalEvent | null;
  saved: boolean;
  onToggleSave: (id: string) => void;
  onClose: () => void;
}

export default function EventDrawer({ event, saved, onToggleSave, onClose }: Props) {
  return (
    <AnimatePresence>
      {event && (() => {
        const t = EVENT_TYPES[event.type];
        const q = encodeURIComponent(event.title);
        return (
          <motion.aside
            key={event.id}
            role="dialog" aria-label={event.title}
            initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 32, stiffness: 220 }}
            className="glass absolute right-3 top-3 bottom-3 z-20 w-[calc(100%-1.5rem)] max-w-md overflow-y-auto p-6 pb-24"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs tracking-wide"
                style={{ color: t.color }}>
                <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
                {t.label}
              </span>
              <button onClick={onClose} aria-label="Close" className="rounded-full px-2 py-1 text-white/60 hover:bg-white/10">✕</button>
            </div>

            <p className="mt-5 text-sm text-white/55">{event.region}, {event.country} · {fmtYear(event.year)}</p>
            <h2 className="mt-1 font-display text-3xl font-light leading-tight">{event.title}</h2>
            <p className="mt-5 leading-relaxed text-white/80">{event.summary}</p>

            <h3 className="mt-7 text-xs uppercase tracking-[0.2em] text-white/45">Lasting impact</h3>
            <p className="mt-2 leading-relaxed text-white/80">{event.impact}</p>

            <div className="mt-7"><StickFigurePlayer animation={{ kind: "canvas", caption: `Stick-figure story of "${event.title}" (animation coming soon)` }} /></div>

            <h3 className="mt-7 text-xs uppercase tracking-[0.2em] text-white/45">Explore further</h3>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <a className="rounded-full border border-white/15 px-3 py-1 hover:bg-white/10" target="_blank" rel="noreferrer"
                href={`https://en.wikipedia.org/wiki/Special:Search?search=${q}`}>Encyclopedia</a>
              <a className="rounded-full border border-white/15 px-3 py-1 hover:bg-white/10" target="_blank" rel="noreferrer"
                href={`https://scholar.google.com/scholar?q=${q}`}>Academic papers</a>
            </div>

            <button onClick={() => onToggleSave(event.id)} aria-pressed={saved}
              className="mt-7 w-full rounded-full border border-[#4FD6E8]/50 py-2 text-sm text-[#4FD6E8] hover:bg-[#4FD6E8]/10">
              {saved ? "Saved to favorites" : "Save to favorites"}
            </button>
          </motion.aside>
        );
      })()}
    </AnimatePresence>
  );
}
