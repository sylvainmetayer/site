// Prints the one-page CV (/cv/pdf/, src/cv-pdf.njk) of a build (dist/) to src/uploads/CV.pdf
// with headless Chromium.
//
//   node scripts/cv-pdf.mjs [dist] [--out <file>]
//
// --out writes elsewhere than src/uploads/CV.pdf: CI generates a copy to compare with the
// committed PDF (scripts/check-cv-ats.mjs --compare).
// The browser is CHROME_BIN, or the first of chromium-browser, chromium, google-chrome found in PATH.
// The CV must fit on one A4 page: when the content overflows, the PDF is refused and
// src/uploads/CV.pdf is left untouched.
import { createServer } from 'node:http';
import { execFileSync, spawn } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, isAbsolute, join, relative, resolve } from 'node:path';

const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
const output = resolve(outIndex === -1 ? 'src/uploads/CV.pdf' : args[outIndex + 1]);
if (outIndex !== -1) args.splice(outIndex, 2);
const dist = resolve(args[0] || 'dist');
const site = JSON.parse(readFileSync('src/_data/site.json', 'utf8')).url;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const findBrowser = () => {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  for (const name of ['chromium-browser', 'chromium', 'google-chrome']) {
    try {
      return execFileSync('which', [name], { encoding: 'utf8' }).trim();
    } catch {
      // not installed, try the next one
    }
  }
  throw new Error('Chromium introuvable : définir CHROME_BIN');
};

if (!existsSync(join(dist, 'cv/pdf/index.html'))) {
  throw new Error(`${dist}/cv/pdf/index.html absent : lancer le build avant`);
}

// Number of pages of a PDF written by Chromium (page objects are not compressed)
const countPages = file => (readFileSync(file, 'latin1').match(/\/Type\s*\/Page(?!s)\b/g) || []).length;

const server = createServer((req, res) => {
  let path;
  try {
    path = join(dist, decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
  } catch {
    res.writeHead(400).end();
    return;
  }
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  const inside = relative(dist, path);
  if (inside.startsWith('..') || isAbsolute(inside) || !existsSync(path)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
  if (extname(path) === '.html') {
    // Links in the PDF must point to the live site, not to this local server
    res.end(readFileSync(path, 'utf8').replace(/(<a\b[^>]*\shref=")\//g, `$1${site}/`));
  } else {
    res.end(readFileSync(path));
  }
});

// The browser runs asynchronously so this process keeps serving its requests,
// with a throwaway profile so it never attaches to an already open Chromium.
server.listen(0, '127.0.0.1', () => {
  const { port } = server.address();
  const profile = mkdtempSync(join(tmpdir(), 'cv-pdf-'));
  const draft = join(profile, 'CV.pdf');
  const browser = spawn(findBrowser(), [
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    // CI runners (Ubuntu 24.04) forbid the user namespaces of the Chromium sandbox
    ...(process.env.CI ? ['--no-sandbox'] : []),
    `--user-data-dir=${profile}`,
    `--print-to-pdf=${draft}`,
    `http://127.0.0.1:${port}/cv/pdf/`,
  ], { stdio: ['ignore', 'inherit', 'ignore'] });
  browser.on('exit', code => {
    server.close();
    try {
      if (code !== 0 || !existsSync(draft)) {
        console.error(`Chromium a échoué (code ${code})`);
        process.exitCode = 1;
        return;
      }
      const pages = countPages(draft);
      if (pages !== 1) {
        console.error(`Le CV fait ${pages} pages au lieu d'une : raccourcir src/cv-pdf.njk ou ses données. ${output} n'est pas modifié.`);
        process.exitCode = 1;
        return;
      }
      copyFileSync(draft, output);
      console.log(`CV écrit dans ${output}`);
    } finally {
      rmSync(profile, { recursive: true, force: true });
    }
  });
});
