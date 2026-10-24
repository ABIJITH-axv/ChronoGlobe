import type { HistoricalEvent } from "./types";
import { fmtYear } from "./format";

export interface BotReply { text: string; ids?: string[] }

const STOP = new Set("a an the of in on at to for and or is are was were what who when where why how about tell me show give any some events event history did does do with from by it its this that these those i you my your can could please".split(" "));

const TYPE_WORDS: Record<string, string> = {
  war: "war", battle: "war", conflict: "war", revolution: "revolution", independence: "revolution", reform: "revolution",
  science: "science", scientific: "science", discovery: "science", discoveries: "science", technology: "science", invention: "science", space: "science",
  culture: "culture", religion: "culture", religious: "culture", art: "culture",
  exploration: "exploration", explorer: "exploration", trade: "exploration", voyage: "exploration",
  disaster: "disaster", pandemic: "disaster", plague: "disaster",
  rights: "rights", justice: "rights", politics: "politics", empire: "politics",
  economy: "economy", industry: "economy", economic: "economy",
};
const TYPE_NAMES: Record<string, string> = {
  war: "war and conflict", revolution: "revolution and reform", politics: "politics and empire", science: "science and technology",
  culture: "culture and religion", exploration: "exploration and trade", disaster: "disasters and pandemics", rights: "rights and society", economy: "industry and economy",
};
const ALIASES: Record<string, string> = { usa: "united states", us: "united states", america: "united states", uk: "united kingdom", britain: "united kingdom", england: "united kingdom", turkey: "türkiye", ussr: "russia", "soviet union": "russia" };

const list = (es: HistoricalEvent[]) => es.map((e) => `• ${e.title} (${fmtYear(e.year)}, ${e.country})`).join("\n");
const pick = (es: HistoricalEvent[], n: number) => es.slice(0, n);

export function localReply(raw: string, events: HistoricalEvent[]): BotReply {
  const q = raw.toLowerCase().trim();
  const has = (re: RegExp) => re.test(q);

  if (has(/^(hi|hello|hey|namaste)\b/)) return { text: "Hello! Ask me about any event, place or era, or say \"surprise me\"." };

  if (has(/surprise|random/)) {
    const e = events[Math.floor(Math.random() * events.length)];
    return { text: `Try this one: ${e.title} (${fmtYear(e.year)}, ${e.country}).\n${e.summary}`, ids: [e.id] };
  }

  if (has(/how (do|can) i|how does|how to|\bhelp\b|navigate|use this|get started/))
    return { text: "Drag the globe to turn it and scroll to zoom. Click a glowing pin to open an event, or click a tinted country to see its history. Use the colour filters and the timeline slider at the bottom, and the search box at the top left." };
  if (has(/filter|colou?r|legend|types?\b/) && !has(/war|science/))
    return { text: "Each colour is an event type: war, revolution, politics, science, culture, exploration, disaster, rights, and economy. Tap a type at the bottom to show or hide it." };
  if (has(/timeline|slider|era\b/))
    return { text: "The slider at the bottom shows events up to the year you choose. Drag it left to see only the ancient world." };
  if (has(/save|favou?rite/))
    return { text: "Use \"Save to favorites\" in an event panel. For now favorites last for this visit; saving to your account is coming soon." };
  if (has(/log ?in|sign ?up|account|teacher|student|classroom/))
    return { text: "Sign up from the top right and choose Student, Teacher or Researcher. Classroom sharing for teachers is planned next." };
  if (has(/map style|theme|style/))
    return { text: "Use the style menu at the top right to switch between Deep space, Night lights and Blue marble." };
  if (has(/animation|stick|video/))
    return { text: "Each event panel has a stick-figure animation slot. Real animated stories are coming soon." };

  const country = [...new Set(events.map((e) => e.country))].find((c) => has(new RegExp(`\\b${c.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`)))
    ?? Object.entries(ALIASES).filter(([k]) => has(new RegExp(`\\b${k}\\b`))).map(([, v]) => events.find((e) => e.country.toLowerCase() === v)?.country).find(Boolean);
  if (country) {
    const es = events.filter((e) => e.country === country);
    return { text: `${country} has ${es.length} event${es.length > 1 ? "s" : ""} on the globe:\n${list(pick(es, 6))}`, ids: pick(es, 6).map((e) => e.id) };
  }

  const yearMatch = q.match(/\b(\d{3,4})\s*(bce|bc)?\b/);
  if (yearMatch) {
    const y = (yearMatch[2] ? -1 : 1) * Number(yearMatch[1]);
    const es = [...events].sort((a, b) => Math.abs(a.year - y) - Math.abs(b.year - y)).filter((e) => Math.abs(e.year - y) <= 40);
    if (es.length) return { text: `Events near ${fmtYear(y)}:\n${list(pick(es, 5))}`, ids: pick(es, 5).map((e) => e.id) };
  }

  const tokens = q.replace(/[^\p{L}\p{N}\s-]/gu, " ").split(/\s+/).filter((t) => t.length > 2 && !STOP.has(t));
  const typeKey = tokens.map((t) => TYPE_WORDS[t]).find(Boolean);
  if (typeKey && tokens.length <= 3) {
    const es = events.filter((e) => e.type === typeKey);
    return { text: `A few ${TYPE_NAMES[typeKey]} events (${es.length} in total):\n${list(pick(es, 6))}`, ids: pick(es, 6).map((e) => e.id) };
  }

  const scored = events
    .map((e) => {
      const hay = `${e.title} ${e.country} ${e.region} ${e.summary} ${e.impact}`.toLowerCase();
      return { e, s: tokens.reduce((n, t) => n + (hay.includes(t) ? (e.title.toLowerCase().includes(t) ? 3 : 1) : 0), 0) };
    })
    .filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, 4).map((x) => x.e);
  if (scored.length)
    return { text: `Here is what I found:\n${list(scored)}\n\nOpen one to see its summary and impact.`, ids: scored.map((e) => e.id) };

  return { text: "I couldn't find that in the current set of events. Try a country, a year, or a theme such as \"science\" or \"revolution\". You can also say \"surprise me\"." };
}
