'use strict';
require('babel-polyfill');
const Alexa = require('alexa-sdk');
const ical = require('ical');
const moment = require('moment');
const utils = require('util');

const URL = 'http://www.difhockey.se/calendar/29/show/dif.ics';

let output = '';
const noGamesMessage = 'There are no games this week';
const oneGameMessage = 'There is 1 game ';
const gameSummary = 'The next game is, %s, %s at %s';
const cardTitle = 'Games';
const todayMessage = 'today, %s';
const tomorrowMessage = 'tomorrow, %s';
const thisWeekMessage = 'on %s';
const dateErrorMessage = 'unknown date';

const removeTags = str => {
  if (str) {
    return str.replace(/<(?:.|\n)*?>/gm, '');
  }
};

const isGameComingWeek = nextGame => {
  const gameDay = moment(nextGame);
  const today = moment(new Date())
  const oneWeek = today.clone().add(1, 'week');
  return gameDay.isBetween(today, oneWeek, 'day', '[]');
};

const parseDatePart = rawDate => {
  if (typeof rawDate !== 'string') return "20180101T190000";
  const date = rawDate.toString().match(/[\d/-]+[T][\d/:]+/g);
  if (date && date.length > 0) return date[0];
  return "20180101T190000";
};

const parseGameDate = rawDate => {
  const date = moment(parseDatePart(rawDate));
  return date.isValid() ? date : moment(new Date());
};


const generateDateMsg = rawDate => {
  const gameDay = moment(parseDatePart(rawDate));

  if (gameDay.isValid() === false) return;

  const isToday = gameDay.isSame(new Date(), "day");
  const isTomorrow = gameDay.add(1, 'days').isSame(new Date(), "day");

  if (isToday) {
    return utils.format(todayMessage, moment(gameDay).format("H:mm"));
  } else if (isTomorrow) {
    return utils.format(tomorrowMessage, moment(gameDay).format("H:mm"));
  }

  return utils.format(thisWeekMessage, moment(gameDay).format("dddd, MMMM Do, H:mm"));
};

const getGames = () => {
  return new Promise((resolve, reject) => {
    ical.fromURL(URL, {}, function (err, data) {
      let games = [];
      Object.entries(data).forEach(([key, value]) => {
        const game = {
          summary: removeTags(value.summary),
          location: removeTags(value.location),
          description: removeTags(value.description),
          date: parseGameDate(value.start),
          dateMsg: generateDateMsg(value.start),
        };
        games.push(game);
      });
      resolve(games);
    });
  });
};

const getUpcomingGames = games => {
  const today = moment(new Date());
  const oneWeek = today.clone().add(1, 'week');

  const thisWeekGames = games.filter(game => {
    return moment(game.date).isBetween(today, oneWeek, 'day', '[]');
  });
  return thisWeekGames;
};

const getNextGame = games => {
  const upcomingGames = getUpcomingGames(games);
  return upcomingGames[0];
};

var handlers = {
  'LaunchRequest': function () {
    this.emit('SayHello');
  },
  'NextGameIntent': function () {
    getGames()
      .then(allGames => getNextGame(allGames))
      .then((nextGame) => {
        if (nextGame && isGameComingWeek(nextGame.date)) {
          const summary = utils.format(
            gameSummary,
            nextGame.summary,
            nextGame.dateMsg,
            nextGame.location + "."
          );
          output += summary;
          this.response.speak(output).cardRenderer(cardTitle, summary);
          this.emit(':responseReady');
        } else {
          output = noGamesMessage;
          this.response.speak(output);
        }
      });
  },
  'SessionEndedRequest': function () {
    console.log('Session ended with reason: ' + this.event.request.reason);
  },
  'AMAZON.StopIntent': function () {
    this.response.speak('Bye');
    this.emit(':responseReady');
  },
  'AMAZON.HelpIntent': function () {
    this.response.speak("You can try: 'alexa, diffen' or 'alexa, ask diffen'" +
            "when the next game is'");
    this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function () {
    this.response.speak('Bye');
    this.emit(':responseReady');
  },
  'Unhandled': function () {
    this.response.speak("Sorry, I didn't get that. You can try: 'alexa, diffen'" +
            " or 'alexa, ask diffen when the next game is'");
  }
};

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};
