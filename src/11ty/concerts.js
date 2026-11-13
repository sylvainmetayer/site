// One setlist per artist on setlist.fm: grouped into one concert per day and
// venue, newest first. The act with the longest set is taken as the headliner.
export function concerts(setlists) {
  const byShow = new Map();
  for (const setlist of setlists) {
    const [day, month, year] = setlist.eventDate.split('-');
    const date = `${year}-${month}-${day}`;
    const key = `${date} ${setlist.venue.id}`;
    if (!byShow.has(key)) byShow.set(key, { date, year, venue: setlist.venue.name, city: setlist.venue.city.name, artists: [] });
    byShow.get(key).artists.push({
      name: setlist.artist.name,
      url: setlist.url,
      songs: (setlist.sets?.set ?? []).reduce((count, set) => count + set.song.filter(song => !song.tape).length, 0),
    });
  }
  const shows = [...byShow.values()].sort((a, b) => b.date.localeCompare(a.date));
  for (const show of shows) show.artists.sort((a, b) => b.songs - a.songs);
  return shows;
}
