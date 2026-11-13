// The feeds of an OPML document (src/_data/freshrss.js), sorted by title, for
// /blogroll/: [{ title, url, feed }]. `url` is the site, or the feed without one.
import { JSDOM } from 'jsdom';

export function blogroll(opml) {
  if (!opml) return [];
  const { document } = new JSDOM(opml, { contentType: 'text/xml' }).window;
  return [...document.querySelectorAll('outline[xmlUrl]')]
    .map(outline => ({
      title: outline.getAttribute('title') || outline.getAttribute('text'),
      url: outline.getAttribute('htmlUrl') || outline.getAttribute('xmlUrl'),
      feed: outline.getAttribute('xmlUrl'),
    }))
    // Only web links: the OPML comes from outside the repository
    .filter(({ title, url, feed }) => title && /^https?:\/\//.test(url) && /^https?:\/\//.test(feed))
    .sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}
