// Unit tests of the build helpers: npm test (node --test, no dependency)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import talksCalendar, { fold } from '../src/11ty/ics.js';
import { wrap } from '../src/11ty/og-image.js';
import { mastodonAccount } from '../src/11ty/fediverse.js';
import markdown from '../src/utils/markdown.js';

test('fold: lines of at most 75 octets, unfolded back to the original', () => {
  const line = 'DESCRIPTION:' + 'é'.repeat(100);
  const folded = fold(line);
  for (const part of folded.split('\r\n')) assert.ok(Buffer.byteLength(part) <= 75);
  assert.equal(folded.replace(/\r\n /g, ''), line);
});

test('talksCalendar: one event per session, unique UIDs, escaped text, CRLF', () => {
  const ics = talksCalendar([
    { title: 'A; b, c\\d', repo: 'https://example.org/a', sessions: [{ event: 'Conf', date: '2025-01-30' }] },
    { title: 'Other', repo: 'https://example.org/b', sessions: [{ event: 'Conf', date: '2025-01-30', slides: 'https://example.org/s' }] },
  ], 'Talks');
  const uids = ics.match(/^UID:.*$/gm);
  assert.equal(uids.length, 2);
  assert.equal(new Set(uids).size, 2);
  assert.ok(ics.includes(String.raw`SUMMARY:A\; b\, c\\d (Conf)`));
  assert.match(ics, /DTEND;VALUE=DATE:20250131/);
  assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
  assert.ok(!/[^\r]\n/.test(ics));
});

test('wrap: words kept whole, at most 4 lines, ellipsis when cut', () => {
  assert.deepEqual(wrap('a b c', 3), ['a b', 'c']);
  const lines = wrap('un deux trois quatre cinq six sept huit', 9);
  assert.equal(lines.length, 4);
  assert.ok(lines[3].endsWith('…'));
});

test('mastodonAccount: @user@instance only', () => {
  assert.deepEqual(mastodonAccount('@me@piaille.fr'), { user: 'me', instance: 'piaille.fr', url: 'https://piaille.fr/@me' });
  assert.equal(mastodonAccount('https://piaille.fr/@me'), null);
  assert.equal(mastodonAccount(''), null);
});

test('markdown: callouts become notes with a translated title', () => {
  const fr = markdown.render('> [!WARNING]\n> Attention', { lang: 'fr' });
  assert.match(fr, /<div class="callout callout-warning" role="note">/);
  assert.match(fr, /<p class="callout-title">Attention<\/p>/);
  assert.match(markdown.render('> [!TIP]\n> x', { lang: 'en' }), /callout-title">Tip</);
  assert.match(markdown.render('> a quote', {}), /<blockquote>/);
});

test('markdown: code blocks get classes, no inline style, file name and options', () => {
  const html = markdown.render('```js {2} title="a.js" showLineNumbers\nconst a = 1;\nconst b = 2;\n```', {});
  assert.ok(!html.includes('style='));
  assert.match(html, /^<div class="code-title">a\.js<\/div>/);
  assert.match(html, /class="shiki sylvain-dev line-numbers"/);
  assert.match(html, /class="line highlighted"/);
  assert.match(html, /class="tok-[0-9a-f]{6}/);
});

test('checkPostFrontMatter: names every invalid field', async () => {
  const { default: check } = await import('../src/11ty/front-matter.js');
  const page = { date: new Date('2020-01-01') };
  assert.doesNotThrow(() => check({ title: 'Ok', page, tags: ['devops', 'k8s'], short: 'tf' }));
  assert.throws(() => check({ title: '', page, tags: ['Bad Tag'], canonical: 'dev.to/x' }), /title.*tags.*canonical/);
});
