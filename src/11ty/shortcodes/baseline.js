import Fetch from '@11ty/eleventy-fetch';
import i18n from '../../_data/i18n.js';
import { DEFAULT_LANG } from '../i18n.js';

// Browser support of a web platform feature, from webstatus.dev at build time:
// {% baseline 'container-queries' %}. The id is the one in the URL of
// https://webstatus.dev/features/<id>. Rendered as plain HTML, so no third-party
// script (CSP) and no request from the reader's browser.
const STATUSES = new Set(['widely', 'newly', 'limited']);

const escape = text => String(text).replace(/[&<>"]/g, char => `&#${char.codePointAt(0)};`);

export default async function baseline(id) {
  const strings = i18n[this.ctx?.lang] || i18n[DEFAULT_LANG];
  const url = `https://webstatus.dev/features/${encodeURIComponent(id)}`;
  let feature;
  try {
    feature = await Fetch(`https://api.webstatus.dev/v1/features/${encodeURIComponent(id)}`, { duration: '1w', type: 'json' });
  } catch (error) {
    // No network or unknown id: a plain link, the article still builds
    console.warn(`[baseline] ${id} : ${error.message}`);
    return `<a href="${url}">${escape(id)}</a>`;
  }
  const status = STATUSES.has(feature.baseline?.status) ? feature.baseline.status : 'limited';
  const date = status === 'widely' ? feature.baseline.high_date : feature.baseline?.low_date;
  const label = strings[`baseline.${status}`].replace('{date}', (date || '').slice(0, 7));
  return `<span class="baseline baseline-${status}"><a href="${url}">${escape(feature.name || id)}</a> · <span>${escape(label)}</span></span>`;
}
