'use strict';

require('babel-polyfill');
const ical = require('ical');
const moment = require('moment');
const formatter = require('./../helpers/formatter');
const parser = require('./../helpers/parser');
const settings = require('./../../globals/settings');
const messages = require('./../../globals/messages');

const fetchFromUrl = url => {
  console.log('inside fetchfromurl');
  return new Promise((resolve, reject) => {
    ical.fromURL(url, {}, (err, data) => {
      if (err) {
        reject(new Error(err));
      }
      resolve(data);
    });
  });
};

const getGamesForNextWeek = games => {
  const today = moment(new Date());
  const oneWeek = today.clone().add(1, 'week');

  return games.filter(game => {
    return moment(game.date).isBetween(today, oneWeek, 'day', '[]');
  });
};

const getNextGame = games => {
  if (games === null || typeof(games) === 'undefined' || games.length < 1) {
      throw new Error(messages.error.NO_GAMES);
  }
  const upcomingGames = getGamesForNextWeek(games);
  if (upcomingGames.lenght < 1) throw new Error(messages.error.NO_GAMES);
  return upcomingGames[0];
};

const getGames = url => {
  return new Promise((resolve, reject) => {
    fetchFromUrl(url)
      .then(data => {
        console.log('stub!');
        if (typeof(data) === 'undefined' || parser.isEmptyObject(data)) {
          throw new Error(messages.error.NOT_FOUND);
        }
        let games = [];
        let errors = 0;
        for (let k in data){
          if (data.hasOwnProperty(k)) {
            const value = data[k];
            try {
              const game = {
                summary: formatter.removeTags(value.summary),
                location: formatter.removeTags(value.location),
                description: formatter.removeTags(value.description),
                date: parser.parseGameDate(value.start),
                dateMsg: formatter.generateDateMsg(value.start),
              };
              games.push(game);              
            } catch (err) {
              errors++;
              //console.log('format error: ', err);
            }
          }
        }
        console.log(`Got ${games.length} valid games`);
        console.log(`Got ${errors} errors when parsing games`);
        resolve(games);
      })
      .catch(err => {
        console.log(err);
        reject(new Error(messages.error.NETWORK_ERROR));
      });
  });
};

module.exports = {fetchFromUrl, getGamesForNextWeek, getNextGame, getGames};

// fetcher:
// const fetchFootball = () => {
//   const url ='https://www.google.com/calendar/ical/6q2n1dbd72cvc21jqjglcjpb48%40group.calendar.google.com/public/basic.ics';
//   getGames(url);
// };

// const generateLocation = fullLocation =>
//   fullLocation.split(',')[0]

//   const date = parser.parseGameDate(value.start);
//   if (moment(date).isBefore(moment())) continue;
//   const game = {
//     date,
//     summary: formatter.removeTags(value.summary),
//     location: formatter.generateLocation(removeTags(value.location)),
//     description: formatter.removeTags(value.description),
//     dateMsg: formatter.generateDateMsg(value.start)
//   };
//   games.push(game);

// parser:
// if (moment(rawDate).isValid()) return rawDate;
