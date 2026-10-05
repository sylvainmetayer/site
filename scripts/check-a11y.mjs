// Checks the accessibility of every page of a production build (dist/) with
// pa11y-ci (axe and HTML_CodeSniffer, WCAG 2 AA, settings in .pa11yci.json).
//
//   node scripts/check-a11y.mjs [dist]
//
// Serves the build on a local port and hands pa11y-ci its sitemap, with the
// production origin replaced by the local one. The browser is
// PUPPETEER_EXECUTABLE_PATH (CI: google-chrome), or the one Puppeteer downloaded.
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, sep } from 'node:path';
import { serveDist } from './lib/serve-dist.mjs';

const dist = resolve(process.argv[2] || 'dist');
if (!dist.startsWith(process.cwd() + sep)) {
  throw new Error(`${dist} : le dossier du build doit être dans le dépôt`);
}
const site = JSON.parse(readFileSync('src/_data/site.json', 'utf8')).url;
// Run by absolute path with this Node.js, not looked up in PATH
const pa11yCi = createRequire(import.meta.url).resolve('pa11y-ci/bin/pa11y-ci.js');

const server = serveDist(dist);
server.listen(0, '127.0.0.1', () => {
  const local = `http://127.0.0.1:${server.address().port}`;
  const pa11y = spawn(process.execPath, [
    pa11yCi,
    '--sitemap', `${local}/sitemap.xml`,
    '--sitemap-find', site,
    '--sitemap-replace', local,
  ], { stdio: 'inherit' });
  pa11y.on('exit', code => {
    server.close();
    process.exitCode = code ?? 1;
  });
});
