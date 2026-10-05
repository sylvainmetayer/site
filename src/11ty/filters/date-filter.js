import moment from 'moment';
import 'moment/locale/fr.js';

moment.locale('fr');

export default function (date, format = 'LL') {
  return moment(date).format(format);
}
