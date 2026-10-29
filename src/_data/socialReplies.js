import Fetch from '@11ty/eleventy-fetch';
import { JSDOM } from 'jsdom';
import syndication from './syndication.json' with { type: 'json' };

// Replies to the Mastodon and Bluesky posts that share an article, shown under
// it as comments. The posts are listed in syndication.json (written by
// scripts/syndicate.mjs, or by hand for a post shared another way). Public
// APIs, no token; the daily build brings in the new replies. A post that does
// not answer is left out.
// { '/article/slug/': [{ network, url, replies: [{ author, authorUrl, url, published, text }] }] }

const getJson = url => Fetch(url, { duration: '1h', type: 'json' });

const httpUrl = url => (typeof url === 'string' && /^https?:\/\//i.test(url) ? url : null);

// Only plain text reaches the templates, like the webmentions
const reply = ({ author, authorUrl, url, published, text }) => ({
  author: author || 'Anonyme',
  authorUrl: httpUrl(authorUrl),
  url: httpUrl(url),
  published,
  text: text.length > 500 ? `${text.slice(0, 499)}…` : text,
});

// The threads, fetched in parallel: a post
// that fails is left out, not the whole network
async function settled(name, promises) {
  const results = await Promise.allSettled(promises);
  results.filter(result => result.status === 'rejected').forEach(({ reason }) => console.warn(`[socialReplies] ${name} : ${reason.message}`));
  return results.filter(result => result.status === 'fulfilled' && result.value).map(result => result.value);
}

// The Mastodon post of an article: replies from the status context of its instance
async function mastodon(path, { url, id }) {
  const { descendants } = await getJson(`${new URL(url).origin}/api/v1/statuses/${encodeURIComponent(id)}/context`);
  return {
    path,
    network: 'Mastodon',
    url,
    replies: descendants.map(item => reply({
      author: item.account.display_name || item.account.acct,
      authorUrl: item.account.url,
      url: item.url,
      published: item.created_at,
      // Paragraphs and line breaks kept as spaces, tags dropped
      text: new JSDOM(item.content.replace(/<br\s*\/?>|<\/p>/g, ' ')).window.document.body.textContent.trim(),
    })),
  };
}

// The Bluesky post of an article: the whole reply tree, oldest first
async function bluesky(path, { url, uri }) {
  const xrpc = method => `https://public.api.bsky.app/xrpc/${method}`;
  const postUrl = post => `https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}`;
  const { thread } = await getJson(xrpc(`app.bsky.feed.getPostThread?uri=${encodeURIComponent(uri)}&depth=10`));
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
  return { path, network: 'Bluesky', url, replies };
}

export default async function socialReplies() {
  const sources = { mastodon, bluesky };
  const threads = await settled('fils', Object.entries(syndication).flatMap(([path, posts]) =>
    Object.entries(posts).filter(([network]) => sources[network]).map(([network, post]) => sources[network](path, post))));
  const byPath = {};
  for (const { path, ...thread } of threads) {
    (byPath[path] ||= []).push(thread);
  }
  return byPath;
}
