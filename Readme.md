# AJ MEDIA DOWNLOADER

Simple static site to fetch TikTok metadata and provide MP4 and MP3 download links using the Veron API.

What it does
- Accepts a TikTok URL
- Calls a serverless proxy endpoint (/api/tiktok) which forwards the request to:
  `https://veron-apis.zone.id/downloader/tiktok?url=...`
- Displays cover, title, author, stats
- Shows "Download MP4" and "Download MP3" buttons (links to returned `videoUrl` and `musicUrl`)

Files
- `index.html` — site UI
- `styles.css` — styling
- `script.js` — fetch + UI logic
- `api/tiktok.js` — Vercel serverless proxy endpoint (recommended to avoid CORS issues)

Deploying to Vercel
1. Create a repository and push these files to it (root).
2. In Vercel dashboard, import the Git repository and deploy (Vercel will pick up the static site plus the `/api` serverless function).
   - OR use the Vercel CLI:
     - `npm i -g vercel`
     - `vercel` (follow prompts)
     - `vercel --prod` to deploy production
3. Visit the deployed URL. Paste a TikTok URL and click Fetch.

Notes & troubleshooting
- CORS: calling the Veron API directly from the browser may be blocked depending on that API's CORS policy. The included serverless function (`/api/tiktok`) proxies requests server-side on Vercel and avoids CORS issues.
- If the API changes, the UI expects the JSON structure you provided (result.videoUrl and result.musicUrl). Update `script.js` if the response keys differ.
- Browser download limitations: some browsers prevent cross-origin downloads with the `download` attribute. If clicking "Download" doesn't save automatically, right-click the button and "Open in new tab" or use "Save as..." on the opened media.
- No credentials required for this flow (your sample API didn't require keys). If a key becomes required later, you can store it as a Vercel Environment Variable and add it to `api/tiktok.js`.

Developer credits
- AJ — Front End — avatar: https://github.com/Itzpatron.png
- Uthuman — Back End — avatar: https://github.com/VerknDev.png

Enjoy — let me know if you want:
- A nicer UI (Next.js + Tailwind),
- Server-side audio conversion (to guarantee MP3 extension),
- Automatic filename generation improvements,
- Or GitHub-ready repo with package.json and deploy scripts.