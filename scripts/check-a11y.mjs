// Checks the accessibility of every page of a production build (dist/) with
// pa11y-ci (axe and HTML_CodeSniffer, WCAG 2 AA, settings in .pa11yci.json).
//
//   node scripts/check-a11y.mjs [dist]
//
// Serves the build on a local port and hands pa11y-ci its sitemap, with the
// production origin replaced by the local one. The browser is
// PUPPETEER_EXECUTABLE_PATH (CI: google-chrome), or the one Puppeteer downloaded.
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';

const dist = resolve(process.argv[2] || 'dist');
if (!dist.startsWith(process.cwd() + sep)) {
  throw new Error(`${dist} : le dossier du build doit être dans le dépôt`);
}
const site = JSON.parse(readFileSync('src/_data/site.json', 'utf8')).url;

const types = {
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

const server = createServer((req, res) => {
  let path;
  try {
    path = resolve(dist, `.${decodeURIComponent(new URL(req.url, 'http://localhost').pathname)}`);
  } catch {
    res.writeHead(400).end();
    return;
  }
  // Only files of the build, checked before touching the file system
  if (path !== dist && !path.startsWith(dist + sep)) {
    res.writeHead(404).end();
    return;
  }
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  if (!existsSync(path)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
  res.end(readFileSync(path));
});

server.listen(0, '127.0.0.1', () => {
  const local = `http://127.0.0.1:${server.address().port}`;
  const pa11y = spawn('npx', [
    'pa11y-ci',
    '--sitemap', `${local}/sitemap.xml`,
    '--sitemap-find', site,
    '--sitemap-replace', local,
  ], { stdio: 'inherit' });
  pa11y.on('exit', code => {
    server.close();
    process.exitCode = code ?? 1;
  });
});
