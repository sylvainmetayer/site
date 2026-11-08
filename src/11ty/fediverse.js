// "@user@instance" (site.json `mastodon`) -> { user, instance, url }, or null
export function mastodonAccount(handle) {
  const match = /^@?([\w.-]+)@([\w.-]+)$/.exec(handle || '');
  if (!match) return null;
  const [, user, instance] = match;
  return { user, instance, url: `https://${instance}/@${user}` };
}

// social.json links + the Mastodon and Bluesky accounts of site.json, as
// [{ label, url }]: the profile list of about.md and contact.vcf
export function socialProfiles(site, links = []) {
  const account = mastodonAccount(site.mastodon);
  return [
    ...links.map(({ label, url }) => ({ label, url })),
    ...(account ? [{ label: 'mastodon', url: account.url }] : []),
    ...(site.bluesky ? [{ label: 'bluesky', url: `https://bsky.app/profile/${site.bluesky}` }] : []),
  ];
}
