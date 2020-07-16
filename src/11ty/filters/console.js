// @see https://github.com/11ty/eleventy/issues/266#issuecomment-505359994
const stringify = require('javascript-stringify').stringify;

module.exports = function (value) {
  const output = stringify(value, null, "\t", { maxDepth: 3 });
  console.log(output);
  return '';
}
