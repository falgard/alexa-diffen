'use strict';

require('babel-polyfill');
const ical = require('ical');
const moment = require('moment');
const formatter = require('./../helpers/formatter');
const parser = require('./../helpers/parser');

const URL = 'http://www.difhockey.se/calendar/29/show/dif.ics';

const _getUpcomingGames = games => {
  const today = moment(new Date());
  const oneWeek = today.clone().add(1, 'week');

  const thisWeekGames = games.filter(game => {
    return moment(game.date).isBetween(today, oneWeek, 'day', '[]');
  });
  return thisWeekGames;
};

exports.getNextGame = games => {
  const upcomingGames = _getUpcomingGames(games);
  return upcomingGames[0];
};

exports.getGames = () => {
  return new Promise((resolve, reject) => {
    ical.fromURL(URL, {}, function (err, data) {
      let games = [];
      Object.entries(data).forEach(([key, value]) => {
        const game = {
          summary: formatter.removeTags(value.summary),
          location: formatter.removeTags(value.location),
          description: formatter.removeTags(value.description),
          date: parser.parseGameDate(value.start),
          dateMsg: formatter.generateDateMsg(value.start),
        };
        games.push(game);
      });
      resolve(games);
    });
  });
};
