'use strict';
require('babel-polyfill');

const formatter = require('./helpers/formatter');
const fetcher = require('./services/fetcher');
const messages = require('./messages');

const Alexa = require('alexa-sdk');
const moment = require('moment');
const utils = require('util');

let output = '';

const _isGameComingWeek = nextGame => {
  const gameDay = moment(nextGame);
  const today = moment(new Date())
  const oneWeek = today.clone().add(1, 'week');
  return gameDay.isBetween(today, oneWeek, 'day', '[]');
};

var handlers = {
  'LaunchRequest': function () {
    this.emit('SayHello');
  },
  'NextGameIntent': function () {
    fetcher.getGames()
      .then(allGames => fetcher.getNextGame(allGames))
      .then((nextGame) => {
        if (nextGame && _isGameComingWeek(nextGame.date)) {
          const summary = utils.format(
            messages.general.gameSummary,
            nextGame.summary,
            nextGame.dateMsg,
            nextGame.location + "."
          );
          output += summary;
          this.response.speak(output).cardRenderer(messages.general.cardTitle, summary);
          this.emit(':responseReady');
        } else {
          output = messages.error.noGamesMessage;
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
