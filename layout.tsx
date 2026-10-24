import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";

const display = Sora({ subsets: ["latin"], weight: ["300", "400", "600"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Chronoglobe: the world's history, place by place",
  description: "Explore historical events across the world on an interactive 3D globe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
