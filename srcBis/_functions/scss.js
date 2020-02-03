// From https://github.com/nhoizey/nicolas-hoizey.com

const sass = require("node-sass");
const path = require("path");
const CleanCSS = require("clean-css");

const compileScss = scss => {
  let result;
  try {
    result = sass.renderSync({
      file: path.join(__dirname, "../", scss)
    });
  } catch (error) {
    result = error;
  }

  if (!result.css) {
    console.error("Error compiling stylesheet");
    console.debug(result);
    return "Error compiling stylesheet";
  }

  const minifiedCSS = new CleanCSS().minify(result.css.toString());

  if (!minifiedCSS.styles) {
    console.error("Error compiling stylesheet");
    console.debug(minifiedCSS.error);
    return minifiedCSS.error;
  }

  return minifiedCSS.styles;
};

module.exports = {
  compileSassTargets: targets =>
    Object.keys(targets).reduce((acc, key) => {
      acc[key] = compileScss(targets[key]);
      return acc;
    }, {})
};
