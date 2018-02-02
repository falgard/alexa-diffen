'use strict';

require('babel-polyfill');
const moment = require('moment');
const utils = require('util');
const parser = require('./parser');
const messages = require('./../messages');
const settings = require('./../settings');

const isSameDay = (date, refDate) =>
  date.isSame(refDate, "day")

const removeTags = str =>
  str ? str.replace(/<(?:.|\n)*?>/gm, '') : str

const generateSummary = game =>
  utils.format(
    messages.general.GAME_SUMMARY,
    game.summary,
    game.dateMsg,
    game.location + "."
  )

const generateDateMsg = rawDate => {
  const gameDay = moment(parser.parseDatePart(rawDate));
  if (gameDay.isSame(moment(settings.values.DEFAULT_DATE))) return messages.error.INVALID_DATE;

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

module.exports = {isSameDay, removeTags, generateSummary, generateDateMsg};
