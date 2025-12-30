// Vercel serverless function (api/tiktok.js)
// Proxies requests to the Veron API to avoid browser CORS issues.
// If you deploy to Vercel, place this file under /api/tiktok.js

module.exports = async (req, res) => {
  try {
    const url = req.query.url || req.headers['x-url'];
    if (!url) {
      res.status(400).json({ success: false, message: 'Missing url query parameter' });
      return;
    }

    const apiUrl = `https://veron-apis.zone.id/downloader/tiktok?url=${encodeURIComponent(url)}`;

    const apiRes = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    const text = await apiRes.text();
    res.status(apiRes.status);
    try {
      const json = JSON.parse(text);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(json));
    } catch (e) {
      res.setHeader('Content-Type', 'text/plain');
      res.send(text);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server proxy error', error: String(err) });
  }
};
