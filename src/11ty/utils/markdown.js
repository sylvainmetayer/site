const markdownItFootnote = require("markdown-it-footnote");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAttrs = require('markdown-it-attrs');
const markdownIt = require('markdown-it');

/**
 * Markdown config
 * @see http://dirtystylus.com/2020/06/15/eleventy-markdown-and-footnotes/
 */
let markdownLibrary = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
})
  .use(markdownItAttrs)
  .use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink({
      renderAttrs: () => {
        return { 'aria-hidden': true }
      }
    })
  })
  .use(markdownItFootnote);

markdownLibrary.renderer.rules.footnote_caption = (tokens, idx) => {
  let n = Number(tokens[idx].meta.id + 1).toString();

  if (tokens[idx].meta.subId > 0) {
    n += ":" + tokens[idx].meta.subId;
  }

  return n;
};

module.exports = markdownLibrary;
