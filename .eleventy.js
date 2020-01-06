module.exports = function (eleventyConfig) {
    return {
        dir: {
            input: "./srcBis",
            output: "./_site",
            includes: "_includes",
            layouts: "_layouts"
        }
    };
};
