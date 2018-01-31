'use strict';
require('babel-polyfill');

const parser = require('./parser');
const messages = require('./../messages');

const moment = require('moment');
const utils = require('util');

exports.removeTags = str => {
  if (str) {
    return str.replace(/<(?:.|\n)*?>/gm, '');
  }
};

exports.generateDateMsg = rawDate => {
  const gameDay = moment(parser.parseDatePart(rawDate));

  if (gameDay.isValid() === false) return;

  const isToday = gameDay.isSame(new Date(), "day");
  const isTomorrow = gameDay.add(1, 'days').isSame(new Date(), "day");

  if (isToday) {
    return utils.format(messages.date.todayMessage, moment(gameDay).format("H:mm"));
  } else if (isTomorrow) {
    return utils.format(messages.date.tomorrowMessage, moment(gameDay).format("H:mm"));
  }

  return utils.format(messages.date.thisWeekMessage, moment(gameDay).format("dddd, MMMM Do, H:mm"));
};
