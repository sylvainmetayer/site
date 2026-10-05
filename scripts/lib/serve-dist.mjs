// Serves a build directory (dist/) on a local port, for the scripts that open
// it in a browser (cv-pdf, check-a11y). The files are indexed at start: a
// request only selects an entry of that index and never builds a file path, so
// nothing outside the build can be read.
import { createServer } from 'node:http';
import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative, sep } from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.xml': 'application/xml',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.vtt': 'text/vtt',
};

// URL path → file: "/cv/pdf/index.html", and "/cv/pdf/" and "/cv/pdf" for an index
function indexFiles(dist) {
  const files = new Map();
  (function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(path);
        continue;
      }
      const url = `/${relative(dist, path).split(sep).join('/')}`;
      files.set(url, path);
      if (entry.name === 'index.html') {
        const folder = url.slice(0, -'index.html'.length);
        files.set(folder, path);
        if (folder !== '/') files.set(folder.slice(0, -1), path);
      }
    }
  })(dist);
  return files;
}

// `transform(file, content)` can rewrite a file before it is sent
export function serveDist(dist, { transform } = {}) {
  const files = indexFiles(dist);
  return createServer((req, res) => {
    let file;
    try {
      file = files.get(decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (!file) {
      res.writeHead(404).end();
      return;
    }
    const content = readFileSync(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(transform ? transform(file, content) : content);
  });
}
