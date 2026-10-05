const isLive = post => {
  const now = new Date();
  return !post.draft && post.date && new Date(post.date) <= now;
};

// `slug.md` is the French article, `slug.en.md` its English translation
// (Sveltia CMS i18n, multiple_files)
const isEnglish = data => data.page.inputPath.endsWith('.en.md');
const slugOf = data => data.page.fileSlug.replace(/\.en$/, '');

export default {
  eleventyComputed: {
    lang: data => (isEnglish(data) ? 'en' : 'fr'),
    // Links a translation to its original (language switcher, hreflang)
    translationKey: data => `post:${slugOf(data)}`,
    // Unpublished posts get no page in production (permalink false)
    permalink: data => {
      const publish = process.env.ELEVENTY_ENV !== "production" || isLive(data);
      return publish && `${isEnglish(data) ? '/en' : ''}/article/${slugOf(data)}/`;
    },
    // The tag pages and their collections list the French articles only
    eleventyExcludeFromCollections: data => {
      if (process.env.ELEVENTY_ENV === "production" && !isLive(data)) return true;
      return isEnglish(data) ? data.tags || [] : false;
    }
  }
};
