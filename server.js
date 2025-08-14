const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send('Missing url parameter.');

  try {
    // Fetch target URL, send its contents to client
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Proxy)' }
    });
    // For HTML, rewrite URLs if desired (not included in this simple version)
    res.set('Content-Type', response.headers.get('content-type') || 'text/html');
    const body = await response.text();
    res.send(body);
  } catch (err) {
    res.status(500).send('Error fetching URL: ' + err.message);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
