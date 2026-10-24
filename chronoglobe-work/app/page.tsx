"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import GlobeView, { THEMES, type ThemeName } from "@/components/globe/GlobeView";
import EventDrawer from "@/components/events/EventDrawer";
import ChatBot from "@/components/chat/ChatBot";
import { events } from "@/data/events";
import { EVENT_TYPES, type EventType, type HistoricalEvent } from "@/lib/types";
import { fmtYear } from "@/lib/format";

const ALL_TYPES = Object.keys(EVENT_TYPES) as EventType[];
const MIN_YEAR = -3500;
const MAX_YEAR = 2026;
const COUNTRY_COUNT = new Set(events.map((e) => e.countryCode)).size;

export default function Home() {
  const [theme, setTheme] = useState<ThemeName>("Deep space");
  const [country, setCountry] = useState<string | null>(null);
  const [selected, setSelected] = useState<HistoricalEvent | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set()); // TODO: persist to Supabase `favorites`
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<Set<EventType>>(new Set(ALL_TYPES));
  const [upTo, setUpTo] = useState(MAX_YEAR);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) =>
      types.has(e.type) && e.year <= upTo &&
      (!q || `${e.title} ${e.country} ${e.region} ${e.summary}`.toLowerCase().includes(q)));
  }, [query, types, upTo]);

  const pins = country ? visible.filter((e) => e.countryCode === country) : visible;
  const showList = !!query.trim() || !!country;
  const countryName = country ? events.find((e) => e.countryCode === country)?.country : null;

  const toggleType = (t: EventType) =>
    setTypes((s) => { const n = new Set(s); n.has(t) ? n.delete(t) : n.add(t); return n; });
  const toggleSave = (id: string) =>
    setSaved((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const openEvent = (e: HistoricalEvent) => {
    setCountry((c) => (c === e.countryCode ? c : null));
    setSelected(e);
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <GlobeView
        events={pins}
        allEvents={events}
        theme={theme}
        activeCountry={country}
        selected={selected}
        onCountryClick={(iso) => { setSelected(null); setCountry(events.some((e) => e.countryCode === iso) ? iso : null); }}
        onEventClick={setSelected}
      />

      <header className="absolute left-0 top-0 z-10 flex w-full items-center justify-between px-5 py-4">
        <h1 className="font-display text-base font-light tracking-[0.4em] text-white/85">CHRONOGLOBE</h1>
        <nav className="flex items-center gap-4 text-xs text-white/60">
          <label className="sr-only" htmlFor="theme">Map style</label>
          <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value as ThemeName)}
            className="cursor-pointer bg-transparent text-white/60 outline-none hover:text-white">
            {Object.keys(THEMES).map((t) => <option key={t} className="bg-[#0B1424]">{t}</option>)}
          </select>
          <Link href="/login" className="hover:text-white">Log in</Link>
          <Link href="/signup" className="rounded-full border border-[#4FD6E8]/50 px-3 py-1 text-[#4FD6E8] hover:bg-[#4FD6E8]/10">Sign up</Link>
        </nav>
      </header>

      <section className="absolute left-5 top-16 z-10 w-[min(19rem,calc(100vw-2.5rem))]">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search history"
          aria-label="Search events"
          className="glass !rounded-full w-full px-4 py-2 text-sm outline-none placeholder:text-white/35 focus:border-[#4FD6E8]/50" />
        <p className="mt-2 px-2 text-[11px] uppercase tracking-[0.2em] text-white/35">
          {visible.length} events · {COUNTRY_COUNT} countries
        </p>

        {country && (
          <div className="mt-2 flex items-center justify-between px-2 text-sm">
            <span className="font-display font-light">{countryName}</span>
            <button onClick={() => setCountry(null)} className="text-xs text-white/50 hover:text-white">World</button>
          </div>
        )}

        {showList && (
          <ul className="glass mt-2 max-h-[45vh] space-y-0.5 overflow-y-auto p-2 text-sm">
            {pins.slice(0, 40).map((e) => (
              <li key={e.id}>
                <button onClick={() => setSelected(e)} className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-white/10">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: EVENT_TYPES[e.type].color }} />
                  <span className="text-white/85">{e.title}
                    <span className="block text-xs text-white/40">{e.region} · {fmtYear(e.year)}</span></span>
                </button>
              </li>
            ))}
            {!pins.length && <li className="px-2 py-1 text-white/40">No events match.</li>}
          </ul>
        )}
      </section>

      <div className="absolute bottom-4 left-4 right-4 z-10 sm:left-1/2 sm:right-auto sm:w-[min(40rem,calc(100vw-12rem))] sm:-translate-x-1/2">
        <div className="flex gap-1 overflow-x-auto pb-1 sm:justify-center">
          {ALL_TYPES.map((t) => {
            const on = types.has(t);
            return (
              <button key={t} onClick={() => toggleType(t)} aria-pressed={on}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] transition ${on ? "text-white/85" : "text-white/30"}`}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: EVENT_TYPES[t].color, opacity: on ? 1 : 0.3 }} />
                {EVENT_TYPES[t].label}
              </button>
            );
          })}
        </div>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-white/45">
          <span className="w-14 text-right">{fmtYear(MIN_YEAR)}</span>
          <input type="range" min={MIN_YEAR} max={MAX_YEAR} value={upTo} onChange={(e) => setUpTo(Number(e.target.value))}
            aria-label="Show events up to year" className="h-px w-full accent-[#4FD6E8]" />
          <span className="w-14">{fmtYear(upTo)}</span>
        </div>
      </div>

      <EventDrawer event={selected} saved={!!selected && saved.has(selected.id)}
        onToggleSave={toggleSave} onClose={() => setSelected(null)} />
      <ChatBot events={events} onOpenEvent={openEvent} />
    </main>
  );
}
