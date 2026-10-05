// Checks a production build (dist/) for broken internal links and lost URLs.
// Replaces the Netlify build plugins netlify-plugin-checklinks and
// netlify-plugin-no-more-404, which Cloudflare Pages has no equivalent for.
//
//   node scripts/check-links.mjs [dist]
//
// - every internal href/src of every HTML page resolves (file, directory index
//   or _redirects rule);
// - every internal _redirects target resolves;
// - every URL listed in scripts/published-urls.txt still resolves. Add a line
//   there when a page goes live; remove one only with a redirect in place.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const dist = process.argv[2] || 'dist';
const ownOrigins = ['https://www.sylvain.dev', 'https://sylvain.dev'];

const htmlFiles = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith('.html')) htmlFiles.push(path);
  }
})(dist);

// _redirects: "from to status", "*" splat at the end of "from" only
const redirects = readFileSync(join(dist, '_redirects'), 'utf8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line && !line.startsWith('#'))
  .map(line => {
    const [from, to] = line.split(/\s+/);
    return { from, to };
  });

const toPath = url => {
  for (const origin of ownOrigins) {
    if (url.startsWith(origin)) return url.slice(origin.length) || '/';
  }
  return url.startsWith('/') && !url.startsWith('//') ? url : null;
};

const fileExists = path => {
  let decoded;
  try {
    decoded = decodeURIComponent(path);
  } catch {
    decoded = path;
  }
  const file = join(dist, decoded);
  if (decoded.endsWith('/')) return existsSync(join(file, 'index.html'));
  return (existsSync(file) && statSync(file).isFile())
    || existsSync(join(file, 'index.html'))
    || existsSync(`${file}.html`);
};

const resolves = (path, seen = new Set()) => {
  path = path.split('#')[0].split('?')[0] || '/';
  if (fileExists(path)) return true;
  if (seen.has(path)) return false;
  seen.add(path);
  const rule = redirects.find(({ from }) =>
    from.endsWith('*') ? path.startsWith(from.slice(0, -1)) : path === from
  );
  if (!rule) return false;
  const target = toPath(rule.to);
  return target === null || resolves(target, seen);
};

const errors = [];

const attribute = /\s(?:href|src)="([^"]+)"/g;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const [, raw] of html.matchAll(attribute)) {
    const url = raw.replaceAll('&amp;', '&');
    const path = toPath(url);
    if (path === null || path.startsWith('/admin/')) continue;
    if (!resolves(path)) errors.push(`${relative(dist, file)}: lien cassé ${url}`);
  }
}

for (const { from, to } of redirects) {
  const target = toPath(to);
  if (target !== null && !resolves(target)) errors.push(`_redirects: cible absente ${from} -> ${to}`);
}

const published = readFileSync(new URL('./published-urls.txt', import.meta.url), 'utf8')
  .split('\n')
  .map(line => line.trim())
  .filter(line => line && !line.startsWith('#'));
for (const url of published) {
  if (!resolves(url)) errors.push(`URL publiée perdue : ${url}`);
}

const unique = [...new Set(errors)];
if (unique.length) {
  console.error(unique.join('\n'));
  console.error(`\n${unique.length} problème(s) sur ${htmlFiles.length} pages.`);
  process.exit(1);
}
console.log(`OK : ${htmlFiles.length} pages, ${redirects.length} redirections, ${published.length} URLs publiées.`);
