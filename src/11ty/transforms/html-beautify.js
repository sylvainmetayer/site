const beautify = require('beautify');

module.exports = function (content, outputPath) {
  if (outputPath && outputPath.indexOf(".html") > -1) {
    let minified = beautify(content, {
      format: 'html'
    });
    return minified;
  }
  return content;
};
