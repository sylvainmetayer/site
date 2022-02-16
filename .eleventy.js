const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");
const pluginRss = require("@11ty/eleventy-plugin-rss");

const markdownConfig = require('./src/11ty/utils/markdown');
const browserSyncConfig = require('./src/11ty/utils/browsersync');
const UserConfig = require("@11ty/eleventy/src/UserConfig");

const filters = require('./src/11ty/filters');
const filtersMethods = Object.entries(filters);

const transforms = require('./src/11ty/transforms');
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
