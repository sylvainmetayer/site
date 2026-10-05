// Data only, shown by other pages: no page of their own. `slug.en.md` is the
// English translation of `slug.md` (src/11ty/i18n.js).
import { entryData } from '../11ty/i18n.js';

export default {
  permalink: false,
  eleventyComputed: {
    lang: data => entryData(data, 'projets').lang,
    translationKey: data => entryData(data, 'projets').translationKey,
  },
};
