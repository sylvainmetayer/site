import { baseSlug, entryData, isEnglishFile } from '../11ty/i18n.js';
import ogImage from '../11ty/og-image.js';
import checkPostFrontMatter from '../11ty/front-matter.js';

const isLive = post => {
  const now = new Date();
  return !post.draft && post.date && new Date(post.date) <= now;
};

// `slug.md` is the French article, `slug.en.md` its English translation
const isEnglish = data => isEnglishFile(data.page.inputPath);

// Unpublished posts get no page in production
const isPublished = data => process.env.ELEVENTY_ENV !== "production" || isLive(data);

export default {
  eleventyDataSchema: checkPostFrontMatter,
  eleventyComputed: {
    lang: data => entryData(data, 'post').lang,
    // Links a translation to its original (language switcher, hreflang)
    translationKey: data => entryData(data, 'post').translationKey,
    // Last review (`updated` front matter), a Date even when written as a quoted string
    updated: data => data.updated && new Date(data.updated),
    // A generated share image with the title, unless the front matter sets one;
    // none for unpublished posts, whose title would end up in dist/img/
    socialImage: data => data.socialImage || (isPublished(data) && ogImage({
      title: data.title,
      path: `~/articles/${baseSlug(data.page.fileSlug)}.md`,
      footer: `sylvain.dev · ${data.page.date.toISOString().slice(0, 10)}`,
    })),
    // Unpublished posts get no page in production (permalink false)
    permalink: data => {
      return isPublished(data) && `${isEnglish(data) ? '/en' : ''}/article/${baseSlug(data.page.fileSlug)}/`;
    },
    // The tag pages and their collections list the French articles only
    eleventyExcludeFromCollections: data => {
      if (!isPublished(data)) return true;
      return isEnglish(data) ? data.tags || [] : false;
    }
  }
};
