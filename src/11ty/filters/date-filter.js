const moment = require('moment');
moment.locale('fr');

module.exports = function (date, format = 'LL') {
  return moment(date).format(format);
}
