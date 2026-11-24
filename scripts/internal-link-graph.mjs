#!/usr/bin/env node
// Internal link graph of a build (dist/): for each page, the pages that link to it
// from their body copy. Nav, header, footer, breadcrumb, share and prev/next links
// appear on every page and carry no topical context, so they are not counted.
//
//   npx eleventy && node scripts/internal-link-graph.mjs [dist] > /tmp/graph.json (see seo/internal-links-report.md)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { JSDOM } from 'jsdom';

const dist = process.argv[2] || 'dist';
const ORIGINS = /^https?:\/\/(www\.)?sylvain\.dev/;
const CHROME = 'nav, header, footer, .breadcrumb, .share, .post-nav';
// Pages Sylvain wants to push: projects, CV, talks (the rest is checked for orphans)
const TARGET = /^\/(en\/)?(projets|projects|cv|talks)(\/(?!pdf)|#|$)/;

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name === 'index.html') files.push(path);
  }
})(dist);

const routeOf = file => '/' + relative(dist, file).split(sep).slice(0, -1).map(s => s + '/').join('');
// Page-level key: no query, fragment kept only for /projets#slug (one project = one anchor)
const keyOf = href => {
  const url = new URL(href.replace(ORIGINS, ''), 'https://x');
  const path = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
  return /^\/(en\/projects|projets)\/$/.test(path) && url.hash ? path + url.hash : path;
};

const pages = new Set(files.map(routeOf));
const inbound = new Map();
for (const file of files) {
  const route = routeOf(file);
  const main = new JSDOM(readFileSync(file, 'utf8')).window.document.querySelector('main');
  if (!main) continue;
  for (const a of main.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href');
    if (a.closest(CHROME) || !(href.startsWith('/') || ORIGINS.test(href)) || href.startsWith('//')) continue;
    const key = keyOf(href);
    if (key.split('#')[0] === route) continue;
    if (!inbound.has(key)) inbound.set(key, new Map());
    inbound.get(key).set(route, a.textContent.trim().replace(/\s+/g, ' '));
  }
}
// Project anchors are targets even when nothing links to them yet
for (const p of readdirSync('src/projets').filter(f => /^[^.]+\.md$/.test(f))) for (const base of ['/projets/#', '/en/projects/#']) pages.add(base + p.slice(0, -3));

const rows = [...pages].filter(r => !/\.\w+\/$/.test(r)).map(route => ({
  route,
  contextualInbound: inbound.get(route)?.size ?? 0,
  linkedFrom: Object.fromEntries(inbound.get(route) ?? []),
  target: TARGET.test(route),
})).sort((a, b) => a.contextualInbound - b.contextualInbound || a.route.localeCompare(b.route));

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  orphanTargets: rows.filter(r => r.target && r.contextualInbound < 3).map(r => r.route),
  orphanArticles: rows.filter(r => /^\/(en\/)?article\//.test(r.route) && r.contextualInbound < 3).map(r => r.route),
  pages: rows,
}, null, 2));
