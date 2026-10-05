import moment from 'moment';
import 'moment/locale/fr.js';

// Formatted in the language of the page (`lang` data), or the one passed
export default function dateFilter(date, format = 'LL', lang) {
  return moment(date).locale(lang || this?.ctx?.lang || 'fr').format(format);
}
