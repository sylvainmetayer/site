import Fetch from '@11ty/eleventy-fetch';
import { JSDOM } from 'jsdom';
import site from './site.json' with { type: 'json' };
import { mastodonAccount } from '../11ty/fediverse.js';

// Replies to the Mastodon and Bluesky posts that share an article
// (scripts/syndicate.mjs), shown under it as comments. Public APIs, no token;
// the daily build brings in the new ones. Without an account in site.json, or
// if a network does not answer, there are none from it.
// { '/article/slug/': [{ network, url, replies: [{ author, authorUrl, url, published, text }] }] }

const OWN_HOSTS = ['www.sylvain.dev', 'sylvain.dev'];
const getJson = url => Fetch(url, { duration: '1h', type: 'json' });

// Path of an article of the site, or null for any other URL
function articlePath(url) {
  try {
    const { hostname, pathname } = new URL(url);
    return OWN_HOSTS.includes(hostname) && /^\/(en\/)?article\//.test(pathname) ? pathname.replace(/\/?$/, '/') : null;
  } catch {
    return null;
  }
}

const httpUrl = url => (typeof url === 'string' && /^https?:\/\//i.test(url) ? url : null);

// Only plain text reaches the templates, like the webmentions
const reply = ({ author, authorUrl, url, published, text }) => ({
  author: author || 'Anonyme',
  authorUrl: httpUrl(authorUrl),
  url: httpUrl(url),
  published,
  text: text.length > 500 ? `${text.slice(0, 499)}…` : text,
});

async function mastodon() {
  const account = mastodonAccount(site.mastodon);
  if (!account) return [];
  const api = path => `https://${account.instance}/api/v1/${path}`;
  const { id } = await getJson(api(`accounts/lookup?acct=${account.user}`));
  const statuses = await getJson(api(`accounts/${id}/statuses?limit=40&exclude_replies=true`));
  const threads = [];
  for (const status of statuses) {
    const links = [status.card?.url, ...[...new JSDOM(status.content).window.document.querySelectorAll('a[href]')].map(link => link.href)];
    const path = links.map(articlePath).find(Boolean);
    if (!path) continue;
    const { descendants } = await getJson(api(`statuses/${status.id}/context`));
    threads.push({
      path,
      network: 'Mastodon',
      url: status.url,
      replies: descendants.map(item => reply({
        author: item.account.display_name || item.account.acct,
        authorUrl: item.account.url,
        url: item.url,
        published: item.created_at,
        // Paragraphs and line breaks kept as spaces, tags dropped
        text: new JSDOM(item.content.replace(/<br\s*\/?>|<\/p>/g, ' ')).window.document.body.textContent.trim(),
      })),
    });
  }
  return threads;
}

async function bluesky() {
  if (!site.bluesky) return [];
  const xrpc = method => `https://public.api.bsky.app/xrpc/${method}`;
  const postUrl = post => `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`;
  const { feed } = await getJson(xrpc(`app.bsky.feed.getAuthorFeed?actor=${encodeURIComponent(site.bluesky)}&limit=50&filter=posts_no_replies`));
  const threads = [];
  for (const { post } of feed) {
    const path = articlePath(post.record.embed?.external?.uri) || articlePath(post.record.facets?.flatMap(facet => facet.features).find(feature => feature.uri)?.uri);
    if (!path) continue;
    const { thread } = await getJson(xrpc(`app.bsky.feed.getPostThread?uri=${encodeURIComponent(post.uri)}&depth=10`));
    const replies = [];
    (function walk(node) {
      for (const child of node.replies || []) {
        if (!child.post) continue;
        replies.push(reply({
          author: child.post.author.displayName || child.post.author.handle,
          authorUrl: `https://bsky.app/profile/${child.post.author.handle}`,
          url: postUrl(child.post),
          published: child.post.record.createdAt,
          text: child.post.record.text,
        }));
        walk(child);
      }
    })(thread);
    replies.sort((a, b) => String(a.published).localeCompare(String(b.published)));
    threads.push({ path, network: 'Bluesky', url: postUrl(post), replies });
  }
  return threads;
}

export default async function socialReplies() {
  const byPath = {};
  for (const [name, source] of [['mastodon', mastodon], ['bluesky', bluesky]]) {
    let threads = [];
    try {
      threads = await source();
    } catch (error) {
      console.warn(`[socialReplies] ${name} : ${error.message}`);
    }
    for (const { path, ...thread } of threads) {
      (byPath[path] ||= []).push(thread);
    }
  }
  return byPath;
}
