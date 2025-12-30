# AJ MEDIA DOWNLOADER

Quick notes to get you running.

Two deployment options

1) Deploy to Vercel (recommended)
- Put all files in the project root and the `api/tiktok.js` file in `/api`.
- Import the GitHub repo into Vercel — Vercel will deploy the static site and the serverless function automatically.
- The site will call `/api/tiktok?url=...` (server-side) to avoid CORS.

2) Run locally with Node (optional)
- Requires Node >= 14 (but recommended Node 16+).
- Commands:
  - npm install
  - npm start
- Open http://localhost:3000 in your browser.

Important debugging tips (why CSS or fetch might fail)
- CSS not loading:
  - Check browser DevTools Network tab for 404 on styles.css. Ensure styles.css is in the same folder as index.html or adjust the href.
  - If you open index.html directly with file://, the fetch proxy and serverless functions won't work. Serve via a static server (Express, live-server, or deploy).
- Fetch not returning results:
  - If you don't have the serverless function (/api/tiktok), fetch will try the proxy and fail. The client now tries a direct upstream request as fallback but direct calls may be blocked by CORS.
  - Check console/network for errors and HTTP response codes. If you see CORS errors, deploy the proxy (api/tiktok.js) to Vercel or run the local server.js.
- Browser download behavior:
  - The `download` attribute may be ignored for cross-origin URLs. Right-click -> open in new tab if automatic saving doesn't happen.

Developer sidebar
- The sidebar shows AJ (front end) and Uthuman (back end) with avatars and links to their GitHub profiles.

If you want I can:
- Convert this into a Next.js + Tailwind project (recommended if you want route handling and better UX).
- Add server-side MP3 re-encoding so downloads are guaranteed MP3 files with consistent filenames.
- Create a ready-to-push GitHub repo (I can generate the git commands and a single ZIP).
- Deploy this for you to Vercel if you give repo access (or I can provide exact steps).

Tell me:
- Do you want me to prepare a GitHub repo structure and push files (I will give you exact git commands), or
- Do you want Next.js + Tailwind conversion now?