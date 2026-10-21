"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import GlobeView, { GLOBE_THEMES, type ThemeName } from "@/components/globe/GlobeView";
import EventDrawer from "@/components/events/EventDrawer";
import { events } from "@/data/events";
import type { HistoricalEvent } from "@/lib/types";

const categories = ["all", "politics", "culture", "science", "conflict"] as const;
const SAVED_KEY = "chronoglobe:saved-events";

export default function Home() {
  const [theme, setTheme] = useState<ThemeName>("Night lights");
  const [country, setCountry] = useState<string | null>(null);
  const [selected, setSelected] = useState<HistoricalEvent | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("all");
  const [showEvents, setShowEvents] = useState(true);

  useEffect(() => {
    try { setSaved(new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"))); } catch { setSaved(new Set()); }
    const eventId = new URLSearchParams(window.location.search).get("event");
    if (eventId) setSelected(events.find((event) => event.id === eventId) || null);
  }, []);
  useEffect(() => { localStorage.setItem(SAVED_KEY, JSON.stringify([...saved])); }, [saved]);

  const filteredEvents = useMemo(() => events.filter((event) => {
    const matchesCountry = !country || event.countryCode === country;
    const matchesCategory = category === "all" || event.category === category;
    const text = `${event.title} ${event.country} ${event.region} ${event.summary} ${event.year}`.toLowerCase();
    return matchesCountry && matchesCategory && text.includes(query.toLowerCase().trim());
  }), [country, category, query]);
  const selectedCountry = events.find((event) => event.countryCode === country)?.country;

  const toggleSave = (id: string) => setSaved((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-abyss text-chalk lg:h-screen">
      <div className="absolute inset-0 min-h-[55vh] lg:min-h-0"><GlobeView events={filteredEvents} theme={theme} activeCountry={country}
        onCountryClick={(iso) => setCountry(events.some((event) => event.countryCode === iso) ? iso : null)} onEventClick={setSelected} /></div>
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-abyss/85 px-4 py-3 backdrop-blur-md sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="ChronoGlobe home"><span className="grid h-10 w-10 place-items-center rounded-full border border-brass/60 text-brass">◉</span><span><span className="block font-display text-xl tracking-wide">ChronoGlobe</span><span className="block text-[10px] uppercase tracking-[.24em] text-chalk/50">History, place by place</span></span></Link>
        <nav className="flex items-center gap-2 text-sm" aria-label="Main navigation"><Link className="rounded-full px-3 py-2 hover:bg-white/10" href="/timeline">Timeline</Link><Link className="rounded-full px-3 py-2 hover:bg-white/10" href="/collections">Saved <span className="text-brass">{saved.size}</span></Link><Link href="/login" className="rounded-full border border-white/20 px-3 py-2 hover:border-brass">Log in</Link><Link href="/signup" className="rounded-full bg-brass px-4 py-2 font-semibold text-abyss hover:bg-[#e5b75e]">Join free</Link></nav>
      </header>
      <div className="relative z-10 grid gap-3 p-3 sm:p-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-5">
        <section className="flex min-h-[55vh] flex-col justify-between lg:min-h-[calc(100vh-100px)]" aria-label="Interactive historical globe">
          <div className="pointer-events-none max-w-xl pt-4 sm:pt-8"><p className="mb-3 text-xs font-semibold uppercase tracking-[.3em] text-brass">A living atlas of human history</p><h1 className="font-display text-4xl leading-[1.05] sm:text-6xl">The world is your <span className="italic text-brass">timeline.</span></h1><p className="mt-4 max-w-md text-sm leading-6 text-chalk/70 sm:text-base">Travel through centuries, discover the people and moments that shaped our world, and follow the sources behind every story.</p></div>
          <div className="pointer-events-auto mt-5 flex flex-wrap items-center gap-2 self-start rounded-2xl border border-white/10 bg-abyss/80 p-3 text-xs backdrop-blur-md"><span className="mr-1 text-chalk/60">MAP STYLE</span><label htmlFor="theme" className="sr-only">Map style</label><select id="theme" value={theme} onChange={(e) => setTheme(e.target.value as ThemeName)} className="rounded-full border border-white/15 bg-tide px-3 py-2 text-chalk">{Object.keys(GLOBE_THEMES).map((name) => <option key={name}>{name}</option>)}</select><span className="ml-2 inline-flex items-center gap-2 text-chalk/60"><i className="h-2 w-2 rounded-full bg-brass" /> Historical event</span><span className="inline-flex items-center gap-2 text-chalk/60"><i className="h-2 w-2 rounded-full bg-ember" /> Conflict</span></div>
        </section>
        <aside className="relative z-10 self-start overflow-hidden rounded-2xl border border-white/10 bg-[#102633]/95 shadow-2xl backdrop-blur-xl lg:mt-2 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
          <div className="border-b border-white/10 p-4 sm:p-5"><div className="flex items-center justify-between"><div><p className="text-[10px] uppercase tracking-[.25em] text-brass">Discover</p><h2 className="mt-1 font-display text-2xl">Historical atlas</h2></div><button onClick={() => setShowEvents((v) => !v)} className="rounded-lg border border-white/15 px-3 py-2 text-xs hover:border-brass" aria-expanded={showEvents}>{showEvents ? "Hide list" : "Show list"}</button></div>
            <label className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-abyss/70 px-3 py-2.5"><span aria-hidden="true" className="text-chalk/45">⌕</span><span className="sr-only">Search historical events</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events, places, years…" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-chalk/35" /></label>
            <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Filter by category">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`rounded-full px-3 py-1.5 text-xs capitalize transition ${category === item ? "bg-brass font-semibold text-abyss" : "border border-white/10 text-chalk/65 hover:border-brass/60"}`}>{item}</button>)}</div>
            {country && <div className="mt-3 flex items-center justify-between rounded-lg bg-brass/10 px-3 py-2 text-xs"><span>Showing {selectedCountry || "selected country"}</span><button onClick={() => setCountry(null)} className="underline">Clear country</button></div>}
          </div>
          {showEvents && <div className="p-3 sm:p-4"><div className="mb-3 flex items-center justify-between text-xs text-chalk/50"><span>{filteredEvents.length} curated events</span><span>Oldest first</span></div>
            {filteredEvents.length ? <ul className="space-y-2">{filteredEvents.slice().sort((a, b) => a.year - b.year).map((event) => <li key={event.id}><button onClick={() => setSelected(event)} className="group w-full rounded-xl border border-white/[.07] bg-white/[.025] p-3 text-left transition hover:border-brass/50 hover:bg-white/[.05]"><span className="flex items-start justify-between gap-3"><span className="font-display text-base leading-snug group-hover:text-brass">{event.title}</span><span className="shrink-0 font-mono text-xs text-brass">{event.year < 0 ? `${Math.abs(event.year)} BCE` : event.year}</span></span><span className="mt-1 block text-xs text-chalk/50">{event.region}, {event.country}</span><span className="mt-2 line-clamp-2 block text-xs leading-5 text-chalk/65">{event.summary}</span><span className="mt-3 flex items-center justify-between"><span className="rounded-full bg-white/[.06] px-2 py-1 text-[10px] uppercase tracking-wider text-chalk/55">{event.category}</span><span className="text-xs text-brass">Explore story ↗</span></span></button></li>)}</ul> : <div className="rounded-xl border border-dashed border-white/15 p-6 text-center"><p className="font-display text-lg">No events found</p><p className="mt-1 text-xs text-chalk/55">Try another search or clear a filter.</p><button onClick={() => { setQuery(""); setCategory("all"); setCountry(null); }} className="mt-3 text-xs text-brass underline">Reset filters</button></div>}
          </div>}
          <div className="border-t border-white/10 px-4 py-3 text-[10px] leading-4 text-chalk/40">Demo edition · Historical entries are curated sample data. Follow each source link and verify claims before academic use.</div>
        </aside>
      </div>
      <EventDrawer event={selected} saved={!!selected && saved.has(selected.id)} onToggleSave={toggleSave} onClose={() => setSelected(null)} />
    </main>
  );
}
