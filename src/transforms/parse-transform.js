import { JSDOM } from 'jsdom';
import getSize from 'image-size';
import helpers from '../_data/helpers.js';

export default function (value, outputPath) {
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

        // TODO Handle video
        if (file.indexOf('http') < 0 && file.indexOf("mp4") < 0) {
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
