'use strict';

require('babel-polyfill');
const Alexa = require('alexa-sdk');
const moment = require('moment');
const utils = require('util');
const formatter = require('./helpers/formatter');
const fetcher = require('./services/fetcher');
const messages = require('./../globals/messages');
const settings = require('./../globals/settings');

// const createGameIntent = async (games, cardTitle) => {
//   try {
//     const nextGame = await fetcher.getNextGame(games);
//     if (nextGame) {
//         const summary = formatter.generateSummary(nextGame);
//         this.attributes.speechOutput = summary;
//         this.attributes.repromptSpeech = messages.general.REPEAT_MESSAGE;
//         this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
//         this.response.cardRenderer(cardTitle, summary);
//         this.emit(':responseReady');
//       } else {
//         this.attributes.speechOutput = messages.error.NO_GAMES;
//         this.response.speak(speechOutput);
//         this.emit(':responseReady');
//       }   
//   } catch (error) {
//       console.log(`Error: ${error}`);
//       this.attributes.speechOutput = error;
//       this.response.speak(speechOutput);
//       this.emit(':responseReady');
//   }
// };

const createGameIntent = (games, cardTitle) => {
  try {
    fetcher.getNextGame(games).then((nextGame) => {
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
  } catch (error) {
      console.log(`Error: ${error}`);
      this.attributes.speechOutput = error;
      this.response.speak(speechOutput);
      this.emit(':responseReady');
  }
};

const handlers = {
  'LaunchRequest': () => {
      this.attributes.speechOutput = messages.general.WELCOME_MESSAGE;
      this.attributes.repromptSpeech = messages.general.WELCOME_REPROMPT;

      this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
      this.emit(':responseReady');
  },
  'NextGameIntent': function() {
    const cardTitle = messages.general.DISPLAY_CARD_TITLE;
    fetcher.fetchAllSports().then(games => {
        createGameIntent(games, cardTitle);
    })
  },
  'NextFootballGameIntent': async () => {
    const cardTitle = `${messages.general.DISPLAY_CARD_TITLE} - DIF Football`;
    const games = await fetcher.fetchFootballGames();
    createGameIntent(games, cardTitle);
  },
  'NextHockeyGameIntent': () => {
    const cardTitle = `${messages.general.DISPLAY_CARD_TITLE} - DIF Hockey`;
    const games = await fetcher.fetchHockeyGames();
    createGameIntent(games, cardTitle);
  },
  'AMAZON.HelpIntent': () => {
      this.attributes.speechOutput = messages.general.HELP_MESSAGE;
      this.attributes.repromptSpeech = messages.general.HELP_REPROMPT;

      this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
      this.emit(':responseReady');
  },
  'AMAZON.RepeatIntent': () => {
      this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
      this.emit(':responseReady');
  },
  'AMAZON.StopIntent': () => {
      this.response.speak(messages.general.STOP_MESSAGE);
      this.emit(':responseReady');
  },
  'AMAZON.CancelIntent': () => {
      this.response.speak(messages.general.STOP_MESSAGE);
      this.emit(':responseReady');
  },
  'SessionEndedRequest': () => {
      console.log(`Session ended: ${this.event.request.reason}`);
  },
  'Unhandled': () => {
      this.attributes.speechOutput = messages.general.HELP_MESSAGE;
      this.attributes.repromptSpeech = messages.general.HELP_REPROMPT;
      this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
      this.emit(':responseReady');
  }
};

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = settings.configs.APP_ID;

  alexa.registerHandlers(handlers);
  alexa.execute();
};