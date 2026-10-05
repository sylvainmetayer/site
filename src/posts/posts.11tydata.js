import { baseSlug, entryData, isEnglishFile } from '../11ty/i18n.js';

const isLive = post => {
  const now = new Date();
  return !post.draft && post.date && new Date(post.date) <= now;
};

// `slug.md` is the French article, `slug.en.md` its English translation
const isEnglish = data => isEnglishFile(data.page.inputPath);

export default {
  eleventyComputed: {
    lang: data => entryData(data, 'post').lang,
    // Links a translation to its original (language switcher, hreflang)
    translationKey: data => entryData(data, 'post').translationKey,
    // Last review (`updated` front matter), a Date even when written as a quoted string
    updated: data => data.updated && new Date(data.updated),
    // Unpublished posts get no page in production (permalink false)
    permalink: data => {
      const publish = process.env.ELEVENTY_ENV !== "production" || isLive(data);
      return publish && `${isEnglish(data) ? '/en' : ''}/article/${baseSlug(data.page.fileSlug)}/`;
    },
    // The tag pages and their collections list the French articles only
    eleventyExcludeFromCollections: data => {
      if (process.env.ELEVENTY_ENV === "production" && !isLive(data)) return true;
      return isEnglish(data) ? data.tags || [] : false;
    }
  }
};
