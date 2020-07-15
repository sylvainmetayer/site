const rssPlugin = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const fs = require('fs');

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

  // Transforms
  if (global.environment === 'production') {
    config.addTransform('htmlmin', htmlMinTransform);
  }

  config.addTransform('parse', parseTransform);

  passthroughItems.forEach(item => {
    config.addPassthroughCopy(item);
  })

  config.addWatchTarget("src/_includes/partials/global/service-worker.js");

  const now = new Date();

  // Custom collections
  const isLivePost = post => post.date <= now && !post.data.draft;
  const isStarredPost = post => post.date <= now && !post.data.draft && post.data.star;

  config.addCollection('posts', collection => {
    return [
      ...collection.getFilteredByGlob('./src/posts/*.md').filter(isLivePost)
    ].reverse();
  });

  config.addCollection('postFeed', collection => {
    return [...collection.getFilteredByGlob('./src/posts/*.md').filter(isLivePost)]
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

  // Plugins
  config.addPlugin(rssPlugin);
  config.addPlugin(syntaxHighlight);

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

  config.setLibrary("md", markdownConfig)

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
