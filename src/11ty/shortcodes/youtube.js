import Image from '@11ty/eleventy-img';
import i18n from '../../_data/i18n.js';
import { DEFAULT_LANG } from '../i18n.js';

// Light YouTube embed: {% youtube 'dQw4w9WgXcQ', 'Titre de la vidéo', 212 %}, the last
// argument being the length of the video in seconds (optional), shown on the thumbnail.
// A link to the video with its thumbnail, downloaded at build time (CSP
// img-src 'self'); js/youtube.js swaps it for the youtube-nocookie player on
// click. Without JavaScript it stays a link to YouTube.
const escape = text => String(text).replace(/[&<>"]/g, char => `&#${char.codePointAt(0)};`);

// 2727 -> { clock: '45:27', words: '45 min' }; 10190 -> { clock: '2:49:50', words: '2 h 50 min' }
export function videoLength(seconds) {
  const pad = number => String(number).padStart(2, '0');
  const [h, m, s] = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60];
  const minutes = Math.round(seconds / 60);
  return {
    clock: h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`,
    words: minutes >= 60 ? `${Math.floor(minutes / 60)} h ${pad(minutes % 60)} min` : `${minutes || 1} min`,
  };
}

export default async function youtube(id, title, seconds) {
  if (!/^[\w-]{11}$/.test(id)) throw new Error(`[youtube] identifiant invalide : ${id}`);
  const strings = i18n[this.ctx?.lang] || i18n[DEFAULT_LANG];
  const length = Number.isInteger(seconds) && seconds > 0 ? videoLength(seconds) : null;
  const label = strings['youtube.play'].replace('{title}', () => title)
    + (length ? strings['youtube.length'].replace('{length}', length.words) : '');
  const url = `https://www.youtube.com/watch?v=${id}`;
  let thumbnail;
  try {
    thumbnail = await Image(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`, {
      widths: [480],
      formats: ['avif', 'webp', 'jpeg'],
      outputDir: 'dist/img/',
      urlPath: '/img/',
      cacheOptions: { duration: '4w' },
    });
  } catch (error) {
    // No network: a plain link, the article still builds (like baseline.js)
    console.warn(`[youtube] ${id} : ${error.message}`);
    return `<p><a href="${url}">${escape(title)}</a></p>`;
  }
  const picture = Image.generateHTML(thumbnail, { alt: '', loading: 'lazy', decoding: 'async' });
  return `<div class="video-player youtube" data-youtube="${id}" data-title="${escape(title)}"><a href="${url}" class="youtube-link">${picture}<span class="youtube-play" aria-hidden="true"></span>${length ? `<span class="youtube-length" aria-hidden="true">${length.clock}</span>` : ''}<span class="visually-hidden">${escape(label)}</span></a></div>`;
}
