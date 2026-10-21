import type { HistoricalEvent } from "@/lib/types";

// MOCK DATA: summaries are short and factual; abstracts/papers/articles are placeholders.
const placeholder = (t: string) => ({ title: t, source: "Mock source", url: "#", excerpt: "Placeholder text. Replace with real data." });

export const events: HistoricalEvent[] = [
  {
    id: "in-salt-march", title: "Salt March", year: 1930, countryCode: "IND", country: "India",
    region: "Gujarat", lat: 20.89, lng: 72.81, category: "politics",
    summary: "Gandhi led a 240-mile march from Sabarmati Ashram to Dandi to defy the British salt tax, launching the Civil Disobedience Movement.",
    abstracts: [placeholder("Salt satyagraha and mass mobilisation")],
    papers: [placeholder("Uploaded paper: nonviolent resistance")],
    articles: [placeholder("Walking to Dandi: a retrospective")],
    impact: {
      monuments: ["National Salt Satyagraha Memorial, Dandi"],
      societal: ["Popularised nonviolent civil disobedience", "Brought international attention to the independence movement"],
      research: ["Studies of nonviolent protest strategy"],
    },
    animation: { kind: "canvas", caption: "Stick figures walk the road to Dandi" },
  },
  {
    id: "in-jallianwala", title: "Jallianwala Bagh Massacre", year: 1919, countryCode: "IND", country: "India",
    region: "Punjab", lat: 31.62, lng: 74.88, category: "conflict",
    summary: "On 13 April 1919, British Indian Army troops fired on an unarmed gathering in Amritsar, killing hundreds and hardening Indian opinion against colonial rule.",
    abstracts: [placeholder("Colonial violence and public memory")],
    papers: [], articles: [placeholder("Remembering Amritsar")],
    impact: {
      monuments: ["Jallianwala Bagh National Memorial"],
      societal: ["Accelerated the non-cooperation movement"],
      research: ["Hunter Commission records and later historiography"],
    },
    animation: { kind: "canvas", caption: "A crowd gathers in the garden" },
  },
  {
    id: "de-berlin-wall", title: "Fall of the Berlin Wall", year: 1989, countryCode: "DEU", country: "Germany",
    region: "Berlin", lat: 52.52, lng: 13.38, category: "politics",
    summary: "On 9 November 1989, East Germany opened its border crossings, and crowds began dismantling the wall that had divided Berlin since 1961. Reunification followed in 1990.",
    abstracts: [placeholder("The end of the Cold War division")],
    papers: [placeholder("Uploaded paper: peaceful revolution of 1989")],
    articles: [placeholder("The night the wall opened")],
    impact: {
      monuments: ["Berlin Wall Memorial", "East Side Gallery"],
      societal: ["German reunification", "Eastern European democratic transitions"],
      research: ["Transitional justice and Stasi archive studies"],
    },
    animation: { kind: "canvas", caption: "Figures climb the wall at night" },
  },
  {
    id: "de-nuremberg", title: "Nuremberg Trials", year: 1945, countryCode: "DEU", country: "Germany",
    region: "Bavaria", lat: 49.45, lng: 11.08, category: "conflict",
    summary: "Allied tribunals prosecuted leading Nazi officials for war crimes and crimes against humanity, setting precedents for international criminal law.",
    abstracts: [placeholder("Foundations of international criminal law")],
    papers: [], articles: [placeholder("Inside Courtroom 600")],
    impact: {
      monuments: ["Memorium Nuremberg Trials"],
      societal: ["Established individual accountability for state crimes"],
      research: ["Legal scholarship that shaped later international tribunals"],
    },
    animation: { kind: "canvas", caption: "Figures take the stand" },
  },
];

export const countriesWithEvents = new Set(events.map((e) => e.countryCode));
