// Audits the production site with Lighthouse and writes shields.io endpoint
// files (https://shields.io/badges/endpoint-badge) for the README badges.
//
//   node scripts/lighthouse-badges.mjs    # writes badges/*.json
//
// - one badge per Lighthouse category (performance, accessibility, best
//   practices, SEO): the lowest score of the audited pages, mobile profile;
// - carbon: grams of CO2 per visit of the home page and its rating, with the
//   Sustainable Web Design model v4 of the Green Web Foundation (@tgwf/co2),
//   from the bytes Lighthouse measured and the green hosting status of the host.
//
// Run by .github/workflows/badges.yml, which pushes the files to the `badges`
// branch. The browser is CHROME_PATH, or the one chrome-launcher finds.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { co2, hosting } from '@tgwf/co2';

const out = 'badges';
const site = JSON.parse(readFileSync('src/_data/site.json', 'utf8')).url;
const pages = ['/', '/articles/', '/cv/', '/projets/'];

const CATEGORIES = {
  performance: 'performance',
  accessibility: 'accessibilité',
  'best-practices': 'bonnes pratiques',
  seo: 'SEO',
};

// Same thresholds and colours as Lighthouse reports
const scoreColor = score => {
  if (score >= 90) return 'brightgreen';
  if (score >= 50) return 'orange';
  return 'red';
};

const RATING_COLORS = { 'A+': 'brightgreen', A: 'green', B: 'yellowgreen', C: 'yellow', D: 'orange', E: 'red', F: 'red' };

const badge = (name, label, message, color) => {
  writeFileSync(join(out, `${name}.json`), `${JSON.stringify({ schemaVersion: 1, label, message, color })}\n`);
  console.log(`${label} : ${message}`);
};

mkdirSync(out, { recursive: true });

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
const results = [];
try {
  // One page at a time: Lighthouse measures performance on an idle browser
  for (const page of pages) {
    // Awaited inside the loop on purpose: the audits must not overlap
    const { lhr } = await lighthouse(`${site}${page}`, { // NOSONAR
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: Object.keys(CATEGORIES),
    });
    if (lhr.runtimeError) throw new Error(`${page} : ${lhr.runtimeError.message}`);
    results.push({ page, lhr });
  }
} finally {
  await chrome.kill();
}

for (const [id, label] of Object.entries(CATEGORIES)) {
  const scores = results.map(({ page, lhr }) => {
    // null when the audits of the category failed (no LCP…): fail rather than
    // publish a misleading 0, the badges keep their previous values
    if (lhr.categories[id].score === null) throw new Error(`${page} : pas de score ${label}`);
    return Math.round(lhr.categories[id].score * 100);
  });
  const score = Math.min(...scores);
  badge(`lighthouse-${id}`, label, String(score), scoreColor(score));
}

const bytes = results.find(({ page }) => page === '/').lhr.audits['total-byte-weight'].numericValue;
let green = false;
try {
  green = await hosting(new URL(site).hostname, 'sylvain.dev');
} catch (error) {
  // The Green Web Foundation API being down must not fail the badges
  console.warn(`[co2] hébergement vert inconnu : ${error.message}`);
}
const { total, rating } = new co2({ model: 'swd', version: 4, rating: true }).perVisit(bytes, green);
badge('carbon', 'CO₂ par visite', `${total.toFixed(2)} g (${rating})`, RATING_COLORS[rating] || 'lightgrey');
