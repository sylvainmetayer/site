// Short notes (TIL): French only, no tags (tag pages list the articles), no
// translation. Same publishing rules as the articles (src/posts/posts.11tydata.js).
const isPublished = data => process.env.ELEVENTY_ENV !== 'production' || (!data.draft && data.page.date <= new Date());

export default {
  layout: 'layouts/note.njk',
  lang: 'fr',
  draft: false,
  eleventyComputed: {
    permalink: data => isPublished(data) && `/notes/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: data => !isPublished(data),
  },
};
