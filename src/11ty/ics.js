// iCalendar (RFC 5545) of the talk sessions, served at /talks.ics
// (src/talks-ics.njk): one all-day event per session, past and upcoming, so a
// subscribed calendar shows the next ones as they are added to talks.json.

// TEXT values escape \ ; , and newlines (RFC 5545 3.3.11)
const escapeText = text => String(text).replace(/[\;,]/g, '\\$&').replace(/\r?\n/g, '\\n');

// Lines longer than 75 octets continue on the next line after a space (3.1)
export function fold(line) {
  const parts = [];
  let current = '';
  for (const char of line) {
    if (Buffer.byteLength(current + char) > (parts.length ? 74 : 75)) {
      parts.push(current);
      current = '';
    }
    current += char;
  }
  parts.push(current);
  return parts.join('\r\n ');
}

const day = date => date.replaceAll('-', '');

const nextDay = date => {
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
};

const slug = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function talksCalendar(talks, name) {
  const events = talks.flatMap(talk => talk.sessions.map(session => [
    'BEGIN:VEVENT',
    `UID:${session.date}-${slug(session.event)}@sylvain.dev`,
    `DTSTAMP:${day(session.date)}T000000Z`,
    `DTSTART;VALUE=DATE:${day(session.date)}`,
    `DTEND;VALUE=DATE:${day(nextDay(session.date))}`,
    `SUMMARY:${escapeText(`${talk.title} (${session.event})`)}`,
    `DESCRIPTION:${escapeText([session.slides, session.video, talk.repo].filter(Boolean).join('\n'))}`,
    ...(session.event_url || session.slides ? [`URL:${session.event_url || session.slides}`] : []),
    'END:VEVENT',
  ]));
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//sylvain.dev//talks//FR',
    'CALSCALE:GREGORIAN',
    `X-WR-CALNAME:${escapeText(name)}`,
    ...events.flat(),
    'END:VCALENDAR',
  ].map(fold).join('\r\n') + '\r\n';
}
