import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItFootnote from 'markdown-it-footnote';

/**
 * Markdown config
 * @see http://dirtystylus.com/2020/06/15/eleventy-markdown-and-footnotes/
 */
const markdownLibrary = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
})
  .use(markdownItAnchor, {
    // The whole heading becomes the link, so the table of contents keeps clean labels.
    permalink: markdownItAnchor.permalink.headerLink({ class: 'heading-link' }),
  })
  .use(markdownItFootnote);

markdownLibrary.renderer.rules.footnote_caption = (tokens, idx) => {
  let n = Number(tokens[idx].meta.id + 1).toString();

  if (tokens[idx].meta.subId > 0) {
    n += ":" + tokens[idx].meta.subId;
  }

  return n;
};

export default markdownLibrary;
