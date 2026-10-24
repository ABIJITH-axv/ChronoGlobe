"use client";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { EVENT_TYPES, type HistoricalEvent } from "@/lib/types";
import { fmtYear } from "@/lib/format";

// next/dynamic does not forward refs, so a thin wrapper passes it as `forwardedRef`.
const Globe = dynamic(
  async () => {
    const mod = await import("react-globe.gl");
    const G: any = mod.default;
    return function GlobeWithRef({ forwardedRef, ...props }: any) {
      return <G ref={forwardedRef} {...props} />;
    };
  },
  { ssr: false }
);

export const THEMES = {
  "Deep space": "//unpkg.com/three-globe/example/img/earth-dark.jpg",
  "Night lights": "//unpkg.com/three-globe/example/img/earth-night.jpg",
  "Blue marble": "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
} as const;
export type ThemeName = keyof typeof THEMES;

const COUNTRIES_URL =
  "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson";

// Natural Earth marks some countries (e.g. France) with ISO_A3 "-99"; fall back to ADM0_A3.
const isoOf = (f: any): string => {
  const p = f.properties || {};
  return p.ISO_A3 && p.ISO_A3 !== "-99" ? p.ISO_A3 : p.ADM0_A3;
};

const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

interface Props {
  events: HistoricalEvent[];      // pins to show
  allEvents: HistoricalEvent[];   // used to tint countries that have events
  theme: ThemeName;
  activeCountry: string | null;
  selected: HistoricalEvent | null;
  onCountryClick: (iso: string) => void;
  onEventClick: (e: HistoricalEvent) => void;
}

export default function GlobeView({ events, allEvents, theme, activeCountry, selected, onCountryClick, onEventClick }: Props) {
  const ref = useRef<any>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [countries, setCountries] = useState<any[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch(COUNTRIES_URL).then((r) => r.json()).then((d) => setCountries(d.features)).catch(() => {});
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const withEvents = useMemo(() => new Set(allEvents.map((e) => e.countryCode)), [allEvents]);

  // Slow, calm rotation that pauses once someone starts exploring.
  useEffect(() => {
    if (!ready) return;
    const c = ref.current?.controls?.();
    if (c) { c.autoRotate = !activeCountry && !selected; c.autoRotateSpeed = 0.3; }
  }, [ready, activeCountry, selected]);

  useEffect(() => {
    if (!ready || !activeCountry) return;
    const list = allEvents.filter((e) => e.countryCode === activeCountry);
    if (!list.length) return;
    const lat = list.reduce((s, e) => s + e.lat, 0) / list.length;
    const lng = list.reduce((s, e) => s + e.lng, 0) / list.length;
    ref.current?.pointOfView({ lat, lng, altitude: 1.3 }, 1400);
  }, [ready, activeCountry, allEvents]);

  useEffect(() => {
    if (!ready || !selected) return;
    ref.current?.pointOfView({ lat: selected.lat, lng: selected.lng, altitude: 1.2 }, 1400);
  }, [ready, selected]);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Globe
        forwardedRef={ref}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={THEMES[theme]}
        showAtmosphere
        atmosphereColor="#6aa6ff"
        atmosphereAltitude={0.2}
        onGlobeReady={() => setReady(true)}
        /* futuristic dotted landmasses */
        hexPolygonsData={countries}
        hexPolygonResolution={3}
        hexPolygonMargin={0.62}
        hexPolygonColor={() => "rgba(150,200,255,0.30)"}
        /* clickable countries */
        polygonsData={countries}
        polygonAltitude={(d: any) => (isoOf(d) === activeCountry ? 0.02 : 0.004)}
        polygonCapColor={(d: any) =>
          isoOf(d) === activeCountry ? "rgba(79,214,232,0.22)"
          : withEvents.has(isoOf(d)) ? "rgba(122,162,255,0.10)" : "rgba(0,0,0,0)"}
        polygonSideColor={() => "rgba(0,0,0,0)"}
        polygonStrokeColor={() => "rgba(160,200,255,0.16)"}
        polygonsTransitionDuration={300}
        polygonLabel={(d: any) => d.properties?.NAME || ""}
        onPolygonClick={(d: any) => onCountryClick(isoOf(d))}
        /* event pins, coloured by type */
        pointsData={events}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={0.018}
        pointRadius={0.32}
        pointResolution={12}
        pointColor={(e: any) => EVENT_TYPES[e.type as keyof typeof EVENT_TYPES].color}
        pointLabel={(e: any) =>
          `<div style="padding:6px 10px;border-radius:10px;background:rgba(8,14,26,.88);color:#E3EBEE;font:12px sans-serif">${e.title} · ${fmtYear(e.year)}</div>`}
        onPointClick={(e: any) => onEventClick(e)}
        /* soft pulse on the selected event */
        ringsData={selected ? [selected] : []}
        ringLat="lat"
        ringLng="lng"
        ringColor={(e: any) => {
          const c = EVENT_TYPES[e.type as keyof typeof EVENT_TYPES].color;
          return (t: number) => rgba(c, 1 - t);
        }}
        ringMaxRadius={4}
        ringPropagationSpeed={1.4}
        ringRepeatPeriod={1800}
      />
    </div>
  );
}
