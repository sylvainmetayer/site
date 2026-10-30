// The first occurrence of each acronym of src/_data/abbreviations.json in the
// <main> of a page becomes <abbr title="…">, explained in the language of its
// text (closest lang attribute). Not in code, nor where the text is hidden or
// already explained, nor on the terms of the glossary itself. The same list makes the glossary page (/glossaire/).
const SKIPPED = 'pre, code, kbd, samp, script, style, abbr, [aria-hidden="true"], .visually-hidden, .glossary dt';

const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function markAbbreviations(document, glossary) {
  const root = document.querySelector('main');
  const keys = Object.keys(glossary);
  if (!root || !keys.length) return;
  // Whole words only: "PHP" but not "PHP7" nor "MÉTAYER" for "TAYER"
  const pattern = new RegExp(`(?<![\\p{L}\\d])(${keys.sort((a, b) => b.length - a.length).map(escape).join('|')})(?![\\p{L}\\d])`, 'gu');

  const walker = document.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */);
  const nodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.parentElement.closest(SKIPPED)) nodes.push(node);
  }

  const done = new Set();
  for (const node of nodes) {
    if (done.size === keys.length) break;
    const lang = node.parentElement.closest('[lang]')?.getAttribute('lang')?.startsWith('en') ? 'en' : 'fr';
    const fragment = document.createDocumentFragment();
    let last = 0;
    for (const match of node.data.matchAll(pattern)) {
      if (done.has(match[1])) continue;
      done.add(match[1]);
      const abbr = document.createElement('abbr');
      abbr.title = glossary[match[1]][lang];
      abbr.textContent = match[1];
      fragment.append(node.data.slice(last, match.index), abbr);
      last = match.index + match[1].length;
    }
    if (last === 0) continue;
    fragment.append(node.data.slice(last));
    node.replaceWith(fragment);
  }
}
