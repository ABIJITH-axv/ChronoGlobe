import { NextResponse } from "next/server";
import { events } from "@/data/events";

// Optional AI mode: active only when ANTHROPIC_API_KEY is set on the server.
// Without it, the client falls back to the built-in guide in lib/guide.ts.
const hits = new Map<string, number[]>();

const SYSTEM = `You are Chrono, the calm, friendly guide inside Chronoglobe, an interactive 3D globe of world history for students and teachers.
Answer in under 120 words, in clear plain language. Be accurate; if unsure, say so and suggest checking a reliable source. Do not invent quotes, statistics or sources.
App help: drag/zoom the globe; click pins or tinted countries; colour chips filter event types; the slider limits events by year; search is top left; each event has a summary, impact and a stick-figure animation slot (coming soon); sign up as Student, Teacher or Researcher.
Events currently on the globe: ${events.map((e) => `${e.title} (${e.year}, ${e.country})`).join("; ")}.
When relevant, mention events from this list by their exact title.`;

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  if (recent.length >= 20) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  hits.set(ip, [...recent, now]);

  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  const msgs = (Array.isArray(body?.messages) ? body.messages : []).slice(-8)
    .map((m: any) => ({ role: m?.role === "assistant" ? "assistant" : "user", content: String(m?.text ?? "").slice(0, 1000) }))
    .filter((m: any) => m.content);
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== "user") return NextResponse.json({ error: "bad_request" }, { status: 400 });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-haiku-5-5", max_tokens: 400, system: SYSTEM, messages: msgs }),
    });
    if (!r.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });
    const data = await r.json();
    const text = (data.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n").trim();
    return text ? NextResponse.json({ text }) : NextResponse.json({ error: "empty" }, { status: 502 });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
