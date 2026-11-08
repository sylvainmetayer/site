import { mastodonAccount } from './fediverse.js';

// RFC 6350 §3.4: backslash, comma, semicolon and newline escaped in text values
const text = value => String(value).replace(/[\\,;]/g, '\\$&').replace(/\n/g, '\\n');

// site.json + social.json links -> vCard 4.0, CRLF line endings as RFC 6350 requires.
// shortcut: lines are not folded at 75 octets, most readers accept long lines; fold if one complains.
export function vcard(site, links = []) {
  const [given, ...family] = site.authorName.split(' ');
  const account = mastodonAccount(site.mastodon);
  const profiles = [
    ...links.map(link => [link.label, link.url]),
    ...(account ? [['mastodon', account.url]] : []),
    ...(site.bluesky ? [['bluesky', `https://bsky.app/profile/${site.bluesky}`]] : []),
  ];
  return [
    'BEGIN:VCARD',
    'VERSION:4.0',
    `FN:${text(site.authorName)}`,
    `N:${text(family.join(' '))};${text(given)};;;`,
    site.role && `TITLE:${text(site.role)}`,
    site.location && `ADR;TYPE=home:;;;${text(site.location)};;;France`,
    site.authorEmail && `EMAIL;PREF=1:${site.authorEmail}`,
    `URL;PREF=1:${site.url}`,
    `PHOTO:${new URL('/images/profile.png', site.url).href}`,
    site.shortDesc && `NOTE:${text(site.shortDesc)}`,
    ...profiles.map(([label, url]) => `X-SOCIALPROFILE;TYPE=${label.replace(/[^\w-]/g, '')}:${url}`),
    'END:VCARD',
  ].filter(Boolean).join('\r\n') + '\r\n';
}
