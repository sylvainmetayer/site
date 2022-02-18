const UglifyJS = require("uglify-es");

module.exports = code => {
  let minified = UglifyJS.minify(code);
  if (minified.error) {
    console.log("UglifyJS error: ", minified.error);
    return code;
  }
  return minified.code;
}
