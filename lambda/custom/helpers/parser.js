'use strict';

require('babel-polyfill');
const moment = require('moment');
const settings = require('./../settings');

const parseDatePart = rawDate => {
  const date = rawDate.toString().match(/[\d/-]+[T][\d/:]+/g);
  if (date && date.length > 0) return date[0];
  return settings.values.DEFAULT_DATE;
};

const parseGameDate = rawDate =>
  moment(typeof rawDate === 'string' ? parseDatePart(rawDate) : settings.values.DEFAULT_DATE)

module.exports = {parseDatePart, parseGameDate};
