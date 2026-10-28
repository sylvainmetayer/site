// Shiki theme with the colours the site used for Prism: code blocks stay dark
// in both site themes (--code-bg, --code-fg, --code-muted in site.css).
const scope = (scopes, foreground, fontStyle) => ({ scope: scopes, settings: { foreground, ...(fontStyle && { fontStyle }) } });

export default {
  name: 'sylvain-dev',
  type: 'dark',
  colors: { 'editor.background': '#0a111a', 'editor.foreground': '#d6e2ee' },
  tokenColors: [
    scope(['comment', 'punctuation.definition.comment'], '#8396ab', 'italic'),
    scope(['punctuation', 'keyword.operator', 'meta.brace'], '#a9b8c8'),
    scope(['keyword', 'storage', 'keyword.control', 'meta.preprocessor'], '#c39bff'),
    scope(['string', 'string.quoted', 'markup.inserted'], '#9fd88a'),
    scope(['constant.numeric', 'constant.language', 'constant.character', 'variable.other.constant'], '#f2b56b'),
    scope(['entity.name.function', 'support.function', 'entity.name.class', 'entity.name.type', 'entity.other.attribute-name.class'], '#7cc4ff'),
    scope(['entity.name.tag', 'variable', 'support.type.property-name', 'entity.other.attribute-name', 'markup.deleted', 'entity.name.section'], '#ff9a8a'),
    scope(['support', 'markup.underline.link', 'support.type'], '#6fd6d0'),
  ],
};
