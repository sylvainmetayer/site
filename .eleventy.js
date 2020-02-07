const moment = require("moment");
moment.locale("fr");

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const srcFolder = "./srcBis";

const { url } = require(`${srcFolder}/_data/site`);


module.exports = function (eleventyConfig) {

  eleventyConfig.addCollection("posts", (collections) => {
    return collections.getFilteredByGlob(`${srcFolder}/posts/*.md`)
      .filter((item) => !item.data.hidden)
      .sort((a, b) => {
        return b.date - a.date;
      });
  });

  eleventyConfig.addCollection("certifications", (collections) => {
    return collections.getFilteredByGlob(`${srcFolder}/certifications/*.md`)
      .sort((a, b) => {
        return b.date - a.date;
      });
  });

  eleventyConfig.addCollection("companies", (collections) => {
    return collections.getFilteredByGlob(`${srcFolder}/companies/*.md`)
      .sort((a, b) => {
        return b.data.dates.from - a.data.dates.from;
      });
  });

  eleventyConfig.addFilter("limit", function (array, limit) {
    return array.slice(0, limit);
  });

  eleventyConfig.addFilter("date", function (date, format) {
    return moment(date).format(format);
  });

  eleventyConfig.addFilter("debug", function (variable) {
    console.info(variable);
  });

  eleventyConfig.addShortcode("image", function (name, alt, classes = []) {
    return `<img src='${url}/assets/images/${name}' class='${classes.join(' ')}' alt='${alt}'/>`
  })

  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addPassthroughCopy(`${srcFolder}/assets`);

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
