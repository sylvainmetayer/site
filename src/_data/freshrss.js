// Followed feeds (FollowSpec, src/following-opml.njk): the OPML of a FreshRSS
// user query shared as OPML (`f=opml`), e.g. the "IT" category. Without
// FRESHRSS_OPML_URL (local and preview builds), or if FreshRSS does not answer
// with an OPML, it is '' and /.well-known/following.opml is not built. The
// instance sits behind Pangolin: FRESHRSS_ACCESS_TOKEN_ID and
// FRESHRSS_ACCESS_TOKEN, when set, are sent as its access token headers.
// No eleventy-fetch cache: it would keep a login page for a day, and one
// request per build is enough.
const { FRESHRSS_OPML_URL, FRESHRSS_ACCESS_TOKEN_ID, FRESHRSS_ACCESS_TOKEN } = process.env;
const headers = FRESHRSS_ACCESS_TOKEN_ID && FRESHRSS_ACCESS_TOKEN
  ? { 'P-Access-Token-Id': FRESHRSS_ACCESS_TOKEN_ID, 'P-Access-Token': FRESHRSS_ACCESS_TOKEN }
  : {};

export default async function freshrss() {
  if (!FRESHRSS_OPML_URL) return '';
  try {
    // The URL carries the FreshRSS token: errors give the status, never the URL
    const response = await fetch(FRESHRSS_OPML_URL, { headers, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const opml = await response.text();
    if (!/<opml[\s>]/.test(opml)) throw new Error('not an OPML document');
    return opml;
  } catch (error) {
    console.warn(`[freshrss] ${error.name === 'TimeoutError' ? 'timeout' : error.message}`);
    return '';
  }
}
