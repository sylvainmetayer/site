// "@user@instance" (site.json `mastodon`) -> { user, instance, url }, or null
export function mastodonAccount(handle) {
  const match = /^@?([\w.-]+)@([\w.-]+)$/.exec(handle || '');
  if (!match) return null;
  const [, user, instance] = match;
  return { user, instance, url: `https://${instance}/@${user}` };
}
