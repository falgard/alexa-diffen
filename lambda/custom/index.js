/* eslint-disable  func-names */

const Alexa = require('ask-sdk-core');
const fetcher = require('./helpers/fetcher');
const parser = require('./helpers/parser');
const helpers = require('./helpers/helpers');
const messages = require('./messages');

const SKILL_NAME = 'Diffen games';

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        console.log('LaunchRequestHandler');
        const speechText = messages.general.WELCOME_MESSAGE;
        const repromptText = messages.general.WELCOME_REPROMPT;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromptText)
            .withSimpleCard(SKILL_NAME, speechText)
            .getResponse();
    },
};

const NextGameIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'NextGameIntent';
    },
    async handle(handlerInput) {
        console.log('NextGameRequestHandler');
        const { requestEnvelope, attributesManager, responseBuilder } = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        let speechText;

        const slots = requestEnvelope.request.intent.slots;
        let eventType = getSlot(slots, 'eventType');

        let events = sessionAttributes.events ? sessionAttributes.events : [];
        console.log('Getting cached games: ', events);
        if (events.length < 1) {
            try {
                const rawEvents = await fetcher.listEvents(eventType);
                events = parser.parseEvents(rawEvents, eventType);
                console.log(`Parsed ${events.length} upcoming games from raw data`);
            } catch (error) {
                console.log(error);
            }
        }

        sessionAttributes.events = events;
        attributesManager.setSessionAttributes(sessionAttributes);

        if (events.length < 1) {
            speechText = messages.error.NO_GAMES;
        } else {
          const nextEvent = fetcher.getNextEvent(events, eventType);
          console.log(`Next event: ${JSON.stringify(nextEvent, null, 2)}`);

          speechText = nextEvent ? `The next ${eventType ? eventType : ''} game is ${nextEvent.summary}, it\'s ${nextEvent.home ? 'home' : 'away'} at ${nextEvent.location} on ${helpers.formatDate(nextEvent.start)}` 
              : 'Could not find a planned event matching that.';
        }

        return responseBuilder
            .speak(speechText)
            .withSimpleCard(SKILL_NAME, speechText)
            .getResponse();
    },
};
  
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = messages.general.HELP_MESSAGE;
        const repromtText = messages.general.HELP_REPROMPT;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(repromtText)
            .withSimpleCard(SKILL_NAME, speechText)
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard(SKILL_NAME, speechText)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};

const getSlot = (slots, slotName) => {
    if (slots[slotName] && slots[slotName].value) {
        const slot = slots[slotName].value.toLowerCase();
        console.log(`Found slot, ${slotName}:`, slot);
        return slot;
    }
    return null;
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        NextGameIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();