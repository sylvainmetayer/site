const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const sitemap = require("@quasibit/eleventy-plugin-sitemap");

const markdownConfig = require('./src/11ty/utils/markdown');
const browserSyncConfig = require('./src/11ty/utils/browsersync');
const UserConfig = require("@11ty/eleventy/src/UserConfig");

const filters = require('./src/11ty/filters');
const filtersMethods = Object.entries(filters);

const transforms = require('./src/11ty/transforms');
const helpers = require('./src/_data/helpers');
const transformsMethods = Object.entries(transforms);

const passthroughItems = [
  'src/_redirects',
  {
    "src/favicon.ico": "/favicon.ico",
    "src/static/img": "/static/img",
    "src/static/CV.pdf": "/static/CV.pdf",
    "src/_includes/assets/js": "/assets/js"
  }
];

/** @param {UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {

  eleventyConfig.addCollection('post', (collectionApi) => collectionApi.getFilteredByGlob("src/posts/*.md"));
  eleventyConfig.addCollection('pages', (collectionApi) => collectionApi.getFilteredByGlob("src/pages/*.md"));
  eleventyConfig.addCollection('project', (collectionApi) => collectionApi.getFilteredByGlob("src/projects/*.md"));
  eleventyConfig.addCollection('rss', (collectionApi) => collectionApi.getFilteredByGlob(["src/posts/*.md", "src/projects/*.md"]));

  filtersMethods.forEach(([name, filter]) => {
    eleventyConfig.addFilter(name, filter)
  });

  transformsMethods.forEach(([name, filter]) => {
    eleventyConfig.addTransform(name, filter)
  });

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(emojiReadTime, {
    emoji: "🍿",
    label: "min.",
    wpm: 250,
    bucketSize: 3,
  });
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: helpers.url(),
    },
  });

  passthroughItems.forEach(item => {
    eleventyConfig.addPassthroughCopy(item);
  })

  eleventyConfig.addWatchTarget("./src/scss/*.scss");

  eleventyConfig.setBrowserSyncConfig(browserSyncConfig);
  eleventyConfig.setLibrary("md", markdownConfig);
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "---"
  });

  eleventyConfig.setQuietMode(true);
  eleventyConfig.addPlugin(directoryOutputPlugin, {
    // Customize columns
    columns: {
      filesize: true, // Use `false` to disable
      benchmark: true, // Use `false` to disable
    },

    // Will show in yellow if greater than this number of bytes
    warningFileSize: 400 * 1000,
  });

  return {
    templateFormats: ["md", "njk", "html", "11ty.js"],
    pathPrefix: "/",
    passthroughFileCopy: true,
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist"
    }
  };
};
