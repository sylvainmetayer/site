import { readFileSync } from 'node:fs';
import matter from 'gray-matter';
import rssPlugin from '@11ty/eleventy-plugin-rss';
import pluginTOC from 'eleventy-plugin-toc';

import filters from './src/11ty/filters/index.js';
import baseline from './src/11ty/shortcodes/baseline.js';
import youtube from './src/11ty/shortcodes/youtube.js';
import talksCalendar from './src/11ty/ics.js';
import { mastodonAccount } from './src/11ty/fediverse.js';
import parseTransform from './src/transforms/parse-transform.js';
import markdownLibrary from './src/utils/markdown.js';
import site from './src/_data/site.json' with { type: 'json' };
import i18n from './src/_data/i18n.js';
import { DEFAULT_LANG, baseSlug, isEnglishFile, otherLang, translationIndex, urlIndex } from './src/11ty/i18n.js';

// Cloudflare Pages builds: production on main, preview elsewhere. Set here rather
// than as project env vars (homelab tofu/site), so the repository owns it.
if (!process.env.ELEVENTY_ENV && process.env.CF_PAGES) {
  process.env.ELEVENTY_ENV = process.env.CF_PAGES_BRANCH === 'main' ? 'production' : 'preview';
}

const passthroughItems = {
  'src/_redirects': '_redirects',
  'src/_headers': '_headers',
  'src/feed.xsl': 'feed.xsl',
  // Served on the old apex origin by Pangolin, see the file header.
  'src/service-worker-retired.js': 'service-worker-retired.js',
  'src/images': 'images',
  // Requested at the root by browsers and feed readers that ignore <link rel="icon">
  'src/images/icons/favicon.ico': 'favicon.ico',
  'src/js': 'js',
  'src/uploads': 'uploads',
  'src/admin/config.yml': 'admin/config.yml',
  // Sveltia CMS is self-hosted so the admin works with `script-src 'self'`.
  'node_modules/@sveltia/cms/dist/sveltia-cms.js': 'admin/sveltia-cms.js',
  // Fonts are self-hosted to respect `font-src 'self'`.
  'node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2':
    'fonts/jetbrains-mono-latin-wght-normal.woff2',
  'node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2':
    'fonts/ibm-plex-sans-latin-wght-normal.woff2',
  'node_modules/@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-italic.woff2':
    'fonts/ibm-plex-sans-latin-wght-italic.woff2',
  // Static weights for the CV PDF (/cv/pdf/): Chromium turns variable fonts into Type 3
  // fonts in PDFs, which applicant tracking systems read badly
  ...Object.fromEntries([
    'ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2',
    'ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2',
    'ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2',
    'ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff2',
    'jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2',
    'jetbrains-mono/files/jetbrains-mono-latin-600-normal.woff2',
  ].map(file => [`node_modules/@fontsource/${file}`, `fonts/cv/${file.split('/').pop()}`])),
};

const byNewest = (a, b) => b.date - a.date;

// English translations are `*.en.md` files next to the French ones: the French
// collections leave them out, English pages map items with the `translated` filter
const isFrench = item => !isEnglishFile(item.inputPath);

export default function eleventyConfig(config) {
  Object.entries(filters).forEach(([name, filter]) => {
    config.addFilter(name, filter);
  });

  config.addTransform('parse', parseTransform);

  config.addNunjucksAsyncShortcode('baseline', baseline);
  config.addNunjucksAsyncShortcode('youtube', youtube);

  config.addPassthroughCopy(passthroughItems);

  config.addWatchTarget('src/_includes/partials/service-worker.js');

  const isStarredPost = post => post.data.star;

  config.addCollection('posts', collection => {
    return collection.getFilteredByGlob('./src/posts/*.md').filter(isFrench).sort(byNewest);
  });

  // English translations of the articles, newest first (/en/feed.xml, neighbours)
  config.addCollection('postsEn', collection => {
    return collection.getFilteredByGlob('./src/posts/*.en.md').sort(byNewest);
  });

  // Every article for the English pages: its translation when there is one,
  // the French original otherwise (/en/articles/, English home page)
  config.addCollection('postsAllEn', collection => {
    const translations = new Map(collection.getFilteredByGlob('./src/posts/*.en.md')
      .map(post => [post.data.translationKey, post]));
    return collection.getFilteredByGlob('./src/posts/*.md')
      .filter(isFrench)
      .sort(byNewest)
      .map(post => translations.get(post.data.translationKey) || post);
  });

  config.addCollection('postFeed', collection => {
    return collection.getFilteredByGlob('./src/posts/*.md')
      .filter(isFrench)
      .sort(byNewest)
      .slice(0, site.maxPostsPerPage);
  });

  config.addCollection('starFeed', collection => {
    return collection.getFilteredByGlob('./src/posts/*.md')
      .filter(isFrench)
      .filter(isStarredPost)
      .sort(byNewest)
      .slice(0, site.maxPostsPerPage);
  });

  // Short notes (src/notes/), newest first: /notes/
  config.addCollection('notes', collection => {
    return collection.getFilteredByGlob('./src/notes/*.md').sort(byNewest);
  });

  config.addCollection('work', collection => {
    return collection.getFilteredByGlob('./src/work/*.md')
      .filter(isFrench)
      .sort((a, b) => b.data.start - a.data.start);
  });

  config.addCollection('projets', collection => {
    return collection.getFilteredByGlob('./src/projets/*.md')
      .filter(isFrench)
      .sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title));
  });

  // Items whose front matter `key` is truthy
  config.addFilter('withData', (items, key) => items.filter(item => item.data[key]));

  // Display name of the site hosting a URL: "LinkedIn", "dev.to", or the host name
  // without www or a language subdomain (fr.linkedin.com)
  const siteNames = { 'linkedin.com': 'LinkedIn', 'medium.com': 'Medium' };
  config.addFilter('siteName', url => {
    let labels;
    try {
      labels = new URL(url).hostname.split('.');
    } catch {
      // Not an absolute URL (typed without https:// in the CMS): show it as is
      return url;
    }
    if (labels.length > 2 && /^(www|[a-z]{2})$/.test(labels[0])) labels.shift();
    const host = labels.join('.');
    return siteNames[host] || host;
  });

  // URL without scheme, www or trailing slash, for display: "github.com/sylvainmetayer"
  config.addFilter('displayUrl', url => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''));

  // Distinct values of `key` across items, in order of first appearance
  config.addFilter('uniqueValues', (items, key) => [...new Set(items.map(item => item[key]))]);

  // Tags used by posts, sorted (the same ones that get a /tags/<tag>/ page)
  const postTags = posts => [...new Set(posts.flatMap(post => post.data.tags || []))].sort((a, b) => a.localeCompare(b));
  config.addFilter('postTags', postTags);

  // The tags of the French articles, one /tags/<tag>/ page each (src/tags.njk)
  config.addCollection('postTagList', collection => postTags(collection.getFilteredByGlob('./src/posts/*.md').filter(isFrench)));

  // The first `count` items of a list
  config.addFilter('head', (items, count) => items.slice(0, count));

  // Items whose front matter `key` equals `value`
  config.addFilter('whereData', (items, key, value) => items.filter(item => item.data[key] === value));

  // Interface string of the page language (src/_data/i18n.js), French when the
  // English one is missing: {{ 'posts.count' | t({ count: 3 }) }}. With a
  // `count`, a key that has `.one` and `.other` forms takes the matching one.
  config.addFilter('t', function (key, options, lang) {
    const values = options || {};
    const language = lang || this.ctx?.lang || DEFAULT_LANG;
    const plural = `${key}.${values.count === 1 ? 'one' : 'other'}`;
    const form = 'count' in values && plural in i18n.fr ? plural : key;
    const text = i18n[language]?.[form] ?? i18n.fr[form];
    if (text === undefined) throw new Error(`Texte d'interface inconnu : ${form}`);
    return text.replace(/\{(\w+)\}/g, (match, name) => (name in values ? values[name] : match));
  });

  // Items (posts, projects, work) in the language of the page: each one is
  // replaced by its translation when there is one, and kept otherwise
  config.addFilter('translated', function (items, all, lang) {
    const language = lang || this.ctx?.lang || DEFAULT_LANG;
    if (language === DEFAULT_LANG) return items;
    const index = translationIndex(all);
    return items.map(item => index.get(item.data.translationKey)?.[language] || item);
  });

  // The same page in the other language, if it has one (a published page):
  // {% set alternate = translationKey | alternate(collections.all) %}
  config.addFilter('alternate', function (key, all, lang) {
    if (!key) return null;
    const language = lang || this.ctx?.lang || DEFAULT_LANG;
    const other = translationIndex(all).get(key)?.[otherLang(language)];
    return other?.url ? other : null;
  });

  // A link to a page of the site, in the language of the page: the URL of its
  // translation when there is one, otherwise the page itself with its language,
  // so the template can say it is in French. { url, lang }
  config.addFilter('localLink', function (url, all, lang) {
    const language = lang || this.ctx?.lang || DEFAULT_LANG;
    const target = urlIndex(all).get(url);
    if (!target) return { url, lang: language };
    const translation = translationIndex(all).get(target.data.translationKey)?.[language];
    return translation?.url ? { url: translation.url, lang: language } : { url, lang: target.data.lang };
  });

  // One line of Markdown without the <p> (comments of src/_data/links.json)
  config.addFilter('markdownInline', text => markdownLibrary.renderInline(text));

  // "@user@instance" -> { user, instance, url } (src/_data/site.json `mastodon`)
  config.addFilter('mastodonAccount', mastodonAccount);

  // Talk sessions as an iCalendar file (src/talks-ics.njk)
  config.addFilter('talksCalendar', talksCalendar);

  // Body of a Markdown file, without its front matter (src/article-markdown.njk)
  // and without the {% raw %} markers, which only exist for Nunjucks.
  // {% youtube 'id', 'Titre' %} becomes a link to the video.
  // shortcut: other shortcodes ({% baseline %}) stay as written, render them if an article uses one.
  config.addFilter('rawMarkdown', inputPath => matter(readFileSync(inputPath, 'utf8')).content
    .replace(/\{%-?\s*(end)?raw\s*-?%\}/g, '')
    .replace(/\{%-?\s*youtube\s+(["'])([\w-]{11})\1\s*,\s*(["'])(.*?)\3\s*-?%\}/g,
      (_, _q, id, _q2, title) => `[${title.replace(/\\(["'])/g, '$1')}](https://www.youtube.com/watch?v=${id})`)
    .trim());

  // Up to `count` posts sharing the most tags with the one at `url`, newest first
  // on a tie; posts without a shared tag, in `exclude` (backlinks) or in the same
  // series (already listed above the article) are left out
  config.addFilter('related', (posts, url, exclude = [], count = 3) => {
    const current = posts.find(post => post.url === url);
    const tags = new Set(current?.data.tags || []);
    return posts
      .filter(post => post.url !== url && !exclude.includes(post))
      .filter(post => !current?.data.series || post.data.series !== current.data.series)
      .map(post => ({ post, shared: (post.data.tags || []).filter(tag => tags.has(tag)).length }))
      .filter(({ shared }) => shared > 0)
      .sort((a, b) => b.shared - a.shared || b.post.date - a.post.date)
      .slice(0, count)
      .map(({ post }) => post);
  });

  // Posts whose Markdown body links to the article `slug` (in either language):
  // rawInput, without front matter, templateContent is not ready for every page yet
  config.addFilter('backlinks', (posts, slug) => {
    const link = new RegExp(`/article/${slug}(/|#|\\)|"|$)`, 'm');
    return posts.filter(post => baseSlug(post.fileSlug) !== slug && link.test(post.rawInput));
  });

  // Slug shared by an entry and its translation: anchors, search index
  config.addFilter('baseSlug', baseSlug);

  // Posts grouped by publication year, newest first: [{ year, posts }]
  config.addFilter('groupByYear', posts => {
    const groups = new Map();
    posts.forEach(post => {
      const year = post.date.getFullYear();
      if (!groups.has(year)) groups.set(year, []);
      groups.get(year).push(post);
    });
    return [...groups].map(([year, items]) => ({ year, posts: items }));
  });

  config.addPlugin(rssPlugin);
  config.addPlugin(pluginTOC, {
    tags: ['h2', 'h3'],
    wrapper: 'div',
    wrapperClass: 'toc-nav'
  });

  config.setLibrary('md', markdownLibrary);

  config.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: '---'
  });

  return {
    templateFormats: ['md', 'njk'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
}
