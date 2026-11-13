import Fetch from '@11ty/eleventy-fetch';
import { concerts } from '../11ty/concerts.js';

// Concerts marked "I was there" on setlist.fm (https://api.setlist.fm), shown
// on /concerts/. Without SETLISTFM_API_KEY and SETLISTFM_USER (local and
// preview builds), or if setlist.fm does not answer, there are none.
const { SETLISTFM_API_KEY, SETLISTFM_USER } = process.env;

export default async function setlistfm() {
  if (!SETLISTFM_API_KEY || !SETLISTFM_USER) return [];
  const setlists = [];
  try {
    let total = Infinity;
    for (let page = 1; setlists.length < total; page++) {
      const body = await Fetch(`https://api.setlist.fm/rest/1.0/user/${encodeURIComponent(SETLISTFM_USER)}/attended?p=${page}`, {
        duration: '1d',
        type: 'json',
        fetchOptions: { headers: { 'x-api-key': SETLISTFM_API_KEY, Accept: 'application/json' } },
      });
      if (!body.setlist?.length) break;
      total = body.total;
      setlists.push(...body.setlist);
    }
  } catch (error) {
    // setlist.fm answers 404 while no concert is marked
    console.warn(`[setlistfm] ${error.message}`);
    return [];
  }
  return concerts(setlists);
}
