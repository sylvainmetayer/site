// Publishing rule of the notes (src/notes/), shared by their directory data
// and src/_data/publishedNotes.js: drafts and future dates are built only
// outside production, like the articles.
export const isPublishedNote = ({ draft, date }) =>
  process.env.ELEVENTY_ENV !== 'production' || (!draft && new Date(date) <= new Date());
