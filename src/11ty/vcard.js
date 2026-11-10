import { socialProfiles } from './fediverse.js';

// RFC 6350 §3.4: backslash, comma, semicolon and newline escaped in text values
const text = value => String(value).replace(/[\\,;]/g, '\\$&').replace(/\n/g, '\\n');

// site.json + social.json links -> vCard 4.0, CRLF line endings as RFC 6350 requires.
// shortcut: lines are not folded at 75 octets, most readers accept long lines; fold if one complains.
export function vcard(site, links = []) {
  const [given, ...family] = site.authorName.split(' ');
  return [
    'BEGIN:VCARD',
    'VERSION:4.0',
    `FN:${text(site.authorName)}`,
    `N:${text(family.join(' '))};${text(given)};;;`,
    site.role && `TITLE:${text(site.role)}`,
    site.location && `ADR;TYPE=home:;;;${text(site.location)};;;${text(site.country || '')}`,
    site.authorEmail && `EMAIL;PREF=1:${site.authorEmail}`,
    `URL;PREF=1:${site.url}`,
    `PHOTO:${new URL('/images/profile.jpg', site.url).href}`,
    site.shortDesc && `NOTE:${text(site.shortDesc)}`,
    ...socialProfiles(site, links).flatMap(({ label, url }) => {
      // TYPE is a token: "dev.to" -> "devto", dropped if nothing is left
      const type = label.replace(/[^\w-]/g, '');
      const param = type ? `;TYPE=${type}` : '';
      // X-SOCIALPROFILE is only read by Apple Contacts: the same link as a plain
      // URL shows up as a website everywhere else (Android, Google Contacts)
      return [`X-SOCIALPROFILE${param}:${url}`, `URL${param}:${url}`];
    }),
    'END:VCARD',
  ].filter(Boolean).join('\r\n') + '\r\n';
}
