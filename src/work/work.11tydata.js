// Data only, shown by other pages: no page of their own. `slug.en.md` is the
// English translation of `slug.md` (Sveltia CMS i18n, multiple_files).
const isEnglish = data => data.page.inputPath.endsWith('.en.md');

export default {
  permalink: false,
  eleventyComputed: {
    lang: data => (isEnglish(data) ? 'en' : 'fr'),
    translationKey: data => `work:${data.page.fileSlug.replace(/\.en$/, '')}`,
  },
};
