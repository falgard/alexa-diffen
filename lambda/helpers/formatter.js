'use strict';

require('babel-polyfill');
const moment = require('moment');
const utils = require('util');
const parser = require('./parser');
const messages = require('./../../globals/messages');

const removeTags = str =>
    str ? str.replace(/<(?:.|\n)*?>/gm, '') : str;

const shortenLocation = fullLocation =>
    fullLocation.split(',')[0];
  
const generateSummary = game =>
    utils.format(
        messages.general.GAME_SUMMARY,
        game.summary,
        game.dateMsg,
        game.location + '.'
    );

const generateDateMsg = rawDate => {
    let gameDay;
    try {
        gameDay = moment(parser.parseDatePart(rawDate));
    } catch (err) {
        throw err;
    }

    const today = new Date();
    const isToday = parser.isSameDay(gameDay, today);
    const isTomorrow = parser.isSameDay(gameDay, moment(today).clone().add(1, 'days'));

    if (isToday) {
        return utils.format(messages.date.TODAY, moment(gameDay).format('H:mm'));
    } else if (isTomorrow) {
        return utils.format(messages.date.TOMORROW, moment(gameDay).format('H:mm'));
    }

    return utils.format(messages.date.THIS_WEEK, moment(gameDay).format('dddd, MMMM Do, H:mm'));
};

module.exports = {generateDateMsg, generateSummary, removeTags, shortenLocation};
