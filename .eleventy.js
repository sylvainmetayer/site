const rssPlugin = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const fs = require('fs');

const pluginTOC = require('eleventy-plugin-toc');
const imageShareLocal = require('../eleventy-plugin-image-share-local')({
  // Used by moment to configure locale
  lang: 'en',
  // This should be valid for social sharing
  width: 1200,
  height: 600,
  backgroundColor: '#173854',
  textColor: '#fff',
  domain: 'your-awesome-domain.com',
  // Moment format
  dateFormat: 'LL',
  fontName: 'Calibri',
  // Where image will be stored
  outputDir: './dist/images/social-sharing',
  urlPrefix: '/images',
  // An image displayed at the bottom.
  image: './src/images/profile.png',
});

const filters = require('./src/11ty/filters');
const filtersMethods = Object.entries(filters);

// Import transforms
const htmlMinTransform = require('./src/transforms/html-min-transform.js');
const parseTransform = require('./src/transforms/parse-transform.js');

const markdownConfig = require('./src/utils/markdown.js');

// Import data files
const site = require('./src/_data/site.json');

const global = require('./src/_data/global');

const passthroughItems = [
  "src/_redirects",
  "src/fonts",
  "src/images",
  "src/js",
  "src/uploads",
  "src/admin/config.yml",
  "src/admin/previews.js",
  "node_modules/nunjucks/browser/nunjucks-slim.js"
]

module.exports = function (config) {
  // Filters
  filtersMethods.forEach(([name, filter]) => {
    config.addFilter(name, filter)
  });

  // Plugins
  config.addPlugin(rssPlugin);
  config.addPlugin(syntaxHighlight);
  config.addPlugin(pluginTOC, {
    tags: ['h2', 'h3', 'h4'],
    wrapper: 'nav',
    wrapperClass: 'toc'
  });
  config.addPlugin(imageShareLocal);

  // Transforms
  if (global.environment === 'production') {
    config.addTransform('htmlmin', htmlMinTransform);
  }

  config.addTransform('parse', parseTransform);

  passthroughItems.forEach(item => {
    config.addPassthroughCopy(item);
  })

  config.addWatchTarget("src/_includes/partials/global/service-worker.js");

  const isStarredPost = post => post.data.star;

  config.addCollection('posts', async (collection) => {
    const posts = [
      ...collection.getFilteredByGlob('./src/posts/*.md')
    ].reverse();
    posts.forEach(async (item) => imageShareLocal.postImagePreview(item));
    return posts;
  });

  config.addCollection('postFeed', collection => {
    return [...collection.getFilteredByGlob('./src/posts/*.md')]
      .reverse()
      .slice(0, site.maxPostsPerPage);
  });

  config.addCollection('starFeed', collection => {
    return [...collection.getFilteredByGlob('./src/posts/*.md').filter(isStarredPost)]
      .reverse()
      .slice(0, site.maxPostsPerPage);
  });

  config.addCollection('work', collection => {
    return collection.getFilteredByGlob('./src/work/*.md')
      .sort((a, b) => b.data.start - a.data.start);
  });

  // 404
  config.setBrowserSyncConfig({
    ui: false,
    // Replicate click on all opened tabs
    ghostMode: false,
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync('dist/404.html');

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  config.setLibrary("md", markdownConfig);
  config.setDataDeepMerge(true);

  config.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "---"
  });

  return {
    templateFormats: [
      "md",
      "njk",
    ],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: 'src',
      output: 'dist'
    },
    passthroughFileCopy: true
  };
};
