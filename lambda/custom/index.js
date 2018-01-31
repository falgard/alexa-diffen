'use strict';

require('babel-polyfill');
const Alexa = require('alexa-sdk');
const moment = require('moment');
const utils = require('util');
const formatter = require('./helpers/formatter');
const fetcher = require('./services/fetcher');
const messages = require('./messages');

const APP_ID = 'amzn1.ask.skill.12ce19cd-8072-43e6-982e-343845e0760e';

const handlers = {
  'LaunchRequest': function () {
      this.attributes.speechOutput = messages.general.WELCOME_MESSAGE;
      this.attributes.repromptSpeech = messages.general.WELCOME_REPROMPT;

      this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
      this.emit(':responseReady');
  },
  'NextGameIntent': function () {
    const cardTitle = messages.general.DISPLAY_CARD_TITLE;
    fetcher.getGames()
      .then(allGames => fetcher.getNextGame(allGames))
      .then((nextGame) => {
        if (nextGame) {
          const summary = formatter.generateSummary(nextGame);
          this.attributes.speechOutput = summary;
          this.attributes.repromptSpeech = messages.general.REPEAT_MESSAGE;
          this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
          this.response.cardRenderer(messages.general.DISPLAY_CARD_TITLE, summary);
          this.emit(':responseReady');
        } else {
          this.attributes.speechOutput = messages.error.NO_GAMES;
          this.response.speak(speechOutput);
          this.emit(':responseReady');
        }
      })
      .catch(err => {
        this.attributes.speechOutput = messages.error.NOT_FOUND;
        this.response.speak(speechOutput);
        this.emit(':responseReady');
        console.log(`Error: ${err}`);
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
      this.response.speak("Goodbye!");
      this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': function () {
      this.response.speak("Goodbye!");
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
  alexa.APP_ID = APP_ID;

  alexa.registerHandlers(handlers);
  alexa.execute();
};
