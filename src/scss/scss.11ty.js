const path = require('path');
const sass = require('sass');
const postcss = require('postcss');

/*
 * @see https://hex46.fr/posts/postcss-and-11ty/
 */
module.exports = class {

  data() {
    const scssDir = path.join(__dirname, '.');
    const rawFilepath = path.join(scssDir, 'main.scss');

    const sassRenderResult = sass.compile(rawFilepath, {
      sourceMap: true,
      style: 'compressed',
      verbose: true
    });

    const rawCss = sassRenderResult.css.toString();

    // TODO https://github.com/11ty/eleventy/issues/326#issuecomment-444127344
    // Generate a main-dark.css to handle dark theme with pagination
    return {
      permalink: '/assets/css/main.css',
      rawFilepath: rawFilepath,
      rawCss: rawCss
    }
  }

  render({ rawCss }) {
    return postcss(require('autoprefixer')({ overrideBrowserslist: "last 5 version" }))
      .process(rawCss, { from: undefined })
      .then((result) => result.css);
  }
}
