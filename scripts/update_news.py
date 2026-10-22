#!/usr/bin/env python3
"""Fetch recent GDELT articles into a public, deduplicated JSON feed.

This is a discovery feed, not a fact-checking or exhaustive event-detection system.
"""
from __future__ import annotations
import json
import os
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "live-news.json"
API = "https://api.gdeltproject.org/api/v2/doc/doc"
TOPICS = {
    "law": '("Supreme Court" OR "court ruling" OR legislation OR lawsuit OR "constitutional court" OR regulation OR parliament)',
    "markets": '("stock market" OR stocks OR "central bank" OR inflation OR economy OR "interest rate" OR earnings OR "bond market")',
    "conflict": '(conflict OR ceasefire OR "peace talks" OR diplomacy OR invasion OR sanctions OR "United Nations")',
    "politics": '(election OR parliament OR president OR "prime minister" OR referendum OR government)',
    "science": '(scientific discovery OR climate OR "space mission" OR technology OR "public health" OR energy OR research)',
}
TOP = '(war OR court OR election OR "stock market" OR "central bank" OR diplomacy OR climate OR "Supreme Court" OR parliament)'

def fetch(query: str, topic: str) -> list[dict]:
    params = urllib.parse.urlencode({
        "query": query, "mode": "ArtList", "format": "json",
        "maxrecords": "75", "sort": "DateDesc", "timespan": "7d",
    })
    req = urllib.request.Request(API + "?" + params, headers={
        "User-Agent": "ChronoGlobe-NewsIndexer/1.0 (educational project)",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=35) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except Exception as exc:
        print(f"Warning: topic {topic} fetch failed: {exc}", file=sys.stderr)
        return []
    result = []
    for item in payload.get("articles", []):
        url = item.get("url", "")
        title = (item.get("title") or "").strip()
        if not url.startswith(("https://", "http://")) or not title:
            continue
        result.append({
            "id": url,
            "title": title[:500],
            "url": url,
            "domain": item.get("domain") or item.get("sourcecountry") or "News source",
            "seendate": item.get("seendate") or "",
            "language": item.get("language") or "",
            "sourcecountry": item.get("sourcecountry") or "",
            "topic": topic,
            "fetched_at": datetime.now(timezone.utc).isoformat(),
        })
    return result

def main() -> int:
    all_items: dict[str, dict] = {}
    queries = [("top", TOP), *TOPICS.items()]
    for topic, query in queries:
        for item in fetch(query, topic):
            all_items.setdefault(item["url"], item)
        time.sleep(1.2)  # be polite to the public endpoint
    articles = sorted(all_items.values(), key=lambda a: a.get("seendate", ""), reverse=True)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "schema_version": 1,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "provider": "GDELT DOC API",
        "window": "rolling 7 days",
        "notice": "Discovery feed only; not exhaustive or independently fact-checked.",
        "article_count": len(articles),
        "articles": articles[:300],
    }
    tmp = OUT.with_suffix(".tmp")
    tmp.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(OUT)
    print(f"Wrote {min(len(articles), 300)} unique articles to {OUT.relative_to(ROOT)}")
    # A successful API call may still return no stories. That is valid, but all queries failing
    # should be visible as a warning rather than silently erasing the last good feed.
    if not articles:
        print("Warning: feed is empty; verify GDELT availability and query behavior.", file=sys.stderr)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
