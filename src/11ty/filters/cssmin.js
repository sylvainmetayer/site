const CleanCSS = require("clean-css");

module.exports = code => {
  return new CleanCSS({}).minify(code).styles;
};
