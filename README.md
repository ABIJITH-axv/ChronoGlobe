# ChronoGlobe

ChronoGlobe is an educational history timeline and current-affairs explorer for law, markets, conflict, politics, science, climate and world history.

## Run locally
Open `index.html` in a modern browser, or run `python -m http.server 8000` and visit `http://localhost:8000`.

## Deploy
A GitHub Pages workflow is included at `.github/workflows/deploy-pages.yml`. In repository Settings → Pages, set the source to **GitHub Actions**. Then inspect the Actions tab for a successful deployment and use the published URL. Netlify is also supported as a static host with no build command and the repository root as the publish directory.

## Features
- Responsive dark timeline interface, search and category filters
- Timeline slider, clickable markers and local bookmarks
- Current news panel connected to the Supabase `news_articles` table
- Topic filters for major headlines, law, markets, conflict, politics and science
- Supabase event archive, article store and ingestion logs
- Eight starter historical events with source links
- Supabase Edge Function for GDELT news collection, with a six-hour scheduled job

## Current limitations
The scheduled collector ran but GDELT returned HTTP 429 (rate limiting). At the last check, the news table was empty. The collector must recover from rate limits and complete a successful run before the live news feature can be considered operational. The historical timeline currently contains only eight starter events and is not comprehensive.

News headlines are discovery leads, not verified facts. Check original sources and compare reporting. For legal research, prioritize official judgments and legislation; for markets, use exchange, regulator and company filings. The feed is not real-time stock pricing, legal advice, or investment advice.

Never expose the Supabase service-role key in client-side code. The browser should use only the publishable key for read-only access; writes must remain server-side. Before selling, add monitoring, retries, data-source review, privacy and terms pages, security testing, support and payment/access controls.
