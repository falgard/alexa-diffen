'use strict';

require('babel-polyfill');
const ical = require('ical');
const moment = require('moment');
const formatter = require('./../helpers/formatter');
const parser = require('./../helpers/parser');
const settings = require('./../settings');
const messages = require('./../messages');

const getGamesForNextWeek = games => {
  const today = moment(new Date());
  const oneWeek = today.clone().add(1, 'week');

  return games.filter(game => {
    return moment(game.date).isBetween(today, oneWeek, 'day', '[]');
  });
};

const getNextGame = games => {
  if (!games || typeof(games) === 'undefined' || games.lenght < 1) {
      throw new Error(messages.error.NOT_FOUND);
  }
  const upcomingGames = getGamesForNextWeek(games);
  return upcomingGames[0];
};

const getGames = () => {
  return new Promise((resolve, reject) => {
    ical.fromURL(settings.urls.DIF_HOCKEY, {}, (err, data) => {
      let games = [];
      data.forEach((key, value) => {
        games.push({
          summary: formatter.removeTags(value.summary),
          location: formatter.removeTags(value.location),
          description: formatter.removeTags(value.description),
          date: parser.parseGameDate(value.start),
          dateMsg: formatter.generateDateMsg(value.start),
        });
      });
      resolve(games);
    });
  }).
  catch(error => {
    console.log(messages.error.NOT_FOUND, error);
    throw new Error(messages.error.NOT_FOUND);
    reject([]);
  });
};

module.exports = {getGamesForNextWeek, getNextGame, getGames};
