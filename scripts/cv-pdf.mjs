// Prints the one-page CV of a build (dist/) with headless Chromium: /cv/pdf/ to
// src/uploads/CV.pdf, or with --lang en /en/cv/pdf/ to src/uploads/CV-en.pdf
// (layout src/_includes/layouts/cv-pdf.njk).
//
//   node scripts/cv-pdf.mjs [dist] [--lang fr|en] [--out <file>]
//
// --out writes elsewhere than src/uploads/CV(-en).pdf: CI generates a copy to compare with
// the committed PDF (scripts/check-cv-ats.mjs --compare).
// The browser is CHROME_BIN, or the first of chromium-browser, chromium, google-chrome found in
// the usual system directories (not PATH, which could point to anything).
// The CV must fit on one A4 page: when the content overflows, the PDF is refused and
// src/uploads/CV.pdf is left untouched.
import { spawn } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';
import { serveDist } from './lib/serve-dist.mjs';

const args = process.argv.slice(2);
const langIndex = args.indexOf('--lang');
const lang = langIndex === -1 ? 'fr' : args[langIndex + 1];
if (!['fr', 'en'].includes(lang)) throw new Error(`--lang ${lang} : fr ou en`);
if (langIndex !== -1) args.splice(langIndex, 2);
const prefix = lang === 'en' ? '/en' : '';
const outIndex = args.indexOf('--out');
const output = resolve(outIndex === -1 ? `src/uploads/CV${lang === 'en' ? '-en' : ''}.pdf` : args[outIndex + 1]);
if (outIndex !== -1) args.splice(outIndex, 2);
const dist = resolve(args[0] || 'dist');
const site = JSON.parse(readFileSync('src/_data/site.json', 'utf8')).url;

const BROWSER_DIRS = ['/usr/bin', '/usr/local/bin', '/snap/bin', '/opt/homebrew/bin'];

const findBrowser = () => {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  for (const name of ['chromium-browser', 'chromium', 'google-chrome']) {
    const browser = BROWSER_DIRS.map(dir => join(dir, name)).find(path => existsSync(path));
    if (browser) return browser;
  }
  throw new Error('Chromium introuvable : définir CHROME_BIN');
};

if (!existsSync(join(dist, `${prefix.slice(1)}/cv/pdf/index.html`))) {
  throw new Error(`${dist}${prefix}/cv/pdf/index.html absent : lancer le build avant`);
}

// Number of pages of a PDF written by Chromium (page objects are not compressed)
const countPages = file => (readFileSync(file, 'latin1').match(/\/Type\s*\/Page(?!s)\b/g) || []).length;

// Links in the PDF must point to the live site, not to this local server
const server = serveDist(dist, {
  transform: (file, content) => (extname(file) === '.html'
    ? content.toString('utf8').replace(/(<a\b[^>]*\shref=")\//g, `$1${site}/`)
    : content),
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
    `http://127.0.0.1:${port}${prefix}/cv/pdf/`,
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
        console.error(`Le CV fait ${pages} pages au lieu d'une : raccourcir src/_includes/layouts/cv-pdf.njk ou ses données. ${output} n'est pas modifié.`);
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
