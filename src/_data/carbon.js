import Fetch from '@11ty/eleventy-fetch';

// CO2 per visit of the home page, e.g. "0.01 g (A+)": the badge that
// scripts/lighthouse-badges.mjs publishes every morning on the `badges` branch.
// Shown on /green/; null when GitHub does not answer.
export default async function carbon() {
  try {
    const badge = await Fetch('https://raw.githubusercontent.com/sylvainmetayer/site/badges/carbon.json', { duration: '1d', type: 'json' });
    return typeof badge.message === 'string' ? badge.message : null;
  } catch (error) {
    console.warn(`[carbon] ${error.message}`);
    return null;
  }
}
