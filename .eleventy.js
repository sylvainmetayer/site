const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const eleventyDartSassPlugin = require("eleventy-plugin-dart-sass");
const path = require('path');

const helpers = require('./src/_data/helpers');
const markdownConfig = require('./src/11ty/utils/markdown');
const browserSyncConfig = require('./src/11ty/utils/browsersync');
const UserConfig = require("@11ty/eleventy/src/UserConfig");

const filters = require('./src/11ty/filters');
const filtersMethods = Object.entries(filters);

const transforms = require('./src/11ty/transforms');
const transformsMethods = Object.entries(transforms);

const sassConfig = {
  includePaths: ["**/*.{scss,sass}", "!node_modules/**"],
  sassIndexFile: 'main.scss',
  watchSass: true,
  sassLocation: path.normalize(
    path.join(__dirname, "src/_includes/assets/scss/")
  ),
  outDir: path.normalize(
    path.join(__dirname, 'dist/')
  ),
  outPath: "/assets/css/",
  domainName: helpers.url(),
  outFileName: 'main.css',
  outputStyle: 'compressed'
};

const passthroughItems = [
  'src/_redirects',
  {
    "src/favicon.ico": "/favicon.ico",
    "src/static/img": "/static/img",
    "src/static/CV.pdf": "/static/CV.pdf",
    "src/_includes/assets/css": "/assets/css",
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
  eleventyConfig.addPlugin(eleventyDartSassPlugin, sassConfig);

  passthroughItems.forEach(item => {
    eleventyConfig.addPassthroughCopy(item);
  })

  eleventyConfig.setBrowserSyncConfig(browserSyncConfig);
  eleventyConfig.setLibrary("md", markdownConfig);
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "---"
  });

  return {
    templateFormats: ["md", "njk", "html"],
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
