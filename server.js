const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// serve static files from project root
app.use(express.static(path.join(__dirname)));

// local proxy endpoint: /api/tiktok?url=...
app.get('/api/tiktok', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    res.status(400).json({ success: false, message: 'Missing url query parameter' });
    return;
  }
  try {
    const apiUrl = `https://veron-apis.zone.id/downloader/tiktok?url=${encodeURIComponent(url)}`;
    const r = await fetch(apiUrl, { headers: { Accept: 'application/json' } });
    const text = await r.text();
    res.status(r.status);
    try {
      const j = JSON.parse(text);
      res.json(j);
    } catch (e) {
      res.type('text').send(text);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Proxy error', error: String(err) });
  }
});

app.listen(port, () => {
  console.log(`AJ MEDIA DOWNLOADER running at http://localhost:${port}`);
});