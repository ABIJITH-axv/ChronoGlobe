import { NextResponse } from "next/server";
import { events } from "@/data/events";

// Swap this for a Supabase query when the database is ready.
export async function GET(req: Request) {
  const country = new URL(req.url).searchParams.get("country");
  return NextResponse.json(country ? events.filter((e) => e.countryCode === country) : events);
}
