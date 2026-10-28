import Image from '@11ty/eleventy-img';

// Share image of an article without `socialImage`: its title on the colours of
// the site, rendered from SVG to PNG at build time (sharp, via eleventy-img).
// Hashed file names under /img/, cached as immutable like the article images.
// shortcut: fonts come from the build machine (fontconfig), sans-serif fallback; embed one if the render looks off.
const WIDTH = 1200;
const HEIGHT = 630;
const MAX_CHARS = 30;
const MAX_LINES = 4;

const escapeXml = text => String(text).replace(/[&<>"']/g, char => `&#${char.codePointAt(0)};`);

// Greedy word wrap; the last line ends with … when the title is longer
export function wrap(text, maxChars = MAX_CHARS, maxLines = MAX_LINES) {
  const lines = [];
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const last = lines.at(-1);
    if (last !== undefined && (last + ' ' + word).length <= maxChars) lines[lines.length - 1] = last + ' ' + word;
    else lines.push(word);
  }
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] += ' …';
  return kept;
}

function svg({ title, path, footer }) {
  const lines = wrap(title);
  const lineHeight = 78;
  const top = 260 - ((lines.length - 1) * lineHeight) / 2;
  const tspans = lines.map((line, i) => `<tspan x="80" y="${top + i * lineHeight}">${escapeXml(line)}</tspan>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="100%" height="100%" fill="#0e1621"/>
  <rect x="0" y="0" width="12" height="100%" fill="#7ccf8a"/>
  <text x="80" y="110" fill="#62acff" font-family="JetBrains Mono, DejaVu Sans Mono, monospace" font-size="30">${escapeXml(path)}</text>
  <text fill="#dbe3ec" font-family="IBM Plex Sans, DejaVu Sans, sans-serif" font-size="64" font-weight="600">${tspans}</text>
  <text x="80" y="560" fill="#8a9cb0" font-family="JetBrains Mono, DejaVu Sans Mono, monospace" font-size="28">${escapeXml(footer)}</text>
</svg>`;
}

// URL of the generated PNG: /img/<hash>-1200.png
export default async function ogImage(data) {
  const metadata = await Image(Buffer.from(svg(data)), {
    widths: [WIDTH],
    formats: ['png'],
    outputDir: 'dist/img/',
    urlPath: '/img/',
  });
  return metadata.png[0].url;
}
