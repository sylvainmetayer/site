import Image from '@11ty/eleventy-img';
import i18n from '../../_data/i18n.js';
import { DEFAULT_LANG } from '../i18n.js';

// Light YouTube embed: {% youtube 'dQw4w9WgXcQ', 'Titre de la vidéo' %}.
// A link to the video with its thumbnail, downloaded at build time (CSP
// img-src 'self'); js/youtube.js swaps it for the youtube-nocookie player on
// click. Without JavaScript it stays a link to YouTube.
const escape = text => String(text).replace(/[&<>"]/g, char => `&#${char.codePointAt(0)};`);

export default async function youtube(id, title) {
  if (!/^[\w-]{11}$/.test(id)) throw new Error(`[youtube] identifiant invalide : ${id}`);
  const strings = i18n[this.ctx?.lang] || i18n[DEFAULT_LANG];
  const label = strings['youtube.play'].replace('{title}', title);
  const thumbnail = await Image(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`, {
    widths: [480],
    formats: ['avif', 'webp', 'jpeg'],
    outputDir: 'dist/img/',
    urlPath: '/img/',
    cacheOptions: { duration: '4w' },
  });
  const picture = Image.generateHTML(thumbnail, { alt: '', loading: 'lazy', decoding: 'async' });
  return `<div class="video-player youtube" data-youtube="${id}" data-title="${escape(title)}"><a href="https://www.youtube.com/watch?v=${id}" class="youtube-link">${picture}<span class="youtube-play" aria-hidden="true"></span><span class="visually-hidden">${escape(label)}</span></a></div>`;
}
