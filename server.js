// server.js — Next.js custom server.
// Hostinger Node.js hosting runs `node server.js` as the entry point.
// This delegates all request handling to Next.js so every route works.

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Kiddy app ready on http://${hostname}:${port}`);
  });
});

