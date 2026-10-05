import { readFileSync } from 'node:fs';
import Fetch from '@11ty/eleventy-fetch';
import site from './site.json' with { type: 'json' };

// Webmentions received by webmention.io for the site, fetched at build time.
// The daily build (daily_build.yml) brings in the new ones. Without the
// WEBMENTION_IO_TOKEN variable (local and preview builds), there are none and
// the articles show nothing.
const ENDPOINT = `https://webmention.io/api/mentions.jf2?domain=${site.webmentionDomain}&per-page=1000`;

// Old URLs redirected to an article (src/_redirects) keep their mentions
const redirects = Object.fromEntries(
  readFileSync(new URL('../_redirects', import.meta.url), 'utf8')
    .split('\n')
    .map(line => line.trim().split(/\s+/))
    .filter(([from, to]) => from && to && from.startsWith('/') && to.startsWith('/'))
    .map(([from, to]) => [withSlash(from), withSlash(to.split('#')[0])])
);

function withSlash(path) {
  return path.endsWith('/') ? path : `${path}/`;
}

// Path of the site page a mention targets, whatever the host it was sent for
// (apex, www, old Netlify domain)
function targetPath(target) {
  try {
    const path = withSlash(new URL(target).pathname);
    return redirects[path] || path;
  } catch {
    return null;
  }
}

// Links come from third parties: only http(s) ones are kept
const httpUrl = url => (typeof url === 'string' && /^https?:\/\//i.test(url) ? url : null);

const TYPES = {
  'like-of': 'like',
  'repost-of': 'repost',
  'bookmark-of': 'bookmark',
  'in-reply-to': 'reply',
  'mention-of': 'mention'
};

// Likes, reposts and bookmarks are counted, replies and mentions are listed
const GROUPS = { like: 'likes', repost: 'reposts', bookmark: 'bookmarks', reply: 'replies', mention: 'replies' };

// Only plain text and http(s) links reach the templates
function normalize(mention) {
  const text = (mention.content?.text || '').trim();
  return {
    type: TYPES[mention['wm-property']] || 'mention',
    author: mention.author?.name || 'Anonyme',
    authorUrl: httpUrl(mention.author?.url),
    url: httpUrl(mention.url),
    published: mention.published || mention['wm-received'],
    text: text.length > 280 ? `${text.slice(0, 279)}…` : text
  };
}

export default async function webmentions() {
  const token = process.env.WEBMENTION_IO_TOKEN;
  if (!token) {
    return {};
  }

  let feed;
  try {
    feed = await Fetch(`${ENDPOINT}&token=${token}`, { duration: '1h', type: 'json' });
  } catch (error) {
    // webmention.io being down must not break the build
    console.warn(`[webmentions] ${error.message}`);
    return {};
  }

  // { '/article/slug/': { likes, reposts, bookmarks, replies } }, oldest first
  const byPath = {};
  feed.children
    .filter(mention => !mention['wm-private'])
    .map(mention => ({ path: targetPath(mention['wm-target']), mention: normalize(mention) }))
    .filter(({ path }) => path)
    .sort((a, b) => String(a.mention.published).localeCompare(String(b.mention.published)))
    .forEach(({ path, mention }) => {
      byPath[path] ||= { likes: [], reposts: [], bookmarks: [], replies: [] };
      byPath[path][GROUPS[mention.type]].push(mention);
    });
  return byPath;
}
