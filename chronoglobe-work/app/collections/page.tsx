"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { events } from "@/data/events";

const KEY = "chronoglobe:saved-events";
export default function CollectionsPage() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => { try { setIds(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { setIds([]); } }, []);
  const saved = events.filter((event) => ids.includes(event.id));
  function remove(id: string) { const next = ids.filter((item) => item !== id); setIds(next); localStorage.setItem(KEY, JSON.stringify(next)); }
  return <main className="min-h-screen bg-abyss px-4 py-8 text-chalk sm:px-8"><div className="mx-auto max-w-4xl"><Link href="/" className="text-sm text-brass hover:underline">← Back to globe</Link><p className="mt-8 text-xs uppercase tracking-[.3em] text-brass">Your personal atlas</p><h1 className="mt-2 font-display text-5xl">Saved events</h1><p className="mt-3 text-chalk/60">Keep the historical stories you want to revisit. Saved items stay in this browser in demo mode.</p>{saved.length ? <ul className="mt-8 grid gap-3 sm:grid-cols-2">{saved.map((event) => <li key={event.id} className="rounded-2xl border border-white/10 bg-tide/60 p-5"><p className="text-xs text-brass">{event.year < 0 ? `${Math.abs(event.year)} BCE` : event.year} · {event.country}</p><h2 className="mt-2 font-display text-2xl">{event.title}</h2><p className="mt-2 text-sm leading-6 text-chalk/65">{event.summary}</p><div className="mt-4 flex items-center justify-between"><Link href={`/?event=${encodeURIComponent(event.id)}`} className="text-sm text-brass hover:underline">Open globe ↗</Link><button onClick={() => remove(event.id)} className="text-xs text-chalk/50 underline hover:text-ember">Remove</button></div></li>)}</ul> : <div className="mt-8 rounded-2xl border border-dashed border-white/20 p-8 text-center"><p className="font-display text-2xl">Your atlas is waiting</p><p className="mt-2 text-sm text-chalk/55">Open an event on the globe and choose “Save to favorites”.</p><Link href="/" className="mt-5 inline-block rounded-full bg-brass px-4 py-2 text-sm font-semibold text-abyss">Explore the globe</Link></div>}<p className="mt-8 text-xs text-chalk/40">Demo mode stores favorites locally on this device. Cross-device sync requires Supabase setup.</p></div></main>;
}
