import { JSDOM } from 'jsdom';
import getSize from 'image-size';
import Image from '@11ty/eleventy-img';
import helpers from '../_data/helpers.js';

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

  // A linked image keeps pointing to the original file
  image.replaceWith(picture);
}

export default async function parseTransform(value, outputPath) {
  if (outputPath && outputPath.endsWith('.html')) {
    const DOM = new JSDOM(value, {
      resources: 'usable'
    });

    const document = DOM.window.document;
    const articleImages = [...document.querySelectorAll('main article img, .intro img')];
    const articleEmbeds = [...document.querySelectorAll('main article iframe')];

    const externalLinks = Array.from(document.querySelectorAll(`a:not([href^="${helpers.url()}"]):not([href^="#"]):not([href^="/"])`));

    externalLinks.forEach(item => {
      item.setAttribute("rel", "external");
      item.setAttribute("data-external", "");
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

    if (articleImages.length) {
      articleImages.forEach(image => {
        image.setAttribute('loading', 'lazy');

        const file = image.getAttribute('src');

        if (isLocal(file) && !OPTIMISABLE_IMAGE.test(file)) {
          const dimensions = getSize('src' + file);

          image.setAttribute('width', dimensions.width);
          image.setAttribute('height', dimensions.height);
        }

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

    // Run after the captions above, which clone the images
    const optimisableImages = [...document.querySelectorAll('main article img, .intro img')]
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

    // Code blocks and tables scroll horizontally: make them reachable with the keyboard
    document.querySelectorAll('main pre, main .prose table').forEach(block => {
      block.setAttribute('tabindex', '0');
    });

    // Header cells of Markdown tables head columns
    document.querySelectorAll('main thead th:not([scope])').forEach(cell => {
      cell.setAttribute('scope', 'col');
    });

    return '<!DOCTYPE html>\r\n' + document.documentElement.outerHTML;
  }
  return value;
};
