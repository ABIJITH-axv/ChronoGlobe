export type Role = "student" | "teacher" | "researcher";

export type EventType =
  | "war" | "revolution" | "politics" | "science" | "culture"
  | "exploration" | "disaster" | "rights" | "economy";

// Calm, cool palette: soft neon tones that stay readable on a dark globe.
export const EVENT_TYPES: Record<EventType, { label: string; color: string }> = {
  war:         { label: "War & conflict",       color: "#FF7A7A" },
  revolution:  { label: "Revolution & reform",  color: "#FFA45B" },
  politics:    { label: "Politics & empire",    color: "#7AA2FF" },
  science:     { label: "Science & technology", color: "#4FD6E8" },
  culture:     { label: "Culture & religion",   color: "#B48CFF" },
  exploration: { label: "Exploration & trade",  color: "#6EE7A8" },
  disaster:    { label: "Disaster & pandemic",  color: "#F2D16B" },
  rights:      { label: "Rights & society",     color: "#FF8FCB" },
  economy:     { label: "Industry & economy",   color: "#D8B4A0" },
};

export interface HistoricalEvent {
  id: string;
  title: string;
  year: number;          // negative = BCE
  countryCode: string;   // ISO A3
  country: string;
  region: string;
  lat: number;
  lng: number;
  type: EventType;
  summary: string;
  impact: string;
}
