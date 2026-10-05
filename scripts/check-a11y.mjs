// Checks the accessibility of every page of a production build (dist/) with
// pa11y-ci (axe and HTML_CodeSniffer, WCAG 2 AA, settings in .pa11yci.json).
//
//   node scripts/check-a11y.mjs [dist]
//
// Serves the build on a local port and hands pa11y-ci its sitemap, with the
// origin of its URLs (production, preview or localhost:8080, depending on
// ELEVENTY_ENV at build time) replaced by the local one. The browser is
// PUPPETEER_EXECUTABLE_PATH (CI: google-chrome): Puppeteer downloads none
// (.puppeteerrc.cjs).
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { serveDist } from './lib/serve-dist.mjs';

const dist = resolve(process.argv[2] || 'dist');
if (!process.env.PUPPETEER_EXECUTABLE_PATH) {
  throw new Error('PUPPETEER_EXECUTABLE_PATH absent : chemin de Chrome ou Chromium, ex. /usr/bin/chromium-browser');
}
// Run by absolute path with this Node.js, not looked up in PATH
const pa11yCi = createRequire(import.meta.url).resolve('pa11y-ci/bin/pa11y-ci.js');

const server = serveDist(dist);
server.listen(0, '127.0.0.1', () => {
  const local = `http://127.0.0.1:${server.address().port}`;
  const pa11y = spawn(process.execPath, [
    pa11yCi,
    '--sitemap', `${local}/sitemap.xml`,
    '--sitemap-find', '^https?://[^/]+',
    '--sitemap-replace', local,
  ], { stdio: 'inherit' });
  pa11y.on('exit', code => {
    server.close();
    process.exitCode = code ?? 1;
  });
});
