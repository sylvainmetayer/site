// Unit tests of the build helpers: npm test (node --test)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wrap } from '../src/11ty/og-image.js';
import { mastodonAccount } from '../src/11ty/fediverse.js';
import markdown from '../src/utils/markdown.js';
import check from '../src/11ty/front-matter.js';
import { JSDOM } from 'jsdom';
import { videoLength } from '../src/11ty/shortcodes/youtube.js';
import { markAbbreviations } from '../src/transforms/abbreviations.js';

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

test('checkPostFrontMatter: names every invalid field', () => {
  const page = { date: new Date('2020-01-01') };
  assert.doesNotThrow(() => check({ title: 'Ok', page, tags: ['devops', 'k8s'], short: 'tf' }));
  assert.doesNotThrow(() => check({ title: 'Brouillon', page, socialImage: false }));
  assert.throws(() => check({ title: '', page, tags: ['Bad Tag'], canonical: 'dev.to/x' }), /title.*tags.*canonical/);
});

test('videoLength: clock on the thumbnail, words for screen readers', () => {
  assert.deepEqual(videoLength(2727), { clock: '45:27', words: '45 min' });
  assert.deepEqual(videoLength(10190), { clock: '2:49:50', words: '2 h 50 min' });
  assert.deepEqual(videoLength(20), { clock: '0:20', words: '1 min' });
});

test('markAbbreviations: first occurrence only, whole words, language of the text, not in code', () => {
  const { document } = new JSDOM(`<main><p>API et PHP7 MÉTAYER</p><p lang="en">API <code>CSS</code> CSS</p></main>`).window;
  markAbbreviations(document, {
    API: { fr: 'interface', en: 'interface (en)' },
    CSS: { fr: 'feuilles de style', en: 'style sheets' },
    PHP: { fr: 'php', en: 'php' },
    TAYER: { fr: 'x', en: 'x' },
  });
  const abbrs = [...document.querySelectorAll('abbr')].map(abbr => `${abbr.textContent}=${abbr.title}`);
  assert.deepEqual(abbrs, ['API=interface', 'CSS=style sheets']);
});
