import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json'
};

// Simple In-Memory / File-backed Store for REST API
const DATA_FILE = path.join(__dirname, 'src/data/backend_store.json');

function loadStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Could not read backend store, creating new.');
  }
  return null;
}

function saveStore(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving backend store:', err);
  }
}

// Parse JSON request body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // Global CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = urlObj.pathname;

  // --- REST API ENDPOINTS ---
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // Health check
    if (pathname === '/api/health' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'online',
        service: 'LastBite Surplus Exchange Engine',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }));
      return;
    }

    // Sync listings
    if (pathname === '/api/listings' && req.method === 'GET') {
      const store = loadStore();
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, data: store }));
      return;
    }

    // Save batch of listings
    if (pathname === '/api/listings' && req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        if (Array.isArray(body)) {
          saveStore(body);
        } else if (body.listings) {
          saveStore(body.listings);
        }
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, count: Array.isArray(body) ? body.length : (body.listings || []).length }));
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
      }
      return;
    }

    // Reset store
    if (pathname === '/api/reset' && req.method === 'POST') {
      if (fs.existsSync(DATA_FILE)) {
        try { fs.unlinkSync(DATA_FILE); } catch (e) {}
      }
      res.writeHead(200);
      res.end(JSON.stringify({ success: true, message: 'Backend store reset to baseline' }));
      return;
    }

    // 404 for unknown api
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
    return;
  }

  // --- STATIC FILE SERVING ---
  let reqPath = pathname;
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(__dirname, reqPath);

  // Security check: ensure path does not escape root
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Add cache header for performance
    res.setHeader('Cache-Control', 'no-cache');
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`LastBite Full-Stack Server running at http://localhost:${PORT}`);
  console.log(`Serving static assets from ${__dirname}`);
  console.log(`REST API endpoints active at http://localhost:${PORT}/api/`);
});
