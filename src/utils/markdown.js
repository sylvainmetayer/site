import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItFootnote from 'markdown-it-footnote';
import shiki from '@shikijs/markdown-it';
import shikiTheme from './shiki-theme.js';

/**
 * Markdown config
 * @see http://dirtystylus.com/2020/06/15/eleventy-markdown-and-footnotes/
 */
// Raw HTML in posts (<video>, <details>…): the content is written by the site owner
// only. Sonar reports html: true on the call, hence NOSONAR there.
const markdownLibrary = markdownIt({ // NOSONAR
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
})
  .use(markdownItAnchor, {
    // The whole heading becomes the link, so the table of contents keeps clean labels.
    permalink: markdownItAnchor.permalink.headerLink({ class: 'heading-link' }),
  })
  .use(markdownItFootnote)
  // Highlighted at build time: no client-side script, inline colours (style-src 'unsafe-inline')
  .use(await shiki({
    theme: shikiTheme,
    langs: ['bash', 'shell', 'erb', 'ini', 'js', 'ts', 'json', 'yaml', 'nginx', 'html', 'css', 'python', 'php', 'java', 'sql', 'dockerfile', 'hcl', 'markdown'],
    fallbackLanguage: 'text',
    transformers: [{
      // The background comes from site.css (--code-bg), like the other code blocks
      pre(node) {
        delete node.properties.style;
        delete node.properties.tabindex;
      },
    }],
  }));

markdownLibrary.renderer.rules.footnote_caption = (tokens, idx) => {
  let n = Number(tokens[idx].meta.id + 1).toString();

  if (tokens[idx].meta.subId > 0) {
    n += ":" + tokens[idx].meta.subId;
  }

  return n;
};

// Accessible footnotes: the bare number and the ↩ arrow mean nothing out of context
const rules = markdownLibrary.renderer.rules;
const renderRef = rules.footnote_ref;
const renderAnchor = rules.footnote_anchor;
const renderBlockOpen = rules.footnote_block_open;

rules.footnote_ref = (tokens, idx, options, env, slf) =>
  renderRef(tokens, idx, options, env, slf).replace(/(<a [^>]*>)/, '$1<span class="visually-hidden">note </span>');

rules.footnote_anchor = (tokens, idx, options, env, slf) => {
  const n = slf.rules.footnote_caption(tokens, idx, options, env, slf);
  return renderAnchor(tokens, idx, options, env, slf)
    .replace('class="footnote-backref"', `class="footnote-backref" aria-label="Retour au texte (note ${n})"`);
};

rules.footnote_block_open = (tokens, idx, options, env, slf) =>
  renderBlockOpen(tokens, idx, options, env, slf).replace('<section class="footnotes">', '<section class="footnotes" aria-label="Notes">');

export default markdownLibrary;
