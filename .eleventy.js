const moment = require("moment");
moment.locale("fr");

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const srcFolder = "./srcBis";
module.exports = function (eleventyConfig) {

  eleventyConfig.addCollection("posts", (collections) => {
    return collections.getFilteredByGlob(`${srcFolder}/posts/*.md`)
      .sort((a, b) => {
        return b.date - a.date;
      });
  });

  eleventyConfig.addNunjucksFilter("limit", function (array, limit) {
    return array.slice(0, limit);
  });

  eleventyConfig.addNunjucksFilter("date", function (date, format) {
    return moment(date).format(format);
  });

  eleventyConfig.addNunjucksFilter("debug", function (variable) {
    console.info(variable);
  });

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.setDataDeepMerge(true);

  return {
    templateFormats: [
      "md",
      "njk",
    ],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    dir: {
      input: srcFolder,
      output: "./_site",
      includes: "_includes",
      layouts: "_layouts"
    }
  };
};
