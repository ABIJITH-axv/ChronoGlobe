"use client";
import { AnimatePresence, motion } from "framer-motion";
import type { HistoricalEvent, SourceItem } from "@/lib/types";
import StickFigurePlayer from "./StickFigurePlayer";

function Sources({ title, items }: { title: string; items: SourceItem[] }) {
  if (!items.length) return null;
  return (
    <section className="mt-6">
      <h3 className="font-display text-lg">{title}</h3>
      <ul className="mt-2 space-y-2">
        {items.map((s) => (
          <li key={s.title} className="rounded bg-abyss p-3 text-sm">
            <a href={s.url} target="_blank" rel="noreferrer" className="font-medium underline">{s.title} <span aria-hidden="true">↗</span></a>
            <p className="text-chalk/60">{s.source}</p>
            {s.excerpt && <p className="mt-1">{s.excerpt}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

interface Props {
  event: HistoricalEvent | null;
  saved: boolean;
  onToggleSave: (id: string) => void;
  onClose: () => void;
}

export default function EventDrawer({ event, saved, onToggleSave, onClose }: Props) {
  return (
    <AnimatePresence>
      {event && (
        <motion.aside
          key={event.id}
          role="dialog" aria-label={event.title}
          initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 260 }}
          className="fixed right-0 top-0 z-30 h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-tide p-6 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-chalk/70">{event.region}, {event.country} · {event.year}</p>
              <h2 className="font-display text-3xl leading-tight">{event.title}</h2>
            </div>
            <button onClick={onClose} aria-label="Close" className="rounded px-2 py-1 hover:bg-abyss">✕</button>
          </div>

          <button onClick={() => onToggleSave(event.id)} aria-pressed={saved}
            className="mt-4 rounded border border-brass px-3 py-1 text-sm text-brass hover:bg-brass hover:text-abyss">
            {saved ? "Saved to favorites" : "Save to favorites"}
          </button>

          <p className="mt-5 leading-relaxed">{event.summary}</p>
          <div className="mt-6"><StickFigurePlayer animation={event.animation} /></div>

          <Sources title="Academic abstracts" items={event.abstracts} />
          <Sources title="Study papers" items={event.papers} />
          <Sources title="Articles and blogs" items={event.articles} />

          <section className="mt-6">
            <h3 className="font-display text-lg">Impact</h3>
            {(["monuments", "societal", "research"] as const).map((k) => (
              <div key={k} className="mt-3">
                <h4 className="text-sm font-medium capitalize">{k === "societal" ? "Societal effects" : k}</h4>
                <ul className="list-disc pl-5 text-sm">{event.impact[k].map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </section>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
