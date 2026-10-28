// After a deploy, for the articles published in the last days (live feeds):
// - sends a webmention to every external page an article links to;
// - posts the French articles to Mastodon and Bluesky (POSSE), once each, and
//   records each post in src/_data/syndication.json (committed by the workflow),
//   where the comments under the articles come from (src/_data/socialReplies.js).
// Run every morning by .github/workflows/syndicate.yml, after the daily deploy.
//
//   node scripts/syndicate.mjs [--days 2] [--dry-run]
//
// Mastodon: MASTODON_INSTANCE (https://instance) and MASTODON_TOKEN (scope
// write:statuses read:accounts). Bluesky: BLUESKY_HANDLE and
// BLUESKY_APP_PASSWORD (an app password). Without them, that network is skipped.
import { readFileSync, writeFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

// SITE_URL: another deployment (a Cloudflare Pages preview) for a dry run
const SITE = process.env.SITE_URL || 'https://www.sylvain.dev';
const FEEDS = [`${SITE}/feed.xml`, `${SITE}/en/feed.xml`];
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const days = Number(args[args.indexOf('--days') + 1]) || 2;
const since = Date.now() - days * 86400000;
const { MASTODON_INSTANCE, MASTODON_TOKEN, BLUESKY_HANDLE, BLUESKY_APP_PASSWORD } = process.env;

// { '/article/slug/': { mastodon: { url, id }, bluesky: { url, uri } } }
const SYNDICATION = new URL('../src/_data/syndication.json', import.meta.url);
const syndication = JSON.parse(readFileSync(SYNDICATION, 'utf8'));
const record = (entry, network, post) => {
  (syndication[new URL(entry.url).pathname] ||= {})[network] = post;
};
const posted = (entry, network) => Boolean(syndication[new URL(entry.url).pathname]?.[network]);

const log = (...parts) => console.log(dryRun ? '[dry-run]' : '', ...parts);

async function fetchOk(url, options) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${options?.method || 'GET'} ${url} : ${response.status}`);
  return response;
}

// Articles of the feeds published since `since`: { title, url, lang }
async function recentEntries() {
  const entries = [];
  for (const feed of FEEDS) {
    const { document } = new JSDOM(await (await fetchOk(feed)).text(), { contentType: 'text/xml' }).window;
    const lang = document.documentElement.getAttribute('xml:lang');
    for (const entry of document.querySelectorAll('entry')) {
      const published = Date.parse(entry.querySelector('published')?.textContent);
      if (published >= since) {
        entries.push({ title: entry.querySelector('title').textContent, url: entry.querySelector('link').getAttribute('href'), lang });
      }
    }
  }
  return entries;
}

// Webmention endpoint of a page (Link header, then <link>/<a rel="webmention">)
async function endpoint(target) {
  const response = await fetchOk(target, { redirect: 'follow' });
  const header = response.headers.get('link') || '';
  const fromHeader = header.split(',').find(part => /rel="?[^"]*\bwebmention\b/.test(part))?.match(/<([^>]*)>/)?.[1];
  if (fromHeader !== undefined) return new URL(fromHeader, response.url).href;
  if (!(response.headers.get('content-type') || '').includes('html')) return null;
  const { document } = new JSDOM(await response.text()).window;
  const link = document.querySelector('link[rel~="webmention"][href], a[rel~="webmention"][href]');
  return link ? new URL(link.getAttribute('href'), response.url).href : null;
}

async function sendWebmentions(entry) {
  const { document } = new JSDOM(await (await fetchOk(entry.url)).text()).window;
  const targets = new Set([...document.querySelectorAll('.e-content a[href^="http"]')]
    .map(link => link.href.split('#')[0])
    // Compared by host: a prefix test would also skip https://sylvain.dev.example.org
    .filter(href => ![new URL(SITE).host, 'sylvain.dev', 'www.sylvain.dev'].includes(new URL(href).host)));
  for (const target of targets) {
    try {
      const url = await endpoint(target);
      if (!url || !/^https?:/.test(url)) continue;
      log('webmention', entry.url, '->', target, `(${url})`);
      if (!dryRun) await fetchOk(url, { method: 'POST', body: new URLSearchParams({ source: entry.url, target }) });
    } catch (error) {
      console.warn(`webmention ${target} : ${error.message}`);
    }
  }
}

async function postToMastodon(entry) {
  const api = path => `${MASTODON_INSTANCE.replace(/\/$/, '')}/api/v1/${path}`;
  const headers = { Authorization: `Bearer ${MASTODON_TOKEN}` };
  const account = await (await fetchOk(api('accounts/verify_credentials'), { headers })).json();
  // Posted by hand, or by a run whose mapping was not committed: recorded, not posted again
  const statuses = await (await fetchOk(api(`accounts/${account.id}/statuses?limit=40&exclude_replies=true`), { headers })).json();
  const existing = statuses.find(status => status.content.includes(entry.url) || status.card?.url === entry.url);
  if (existing) return record(entry, 'mastodon', { url: existing.url, id: existing.id });
  log('mastodon', entry.url);
  if (dryRun) return;
  const status = await (await fetchOk(api('statuses'), {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json', 'Idempotency-Key': entry.url },
    body: JSON.stringify({ status: `${entry.title}\n\n${entry.url}`, language: entry.lang, visibility: 'public' }),
  })).json();
  record(entry, 'mastodon', { url: status.url, id: status.id });
}

async function postToBluesky(entry) {
  const xrpc = method => `https://bsky.social/xrpc/${method}`;
  const session = await (await fetchOk(xrpc('com.atproto.server.createSession'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: BLUESKY_HANDLE, password: BLUESKY_APP_PASSWORD }),
  })).json();
  const headers = { Authorization: `Bearer ${session.accessJwt}` };
  const postUrl = uri => `https://bsky.app/profile/${session.handle}/post/${uri.split('/').pop()}`;
  const feed = await (await fetchOk(xrpc(`app.bsky.feed.getAuthorFeed?actor=${session.did}&limit=50&filter=posts_no_replies`), { headers })).json();
  const existing = feed.feed.find(({ post }) => post.record.embed?.external?.uri === entry.url || post.record.text.includes(entry.url));
  if (existing) return record(entry, 'bluesky', { url: postUrl(existing.post.uri), uri: existing.post.uri });
  log('bluesky', entry.url);
  if (dryRun) return;
  const text = `${entry.title}\n\n${entry.url}`;
  // Facets index UTF-8 bytes
  const byteStart = Buffer.byteLength(`${entry.title}\n\n`);
  const created = await (await fetchOk(xrpc('com.atproto.repo.createRecord'), {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      repo: session.did,
      collection: 'app.bsky.feed.post',
      record: {
        $type: 'app.bsky.feed.post',
        text,
        langs: [entry.lang],
        createdAt: new Date().toISOString(),
        facets: [{ index: { byteStart, byteEnd: byteStart + Buffer.byteLength(entry.url) }, features: [{ $type: 'app.bsky.richtext.facet#link', uri: entry.url }] }],
        embed: { $type: 'app.bsky.embed.external', external: { uri: entry.url, title: entry.title, description: '' } },
      },
    }),
  })).json();
  record(entry, 'bluesky', { url: postUrl(created.uri), uri: created.uri });
}

let failed = false;
const entries = await recentEntries();
console.log(`${entries.length} article(s) publié(s) ces ${days} derniers jours`);
for (const entry of entries) {
  const steps = [() => sendWebmentions(entry)];
  // The English translations repeat the French articles: posted once, in French
  if (entry.lang === 'fr') {
    if (MASTODON_INSTANCE && MASTODON_TOKEN && !posted(entry, 'mastodon')) steps.push(() => postToMastodon(entry));
    if (BLUESKY_HANDLE && BLUESKY_APP_PASSWORD && !posted(entry, 'bluesky')) steps.push(() => postToBluesky(entry));
  }
  for (const step of steps) {
    try {
      await step();
    } catch (error) {
      failed = true;
      console.error(`${entry.url} : ${error.message}`);
    }
  }
}
if (!dryRun) writeFileSync(SYNDICATION, `${JSON.stringify(syndication, null, 2)}\n`);
if (failed) process.exitCode = 1;
