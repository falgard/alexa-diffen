'use strict';

require('babel-polyfill');
const moment = require('moment');
const messages = require('./../../globals/messages');
const settings = require('./../../globals/settings');

const isSameDay = (date, refDate) =>
  date.isSame(refDate, "day")

const isEmptyObject = obj => {
  for(var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
};

const parseDatePart = rawDate => {
  if (moment(rawDate, 'YYYY-MM-DD').isValid()) return rawDate;
  if (typeof(rawDate) !== 'string') throw new Error(messages.error.INVALID_DATE);

  const date = rawDate.toString().match(/[\d/-]+[T][\d/:]+/g);
  if (date && date.length > 0) 
    return date[0];
  throw new Error(messages.error.INVALID_DATE);
};

const parseGameDate = rawDate =>
  moment(parseDatePart(rawDate))

module.exports = {isSameDay, isEmptyObject, parseDatePart, parseGameDate};
