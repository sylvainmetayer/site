import Fetch from '@11ty/eleventy-fetch';

// Most visited pages over the last 30 days, from Cloudflare Web Analytics
// (GraphQL API), for the "most read" list of the home page. Needs
// CF_ANALYTICS_TOKEN (Account Analytics: Read), CF_ACCOUNT_ID and
// CF_ANALYTICS_SITE_TAG; without them, or if the API fails, the list is empty.
// ['slug', …]: article slugs, French and English views added up, most visited first
const { CF_ANALYTICS_TOKEN, CF_ACCOUNT_ID, CF_ANALYTICS_SITE_TAG } = process.env;

const QUERY = `query ($account: String!, $site: String!, $since: Date!) {
  viewer {
    accounts(filter: { accountTag: $account }) {
      rumPageloadEventsAdaptiveGroups(limit: 50, filter: { siteTag: $site, date_geq: $since }, orderBy: [count_DESC]) {
        count
        dimensions { requestPath }
      }
    }
  }
}`;

export default async function popularPaths() {
  if (!CF_ANALYTICS_TOKEN || !CF_ACCOUNT_ID || !CF_ANALYTICS_SITE_TAG) return [];
  const since = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  try {
    const response = await Fetch(`https://api.cloudflare.com/client/v4/graphql?since=${since}`, {
      duration: '1d',
      type: 'json',
      fetchOptions: {
        method: 'POST',
        headers: { Authorization: `Bearer ${CF_ANALYTICS_TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: QUERY, variables: { account: CF_ACCOUNT_ID, site: CF_ANALYTICS_SITE_TAG, since } }),
      },
    });
    if (response.errors?.length) throw new Error(response.errors[0].message);
    const views = new Map();
    for (const { count, dimensions } of response.data.viewer.accounts[0].rumPageloadEventsAdaptiveGroups) {
      const slug = dimensions.requestPath.match(/^\/(?:en\/)?article\/([^/]+)\/?$/)?.[1];
      if (slug) views.set(slug, (views.get(slug) || 0) + count);
    }
    return [...views].sort((a, b) => b[1] - a[1]).map(([slug]) => slug);
  } catch (error) {
    console.warn(`[popularPaths] ${error.message}`);
    return [];
  }
}
