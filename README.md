# ChronoGlobe

ChronoGlobe is an interactive history explorer prototype with a recent-news discovery panel for study across law, markets and economics, conflicts and diplomacy, politics, science, and climate.

## Run locally
This is a static site with no build step:
1. Clone or download this repository.
2. Open `index.html` in a modern browser, or run a local static server (for example, `python -m http.server 8000`).
3. Visit `http://localhost:8000`.

## Deploy
### Netlify
1. Sign in at https://app.netlify.com/
2. Import this GitHub repository.
3. Set the publish directory to `.` (repository root) and leave the build command blank.
4. Deploy and test the generated URL.

### GitHub Pages
In repository Settings → Pages, select the `main` branch and `/(root)` as the source.

## Current MVP features
- Responsive dark astronomy-inspired interface
- Search and category filters for the curated historical starter events
- Timeline slider and clickable globe-style markers
- Save/unsave events using browser local storage
- Recent-news discovery panel using the public GDELT DOC API
- Topic filters for major headlines, law and courts, markets and economy, conflict and diplomacy, politics and elections, and science and climate
- Manual refresh and a browser-side refresh attempt every 15 minutes while the page is open

## Freshness and accuracy limitations
- The live panel searches a rolling recent-news window (currently seven days). It is not a complete feed of every major world event, not a real-time stock-price service, and not a verified chronology.
- Automatic refresh runs only while a visitor has the website open. This prototype does not yet run a server-side scheduled job or build a persistent event database.
- News availability depends on the external GDELT service, internet connectivity, browser restrictions, and the source coverage. The panel can fail or return duplicates/incomplete coverage.
- News headlines are leads for study, not definitive fact-checks. Open original reporting and compare independent sources; for law, check official court judgments and legislation; for markets, use exchange/regulator/company filings and a licensed market-data source when needed.
- The historical archive still contains only a small starter selection. It must be expanded with researched, dated entries and reliable references before it can credibly claim broad coverage of major events across history.

## Recommended next steps before a commercial launch
1. Create a structured historical-events database with event date, location, category, summary, consequences, source URLs, and a confidence/status label.
2. Add a backend ingestion service and scheduled jobs to fetch, deduplicate, classify, and retain current events independently of visitors' browsers.
3. Use source-specific adapters and official sources for laws/court rulings, financial disclosures and exchange data, conflict reporting, elections, and science. Display publication time, event time, source attribution, and correction/update history.
4. Add authentication and cloud-saved bookmarks only if required, with server-side authorization and privacy controls.
5. Add a proper data-provider review, terms and privacy pages, monitoring, error handling, and a security review before accepting payments.

Never put secret API keys in client-side HTML. Market content is for education and is not investment advice. Legal content is for general study and is not legal advice. ChronoGlobe is an independent project and is not affiliated with any government, court, exchange, or news organization.
