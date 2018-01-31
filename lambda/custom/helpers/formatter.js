'use strict';

require('babel-polyfill');
const moment = require('moment');
const utils = require('util');
const parser = require('./parser');
const messages = require('./../messages');

const isSameDay = exports.isSameDay = (date, refDate) =>
  date.isSame(refDate, "day")

exports.removeTags = str => {
  if (str) {
    return str.replace(/<(?:.|\n)*?>/gm, '');
  }
};

exports.generateSummary = game =>
  utils.format(
    messages.general.GAME_SUMMARY,
    game.summary,
    game.dateMsg,
    game.location + "."
  )

exports.generateDateMsg = rawDate => {
  const gameDay = moment(parser.parseDatePart(rawDate));
  if (gameDay.isValid() === false) return;

  const today = new Date();
  const isToday = isSameDay(gameDay, today);
  const isTomorrow = isSameDay(gameDay, moment(today).clone().add(1, 'days'));

  if (isToday) {
    return utils.format(messages.date.TODAY, moment(gameDay).format("H:mm"));
  } else if (isTomorrow) {
    return utils.format(messages.date.TOMORROW, moment(gameDay).format("H:mm"));
  }

  return utils.format(messages.date.THIS_WEEK, moment(gameDay).format("dddd, MMMM Do, H:mm"));
};
