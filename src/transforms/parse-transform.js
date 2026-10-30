import { JSDOM } from 'jsdom';
import { imageSizeFromFile } from 'image-size/fromFile';
import Image from '@11ty/eleventy-img';
// Installed with eleventy-img: a placeholder needs no file or cache entry
import sharp from 'sharp';
import helpers from '../_data/helpers.js';
import site from '../_data/site.json' with { type: 'json' };
import emojis from '../_data/emojis.json' with { type: 'json' };
import abbreviations from '../_data/abbreviations.json' with { type: 'json' };
import { markAbbreviations } from './abbreviations.js';

// Article images are served as AVIF and WebP, with the original format as a
// fallback, in widths that cover the text column (--measure: 44rem) up to 2x.
// Hashed file names under /img/ are cached as immutable (_headers).
const IMAGE_OPTIONS = {
  widths: [400, 800, 1400],
  formats: ['avif', 'webp', 'auto'],
  outputDir: 'dist/img/',
  urlPath: '/img/',
};
const IMAGE_SIZES = '(min-width: 46rem) 44rem, 100vw';
// Animated GIFs and SVGs are left as they are
const OPTIMISABLE_IMAGE = /\.(jpe?g|png|webp)$/i;

const isLocal = src => src.startsWith('/') && !src.startsWith('//');

// Every character as a decimal entity: browsers show the address as usual,
// scrapers that look for "mailto:" or "@" in the raw HTML do not find it
const toEntities = text => [...text].map(char => `&#${char.codePointAt(0)};`).join('');
const MAIL_LINK = 'mailto:' + site.authorEmail;

// An emoji, with its variation selector and ZWJ sequence if any
const EMOJI = /\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/gu;

// Emojis in the text become role="img" with a name in the language of the page
// (src/_data/emojis.json): screen readers name them alike, whatever the platform.
// Not in code, not twice, not in a link or button an aria-label already names
// (an aria-label on a section or landmark does not replace its content).
function labelEmojis(document) {
  const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
  const walker = document.createTreeWalker(document.querySelector('main') || document.body, 4 /* NodeFilter.SHOW_TEXT */);
  const nodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (EMOJI.test(node.data) && !node.parentElement.closest('pre, code, script, style, [role="img"], [aria-hidden="true"], a[aria-label], button[aria-label]')) nodes.push(node);
    EMOJI.lastIndex = 0;
  }
  nodes.forEach(node => {
    const fragment = document.createDocumentFragment();
    let last = 0;
    for (const match of node.data.matchAll(EMOJI)) {
      const name = emojis[match[0].replace(/\uFE0F/g, '')]?.[lang];
      if (!name) {
        console.warn(`[emojis] nom manquant pour ${match[0]} dans src/_data/emojis.json`);
        continue;
      }
      fragment.append(node.data.slice(last, match.index));
      const span = document.createElement('span');
      span.setAttribute('role', 'img');
      span.setAttribute('aria-label', name);
      span.textContent = match[0];
      fragment.append(span);
      last = match.index + match[0].length;
    }
    if (last === 0) return;
    fragment.append(node.data.slice(last));
    node.replaceWith(fragment);
  });
}

const srcset = images => images.map(image => image.srcset).join(', ');

// Replaces an <img> with a <picture> listing the generated formats and widths
async function optimiseImage(document, image) {
  const metadata = await Image('src' + image.getAttribute('src'), IMAGE_OPTIONS);
  const [fallback] = Object.entries(metadata)
    .filter(([format]) => format !== 'avif' && format !== 'webp')
    .map(([, images]) => images);
  const largest = (fallback || metadata.webp).at(-1);

  const picture = document.createElement('picture');
  ['avif', 'webp'].forEach(format => {
    // A WebP original has no other fallback than its WebP versions, set on <img>
    if (!metadata[format] || (format === 'webp' && !fallback)) return;
    const source = document.createElement('source');
    source.setAttribute('type', metadata[format][0].sourceType);
    source.setAttribute('srcset', srcset(metadata[format]));
    source.setAttribute('sizes', IMAGE_SIZES);
    picture.appendChild(source);
  });

  const img = image.cloneNode(true);
  img.setAttribute('src', largest.url);
  img.setAttribute('srcset', srcset(fallback || metadata.webp));
  img.setAttribute('sizes', IMAGE_SIZES);
  img.setAttribute('width', largest.width);
  img.setAttribute('height', largest.height);
  img.setAttribute('decoding', 'async');
  picture.appendChild(img);

  // Blurred placeholder (LQIP): a 16px wide copy inlined as a data: URI, under
  // the image until it loads. A separate <img>, as html-validate forbids inline styles.
  // sharp drops the metadata (ICC profile included): about 150 bytes instead of 3 kB.
  // Not under a transparent image: the blur would show through it once loaded.
  const source = sharp('src' + image.getAttribute('src'));
  if ((await source.metadata()).hasAlpha) {
    image.replaceWith(picture);
    return;
  }
  const tiny = await source.resize(16).webp({ quality: 40 }).toBuffer();
  const placeholder = document.createElement('img');
  placeholder.className = 'lqip';
  placeholder.setAttribute('src', `data:image/webp;base64,${tiny.toString('base64')}`);
  placeholder.setAttribute('alt', '');
  placeholder.setAttribute('aria-hidden', 'true');
  const wrapper = document.createElement('span');
  wrapper.className = 'lqip-wrap';
  wrapper.append(placeholder, picture);

  // A linked image keeps pointing to the original file
  image.replaceWith(wrapper);
}

export default async function parseTransform(value, outputPath) {
  // outputPath is false for pages without permalink
  if (typeof outputPath === 'string' && outputPath.endsWith('.html')) {
    const DOM = new JSDOM(value, {
      resources: 'usable'
    });

    const document = DOM.window.document;
    // The thumbnails of {% youtube %} are already optimised
    const notOptimised = image => !image.closest('.youtube');
    const articleImages = [...document.querySelectorAll('main article img, .intro img')].filter(notOptimised);
    const articleEmbeds = [...document.querySelectorAll('main article iframe')];

    const externalLinks = Array.from(document.querySelectorAll(`a:not([href^="${helpers.url()}"]):not([href^="#"]):not([href^="/"])`));

    externalLinks.forEach(item => {
      // Added to rel=me (h-card profiles), not in place of it
      item.relList.add("external");
      item.dataset.external = "";
    })


    // Add class to a element when their is an image as direct child.
    const imagesWithLink = [...document.querySelectorAll("a:not([class])>img")];
    if (imagesWithLink.length > 0) {
      imagesWithLink.forEach(image => {
        const newLink = image.parentNode;
        newLink.classList.add("img_link");
        image.parentNode.replaceWith(newLink);
      });
    }

    // Images left as they are (animated GIFs, SVGs) get their dimensions from
    // the file; the optimised ones get them from eleventy-img further down
    await Promise.all(articleImages
      .filter(image => isLocal(image.getAttribute('src')) && !OPTIMISABLE_IMAGE.test(image.getAttribute('src')))
      .map(async image => {
        const { width, height } = await imageSizeFromFile('src' + image.getAttribute('src'));
        image.setAttribute('width', width);
        image.setAttribute('height', height);
      }));

    if (articleImages.length) {
      articleImages.forEach(image => {
        image.setAttribute('loading', 'lazy');

        // If an image has a title it means that the user added a caption
        // so replace the image with a figure containing that image and a caption
        if (image.hasAttribute('title')) {
          const figure = document.createElement('figure');
          const figCaption = document.createElement('figcaption');

          figCaption.innerHTML = image.getAttribute('title');

          image.removeAttribute('title');

          figure.appendChild(image.cloneNode(true));
          figure.appendChild(figCaption);

          // Markdown wraps a lone image in <p>, which cannot hold a <figure>: replace the paragraph
          const parent = image.parentNode;
          if (parent.tagName === 'P' && parent.textContent.trim() === '' && parent.children.length === 1) {
            parent.replaceWith(figure);
          } else {
            image.replaceWith(figure);
          }
        }
      });
    }

    // Captions numbered in reading order: "Figure 2 · …" (the same word in French
    // and English), so the text can refer to a figure by its number
    document.querySelectorAll('main article .prose figure > figcaption').forEach((caption, index) => {
      const number = document.createElement('span');
      number.className = 'figure-number';
      number.textContent = `Figure ${index + 1}`;
      caption.prepend(number, ' · ');
    });

    // Run after the captions above, which clone the images
    const optimisableImages = [...document.querySelectorAll('main article img, .intro img')]
      .filter(notOptimised)
      .filter(image => isLocal(image.getAttribute('src')) && OPTIMISABLE_IMAGE.test(image.getAttribute('src')));
    await Promise.all(optimisableImages.map(image => optimiseImage(document, image)));

    // Look for videos are wrap them in a container element
    if (articleEmbeds.length) {
      articleEmbeds.forEach(embed => {
        if (embed.hasAttribute('allowfullscreen')) {
          const player = document.createElement('div');

          player.classList.add('video-player');

          player.appendChild(embed.cloneNode(true));

          embed.replaceWith(player);
        }
      });
    }

    // Sidenotes: a copy of each footnote next to its reference, shown in the left
    // margin on wide screens (site.css). Hidden from assistive technologies,
    // which keep the footnotes at the end of the article.
    document.querySelectorAll('main .prose sup.footnote-ref > a[href^="#fn"]').forEach(ref => {
      const note = document.getElementById(ref.getAttribute('href').slice(1));
      if (!note) return;
      const sidenote = document.createElement('span');
      sidenote.className = 'sidenote';
      sidenote.setAttribute('aria-hidden', 'true');
      // The number from href="#fn2": the text of a repeated reference is "2:1"
      sidenote.innerHTML = `<span class="sidenote-number">${note.id.replace(/\D/g, '')}</span> ${[...note.children].map(child => child.innerHTML).join(' ')}`;
      sidenote.querySelectorAll('.footnote-backref').forEach(backref => backref.remove());
      sidenote.querySelectorAll('a, button').forEach(link => link.setAttribute('tabindex', '-1'));
      ref.parentNode.after(sidenote);
    });

    labelEmojis(document);
    markAbbreviations(document, abbreviations);

    // A paragraph "Tableau : …" (or "Table: …" in English) right before a table
    // becomes the <caption> of that table
    document.querySelectorAll('main .prose table').forEach(table => {
      const paragraph = table.previousElementSibling;
      const caption = paragraph?.tagName === 'P' && paragraph.innerHTML.match(/^Table(?:au)?(?:\s|&nbsp;)?:\s*([\s\S]+)$/);
      if (!caption) return;
      table.prepend(Object.assign(document.createElement('caption'), { innerHTML: caption[1].trim() }));
      paragraph.remove();
    });

    // Code blocks and tables scroll horizontally: make them reachable with the keyboard
    document.querySelectorAll('main pre, main .prose table').forEach(block => {
      block.setAttribute('tabindex', '0');
    });

    // Header cells of Markdown tables head columns
    document.querySelectorAll('main thead th:not([scope])').forEach(cell => {
      cell.setAttribute('scope', 'col');
    });

    // After serialising: JSDOM would write the entities back as characters
    const html = document.documentElement.outerHTML
      .replaceAll(MAIL_LINK, toEntities(MAIL_LINK))
      .replaceAll(site.authorEmail, toEntities(site.authorEmail));
    return '<!DOCTYPE html>\r\n' + html;
  }
  return value;
};
