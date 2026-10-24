"use client";
import { useEffect, useRef, useState } from "react";
import { localReply } from "@/lib/guide";
import { fmtYear } from "@/lib/format";
import type { HistoricalEvent } from "@/lib/types";

interface Msg { role: "user" | "assistant"; text: string; ids?: string[] }

const SUGGESTIONS = ["Surprise me", "How do I use this?", "Events in India", "Scientific discoveries"];
const GREETING: Msg = { role: "assistant", text: "Hi, I'm Chrono. Ask about any event, place or era, or how to use the globe." };

export default function ChatBot({ events, onOpenEvent }: { events: HistoricalEvent[]; onOpenEvent: (e: HistoricalEvent) => void }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, open, busy]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", text: q }];
    setMsgs(next); setInput(""); setBusy(true);

    let reply: Msg | null = null;
    try {
      // Uses AI when the server has a key; otherwise falls through to the built-in guide.
      const r = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, text: m.text })) }),
      });
      if (r.ok) {
        const d = await r.json();
        if (d.text) reply = {
          role: "assistant", text: d.text,
          ids: events.filter((e) => d.text.toLowerCase().includes(e.title.toLowerCase())).slice(0, 3).map((e) => e.id),
        };
      }
    } catch { /* fall back below */ }
    if (!reply) { const l = localReply(q, events); reply = { role: "assistant", text: l.text, ids: l.ids }; }
    setMsgs((m) => [...m, reply!]); setBusy(false);
  }

  return (
    <>
      {open && (
        <section aria-label="Chrono guide"
          className="glass absolute bottom-36 right-4 z-30 flex h-[min(30rem,60vh)] w-[min(22rem,calc(100vw-2rem))] flex-col sm:bottom-16">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs uppercase tracking-[0.25em] text-white/55">Chrono</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full px-2 text-white/55 hover:bg-white/10">✕</button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-2 text-sm" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2 leading-relaxed ${m.role === "user" ? "bg-[#4FD6E8]/15 text-white" : "bg-white/[0.06] text-white/85"}`}>
                  {m.text}
                  {m.ids && m.ids.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.ids.map((id) => {
                        const e = events.find((x) => x.id === id);
                        return e ? (
                          <button key={id} onClick={() => onOpenEvent(e)}
                            className="rounded-full border border-white/20 px-2.5 py-0.5 text-xs text-[#4FD6E8] hover:bg-white/10">
                            {e.title} · {fmtYear(e.year)}
                          </button>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && <div className="text-white/40">Thinking…</div>}
            {msgs.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70 hover:bg-white/10">{s}</button>
                ))}
              </div>
            )}
            <div ref={end} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask anything" aria-label="Message Chrono"
              className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-white/35 focus:border-[#4FD6E8]/60" />
          </form>
        </section>
      )}

      <button onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className="glass absolute bottom-24 right-4 z-30 flex items-center gap-2 !rounded-full px-4 py-2 text-sm text-white/85 hover:bg-white/10 sm:bottom-4">
        <span className="h-2 w-2 rounded-full bg-[#4FD6E8]" /> Ask Chrono
      </button>
    </>
  );
}
