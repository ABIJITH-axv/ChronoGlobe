import type { Metadata, Viewport } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
import "./globals.css";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Public_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "ChronoGlobe — History, place by place", template: "%s | ChronoGlobe" },
  description: "Travel through centuries on an interactive historical globe. Discover events, explore timelines, and follow the sources behind every story.",
  applicationName: "ChronoGlobe",
  keywords: ["history", "interactive globe", "historical timeline", "education", "atlas"],
  manifest: "/manifest.json",
  openGraph: { title: "ChronoGlobe", description: "The world is your timeline.", type: "website" },
};
export const viewport: Viewport = { themeColor: "#0B1A26", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${display.variable} ${body.variable}`}><body className="antialiased">{children}</body></html>;
}
