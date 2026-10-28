// Short notes (TIL): French only, no tags (tag pages list the articles), no
// translation. Same publishing rules as the articles (src/posts/posts.11tydata.js).
import { isPublishedNote } from '../11ty/notes.js';

const isPublished = data => isPublishedNote({ draft: data.draft, date: data.page.date });

export default {
  layout: 'layouts/note.njk',
  lang: 'fr',
  draft: false,
  eleventyComputed: {
    permalink: data => isPublished(data) && `/notes/${data.page.fileSlug}/`,
    eleventyExcludeFromCollections: data => !isPublished(data),
  },
};
