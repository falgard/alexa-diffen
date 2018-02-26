'use strict';

const formatter = require('./helpers/formatter');
const fetcher = require('./services/fetcher');
const messages = require('./../globals/messages');
const settings = require('./../globals/settings');

const createGameIntent = async (games, cardTitle) => {
    try {
        const nextGame = await fetcher.getNextGame(games);
        if (nextGame) {
            const summary = formatter.generateSummary(nextGame);
            // this.attributes.speechOutput = summary;
            // this.attributes.repromptSpeech = messages.general.REPEAT_MESSAGE;
            // this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
            // this.response.cardRenderer(cardTitle, summary);
            // this.emit(':responseReady');
          } else {
            // this.attributes.speechOutput = messages.error.NO_GAMES;
            // this.response.speak(speechOutput);
            // this.emit(':responseReady');
          }   
    } catch (error) {
        console.log(`Error: ${error}`);
        // this.attributes.speechOutput = error;
        // this.response.speak(speechOutput);
        // this.emit(':responseReady');
    }

    // fetcher.getNextGame(games)
    //   .then((nextGame) => {
    //     if (nextGame) {
    //       const summary = formatter.generateSummary(nextGame);
    //       this.attributes.speechOutput = summary;
    //       this.attributes.repromptSpeech = messages.general.REPEAT_MESSAGE;
    //       this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
    //       this.response.cardRenderer(cardTitle, summary);
    //       this.emit(':responseReady');
    //     } else {
    //       this.attributes.speechOutput = messages.error.NO_GAMES;
    //       this.response.speak(speechOutput);
    //       this.emit(':responseReady');
    //     }
    //   })
    //   .catch(err => {
    //     console.log(`Error: ${error}`);
    //     this.attributes.speechOutput = err;
    //     this.response.speak(speechOutput);
    //     this.emit(':responseReady');
    //   });
};

fetcher.fetchAllSports()
    .then(allGames => {
        const cardTitle = 'Title';
        createGameIntent(allGames, cardTitle);
    });