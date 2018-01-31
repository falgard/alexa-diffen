'use strict';
require('babel-polyfill');

const parser = require('./parser');
const messages = require('./../messages');

const moment = require('moment');
const utils = require('util');

const _isSame = (date, refDate) => {
  return date.isSame(refDate, "day");
};

exports.removeTags = str => {
  if (str) {
    return str.replace(/<(?:.|\n)*?>/gm, '');
  }
};

exports.generateDateMsg = rawDate => {
  const gameDay = moment(parser.parseDatePart(rawDate));
  if (gameDay.isValid() === false) return;

  const today = new Date();
  const isToday = _isSame(gameDay, today);
  const isTomorrow = _isSame(gameDay, moment(today).clone().add(1, 'days'));

  if (isToday) {
    return utils.format(messages.date.todayMessage, moment(gameDay).format("H:mm"));
  } else if (isTomorrow) {
    return utils.format(messages.date.tomorrowMessage, moment(gameDay).format("H:mm"));
  }

  return utils.format(messages.date.thisWeekMessage, moment(gameDay).format("dddd, MMMM Do, H:mm"));
};
