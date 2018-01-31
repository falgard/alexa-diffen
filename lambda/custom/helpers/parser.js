'use strict';

require('babel-polyfill');
const moment = require('moment');

const parseDatePart = exports.parseDatePart = rawDate => {
  if (typeof rawDate !== 'string') return "20180101T190000";
  const date = rawDate.toString().match(/[\d/-]+[T][\d/:]+/g);
  if (date && date.length > 0) return date[0];
  return "20180101T190000";
};

exports.parseGameDate = rawDate => {
  const date = moment(parseDatePart(rawDate));
  return date.isValid() ? date : moment(new Date());
};
