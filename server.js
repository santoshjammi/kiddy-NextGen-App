// server.js — Hostinger Node.js entry point
// Serves the Next.js static export from the `out/` directory.
// Hostinger runs: npm install && node server.js (or npm start)

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const OUT_DIR = path.join(__dirname, 'out');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.mp3':  'audio/mpeg',
  '.wav':  'audio/wav',
  '.ogg':  'audio/ogg',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.txt':  'text/plain',
  '.xml':  'application/xml',
};

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    // Cache static assets aggressively; HTML not cached
    const isAsset = filePath.includes('/_next/');
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': isAsset ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  // Strip query string
  let urlPath = req.url.split('?')[0];

  // Security: prevent directory traversal
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');

  let filePath = path.join(OUT_DIR, safePath);

  // Try exact path first, then .html extension, then /index.html
  const candidates = [
    filePath,
    filePath + '.html',
    path.join(filePath, 'index.html'),
  ];

  const tryNext = (i) => {
    if (i >= candidates.length) {
      // Final fallback: serve 404.html if it exists, otherwise root index
      const notFound = path.join(OUT_DIR, '404.html');
      fs.access(notFound, fs.constants.F_OK, (e) =>
        serveFile(res, e ? path.join(OUT_DIR, 'index.html') : notFound)
      );
      return;
    }
    fs.access(candidates[i], fs.constants.F_OK, (err) => {
      if (err) { tryNext(i + 1); return; }
      // Don't serve directories directly (would match OUT_DIR itself)
      fs.stat(candidates[i], (statErr, stat) => {
        if (statErr || stat.isDirectory()) { tryNext(i + 1); return; }
        serveFile(res, candidates[i]);
      });
    });
  };

  tryNext(0);
});

server.listen(PORT, () => {
  console.log(`Kiddy app running on port ${PORT}`);
});
