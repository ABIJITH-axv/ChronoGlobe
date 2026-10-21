export type Role = "student" | "teacher" | "researcher";

export interface SourceItem { title: string; source: string; url: string; excerpt?: string }

export interface HistoricalEvent {
  id: string;
  title: string;
  year: number;
  countryCode: string; // ISO A3, matches the GeoJSON ISO_A3 property
  country: string;
  region: string;      // state / province
  lat: number;
  lng: number;
  category: "conflict" | "politics" | "culture" | "science";
  summary: string;
  abstracts: SourceItem[];
  papers: SourceItem[];     // uploaded study papers (later: Supabase Storage)
  articles: SourceItem[];
  impact: { monuments: string[]; societal: string[]; research: string[] };
  animation: { kind: "canvas" | "lottie" | "video"; src?: string; caption: string };
}
