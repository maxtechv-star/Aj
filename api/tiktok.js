heremodule.exports = async (req, res) => {
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
        // Add any headers required by the upstream API here
        'Accept': 'application/json'
      }
    });

    const text = await apiRes.text();
    // forward status and body
    res.status(apiRes.status);
    try {
      // If JSON, send JSON
      const json = JSON.parse(text);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(json));
    } catch (e) {
      // Fallback: send raw text
      res.setHeader('Content-Type', 'text/plain');
      res.send(text);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server proxy error', error: String(err) });
  }
};
