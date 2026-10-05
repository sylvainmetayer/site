import { readFileSync } from 'node:fs';

const eleventyPackage = JSON.parse(
  readFileSync(new URL('../../node_modules/@11ty/eleventy/package.json', import.meta.url), 'utf8')
);

export default {
  now: Date.now(),
  // Cache version of the service worker: the deployed commit, so that the daily
  // rebuild (daily_build.yml) does not empty the visitors' caches
  buildVersion: (process.env.CF_PAGES_COMMIT_SHA || '').slice(0, 12) || String(Date.now()),
  // Unset means a local or CI build: no analytics beacon, robots.txt disallows all.
  environment: process.env.ELEVENTY_ENV || 'development',
  eleventyVersion: eleventyPackage.version
};
