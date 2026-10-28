import Fetch from '@11ty/eleventy-fetch';

// Shared links from a Karakeep list (https://karakeep.app), shown on /liens/
// with the ones typed in the CMS (links.json). Its note becomes the comment.
// Without KARAKEEP_URL, KARAKEEP_API_KEY and KARAKEEP_LIST_ID (local and
// preview builds), or if Karakeep does not answer, there are none.
const { KARAKEEP_URL, KARAKEEP_API_KEY, KARAKEEP_LIST_ID } = process.env;

export default async function karakeep() {
  if (!KARAKEEP_URL || !KARAKEEP_API_KEY || !KARAKEEP_LIST_ID) return [];
  const links = [];
  let cursor = '';
  try {
    do {
      const url = new URL(`api/v1/lists/${encodeURIComponent(KARAKEEP_LIST_ID)}/bookmarks`, KARAKEEP_URL.replace(/\/?$/, '/'));
      url.searchParams.set('limit', '100');
      url.searchParams.set('includeContent', 'false');
      if (cursor) url.searchParams.set('cursor', cursor);
      const page = await Fetch(url.href, {
        duration: '1d',
        type: 'json',
        fetchOptions: { headers: { Authorization: `Bearer ${KARAKEEP_API_KEY}` } },
      });
      for (const bookmark of page.bookmarks) {
        if (bookmark.content?.type !== 'link' || !/^https?:\/\//.test(bookmark.content.url)) continue;
        links.push({
          date: bookmark.createdAt.slice(0, 10),
          title: bookmark.title || bookmark.content.title || bookmark.content.url,
          url: bookmark.content.url,
          comment: bookmark.note || '',
        });
      }
      cursor = page.nextCursor;
    } while (cursor);
  } catch (error) {
    console.warn(`[karakeep] ${error.message}`);
    return [];
  }
  return links;
}
