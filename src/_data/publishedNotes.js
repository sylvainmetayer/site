import { readdirSync, readFileSync } from 'node:fs';
import matter from 'gray-matter';
import { isPublishedNote } from '../11ty/notes.js';

// Number of published notes, read from the files: permalinks are computed
// before the collections exist, and /notes/ and its feed are only built when
// there is at least one note (src/notes-index.njk, src/notes-feed.njk).
const dir = new URL('../notes/', import.meta.url);

export default readdirSync(dir)
  .filter(file => file.endsWith('.md'))
  .map(file => matter(readFileSync(new URL(file, dir), 'utf8')).data)
  .filter(isPublishedNote)
  .length;
