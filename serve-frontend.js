const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 5173;
const API_PORT = 3000;
const BUILD_DIR = path.resolve(__dirname, 'frontend', 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.map': 'application/json',
};

function proxyToBackend(req, res) {
  const options = {
    hostname: '127.0.0.1',
    port: API_PORT,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `localhost:${API_PORT}`,
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('[Proxy] Backend error:', err.message);
    res.writeHead(502, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Backend unavailable', message: err.message }));
  });

  req.pipe(proxyReq);
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  // CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Proxy API requests to backend
  if (req.url.startsWith('/api/')) {
    console.log(`[Proxy] ${req.method} ${req.url} -> backend:${API_PORT}`);
    proxyToBackend(req, res);
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Clean path
  pathname = pathname.replace(/\.{2,}/g, '');
  if (pathname.startsWith('/')) pathname = pathname.slice(1);

  let filePath = path.join(BUILD_DIR, pathname);

  // If path is a directory or has no extension, try index.html (SPA fallback)
  if (!path.extname(filePath) || (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory())) {
    const indexPath = path.join(filePath, 'index.html');
    if (fs.existsSync(indexPath)) {
      filePath = indexPath;
    } else if (!path.extname(filePath)) {
      filePath = path.join(BUILD_DIR, 'index.html');
    }
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    serveFile(res, filePath);
  } else {
    // SPA fallback
    const indexPath = path.join(BUILD_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      serveFile(res, indexPath);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[ODIN-Frontend] Server running on http://0.0.0.0:${PORT}`);
  console.log(`[ODIN-Frontend] Serving: ${BUILD_DIR}`);
  console.log(`[ODIN-Frontend] Proxying /api/* to backend:${API_PORT}`);
});

server.on('error', (err) => {
  console.error('[ODIN-Frontend] Server error:', err);
  process.exit(1);
});
