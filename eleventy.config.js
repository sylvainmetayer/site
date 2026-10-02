import rssPlugin from '@11ty/eleventy-plugin-rss';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import pluginTOC from 'eleventy-plugin-toc';

import filters from './src/11ty/filters/index.js';
import parseTransform from './src/transforms/parse-transform.js';
import markdownLibrary from './src/utils/markdown.js';
import site from './src/_data/site.json' with { type: 'json' };

const passthroughItems = {
  'src/_redirects': '_redirects',
  'src/images': 'images',
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
};

const byNewest = (a, b) => b.date - a.date;

export default function (config) {
  Object.entries(filters).forEach(([name, filter]) => {
    config.addFilter(name, filter);
  });

  config.addTransform('parse', parseTransform);

  config.addPassthroughCopy(passthroughItems);

  config.addWatchTarget('src/_includes/partials/service-worker.js');

  const isStarredPost = post => post.data.star;

  config.addCollection('posts', collection => {
    return collection.getFilteredByGlob('./src/posts/*.md').sort(byNewest);
  });

  config.addCollection('postFeed', collection => {
    return collection.getFilteredByGlob('./src/posts/*.md')
      .sort(byNewest)
      .slice(0, site.maxPostsPerPage);
  });

  config.addCollection('starFeed', collection => {
    return collection.getFilteredByGlob('./src/posts/*.md')
      .filter(isStarredPost)
      .sort(byNewest)
      .slice(0, site.maxPostsPerPage);
  });

  config.addCollection('work', collection => {
    return collection.getFilteredByGlob('./src/work/*.md')
      .sort((a, b) => b.data.start - a.data.start);
  });

  config.addCollection('projets', collection => {
    return collection.getFilteredByGlob('./src/projets/*.md')
      .sort((a, b) => b.data.year - a.data.year || a.data.title.localeCompare(b.data.title));
  });

  // Items whose front matter `key` is truthy
  config.addFilter('withData', (items, key) => items.filter(item => item.data[key]));

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
  config.addPlugin(syntaxHighlight);
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
