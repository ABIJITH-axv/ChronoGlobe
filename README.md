# ChronoGlobe

ChronoGlobe is an interactive history explorer prototype. Browse historical events by topic, search locations and stories, move through a timeline, and save events locally in your browser.

## Run locally
This first version is a static site with no build step:
1. Download or clone this repository.
2. Open `index.html` in a modern browser, or run a local static server (for example, `python -m http.server 8000`).
3. Visit `http://localhost:8000`.

## Deploy
### Netlify
1. Sign in at https://app.netlify.com/
2. Add a new site by importing this GitHub repository.
3. Use the repository root as the publish directory. No build command is needed.
4. Deploy and test the generated URL.

### GitHub Pages
In repository Settings → Pages, select the `main` branch and `/(root)` as the source. Save and wait for deployment.

## Current MVP features
- Responsive dark astronomy-inspired interface
- Search and category filters for curated historical events
- Timeline slider
- Selectable globe markers and event detail panel
- Save/unsave events using browser local storage

## Important limitations before selling
This is a frontend prototype. Saved events exist only in the current browser; there is no account system, database, payment processing, or paid access control. Do not accept payments for features that are not implemented. Before commercial launch, add a backend/database, authentication, server-side authorization, privacy/terms pages, error monitoring, accessibility checks, and verified historical references. Keep all secret API keys in hosting environment variables, never in client-side HTML.

Historical descriptions are a starter dataset and should be reviewed and sourced before public commercial use. ChronoGlobe is an independent project; it is not affiliated with any government or museum.
