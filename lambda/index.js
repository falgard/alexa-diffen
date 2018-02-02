'use strict';

require('babel-polyfill');
const Alexa = require('alexa-sdk');
const moment = require('moment');
const utils = require('util');
const formatter = require('./helpers/formatter');
const fetcher = require('./services/fetcher');
const messages = require('./../globals/messages');
const settings = require('./../globals/settings');

const createGameIntent = (games, cardTitle) => {
    fetcher.getNextGame(games)
      .then((nextGame) => {
        if (nextGame) {
          const summary = formatter.generateSummary(nextGame);
          this.attributes.speechOutput = summary;
          this.attributes.repromptSpeech = messages.general.REPEAT_MESSAGE;
          this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
          this.response.cardRenderer(cardTitle, summary);
          this.emit(':responseReady');
        } else {
          this.attributes.speechOutput = messages.error.NO_GAMES;
          this.response.speak(speechOutput);
          this.emit(':responseReady');
        }
      })
      .catch(err => {
        console.log(`Error: ${err}`);
        this.attributes.speechOutput = err;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
      });
};

const handlers = {
  'LaunchRequest': function () {
      this.attributes.speechOutput = messages.general.WELCOME_MESSAGE;
      this.attributes.repromptSpeech = messages.general.WELCOME_REPROMPT;

      this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
      this.emit(':responseReady');
  },
  'NextGameIntent': function () {
    const cardTitle = messages.general.DISPLAY_CARD_TITLE;

    fetcher.fetchAllSports()
      .then(allGames => {
        createGameIntent(games, cardTitle);
      });
  },
  'NextFootballGameIntent': function () {
    const cardTitle = `${messages.general.DISPLAY_CARD_TITLE} - DIF Football`;

    fetcher.fetchFootballGames()
      .then(footballGames => {
        createGameIntent(footballGames, cardTitle)
      });
  },
  'NextHockeyGameIntent': function () {
    const cardTitle = `${messages.general.DISPLAY_CARD_TITLE} - DIF Hockey`;
    
    fetcher.fetchHockeyGames()
      .then(hockeyGames => {
        createGameIntent(hockeyGames, cardTitle)
      });
  },
  'AMAZON.HelpIntent': function () {
      this.attributes.speechOutput = messages.general.HELP_MESSAGE;
      this.attributes.repromptSpeech = messages.general.HELP_REPROMPT;

      this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
      this.emit(':responseReady');
  },
  'AMAZON.RepeatIntent': function () {
      this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
      this.emit(':responseReady');
  },
  'AMAZON.StopIntent': function () {
      this.response.speak(messages.general.STOP_MESSAGE);
      this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function () {
      this.response.speak(messages.general.STOP_MESSAGE);
      this.emit(':responseReady');
  },
  'SessionEndedRequest': function () {
      console.log(`Session ended: ${this.event.request.reason}`);
  },
  'Unhandled': function () {
      this.attributes.speechOutput = messages.general.HELP_MESSAGE;
      this.attributes.repromptSpeech = messages.general.HELP_REPROMPT;
      this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
      this.emit(':responseReady');
  },

};

exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = settings.configs.APP_ID;

  alexa.registerHandlers(handlers);
  alexa.execute();
};
