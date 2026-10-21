"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import type { HistoricalEvent } from "@/lib/types";

// react-globe.gl touches `window`, so it must load client-side only.
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export const GLOBE_THEMES = {
  "Blue marble": "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
  "Night lights": "//unpkg.com/three-globe/example/img/earth-night.jpg",
  "Dark": "//unpkg.com/three-globe/example/img/earth-dark.jpg",
} as const;
export type ThemeName = keyof typeof GLOBE_THEMES;

const COUNTRIES_URL =
  "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson";

interface Props {
  events: HistoricalEvent[];
  theme: ThemeName;
  activeCountry: string | null;           // ISO A3
  onCountryClick: (iso: string, lat: number, lng: number) => void;
  onEventClick: (e: HistoricalEvent) => void;
}

export default function GlobeView({ events, theme, activeCountry, onCountryClick, onEventClick }: Props) {
  const globeRef = useRef<any>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [countries, setCountries] = useState<any[]>([]);

  useEffect(() => {
    fetch(COUNTRIES_URL).then((r) => r.json()).then((d) => setCountries(d.features));
  }, []);

  useEffect(() => {
    const el = wrapRef.current!;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const withEvents = useMemo(() => new Set(events.map((e) => e.countryCode)), [events]);
  const visibleEvents = activeCountry ? events.filter((e) => e.countryCode === activeCountry) : events;

  // Drill-down: fly to the country; pins for its regions are already in `visibleEvents`.
  useEffect(() => {
    if (!activeCountry || !globeRef.current) return;
    const first = events.find((e) => e.countryCode === activeCountry);
    if (first) globeRef.current.pointOfView({ lat: first.lat, lng: first.lng, altitude: 0.9 }, 1200);
  }, [activeCountry, events]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Globe
        ref={globeRef}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={GLOBE_THEMES[theme]}
        polygonsData={countries}
        polygonAltitude={(d: any) => (d.properties.ISO_A3 === activeCountry ? 0.04 : 0.006)}
        polygonCapColor={(d: any) =>
          d.properties.ISO_A3 === activeCountry ? "rgba(210,162,76,0.55)"
          : withEvents.has(d.properties.ISO_A3) ? "rgba(210,162,76,0.25)" : "rgba(0,0,0,0)"}
        polygonSideColor={() => "rgba(210,162,76,0.2)"}
        polygonStrokeColor={() => "rgba(227,235,238,0.25)"}
        polygonLabel={(d: any) => d.properties.NAME}
        onPolygonClick={(d: any, _ev: MouseEvent, c: { lat: number; lng: number }) =>
          onCountryClick(d.properties.ISO_A3, c.lat, c.lng)}
        pointsData={visibleEvents}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.06}
        pointRadius={0.45}
        pointColor={(e: any) => (e.category === "conflict" ? "#C4553B" : "#D2A24C")}
        pointLabel={(e: any) => `${e.title} (${e.year})`}
        onPointClick={(e: any) => onEventClick(e)}
      />
    </div>
  );
}
