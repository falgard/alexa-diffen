'use strict';
require('babel-polyfill');

const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

const fetcher = require('./../services/fetcher');
const messages = require('./../../globals/messages');

describe('Fetcher', () => {
  let games = [];
  const today = moment();
  before(() => {
    for (let i = -5; i < 10; i++) {
      games.push({
        summary: `DIF-rubb${i}`,
        date: moment(today).add(i, 'days')
      });
    }
  });

  describe('getNextGame', () => {
    it('should get the next upcoming game', () => {
      const res = fetcher.getNextGame(games);
      console.log('res:', res);
      expect(games.length).to.equal(15);
      expect(games[5]).to.equal(res);
      expect(res.date.format()).to.equal(today.format());
      expect(res.summary).to.equal('DIF-rubb0');
    });

    it('should throw error if there\'s no games', () => {
      expect(fetcher.getNextGame.bind([])).to.throw(messages.error.NO_GAMES);
    });

    it('should throw error if there\'s no input', () => {
      expect(fetcher.getNextGame.bind(null)).to.throw(messages.error.NO_GAMES);
    });
  });

  describe('getGamesForNextWeek', () => {
    it('should get the games for the coming week', () => {
      const res = fetcher.getGamesForNextWeek(games);
      expect(res.length).to.equal(8);
      expect(res[0]).to.equal(games[5]);
      expect(res[7]).to.equal(games[12]);
    });

    it('should return empty array if there\'s no games next week', () => {
      const res = fetcher.getGamesForNextWeek([
        {
          summary: 'Two weeks ahead',
          date: moment(today).add(2, 'weeks')
        }
        ]);
      expect(res.length).to.equal(0);
    });

    it('should return empty array if there\'s no input', () => {
      const res = fetcher.getGamesForNextWeek([]);
      expect(res.length).to.equal(0);
    });
  });

  describe('getNextGame', () => {
    it('should get the next upcoming game', () => {
      const res = fetcher.getNextGame(games, games.length);
      expect(games.length).to.equal(15);
      expect(games[5]).to.equal(res);
      expect(res.date.format()).to.equal(today.format());
      expect(res.summary).to.equal('DIF-rubb0');
    });

    it('should throw error if there\'s no games', () => {
      expect(() => fetcher.getNextGame([])).to.throw(messages.error.NO_GAMES);
    });

    it('should throw error if there\'s no input', () => {
      expect(() => fetcher.getNextGame(null)).to.throw(messages.error.NO_GAMES);
    });
  });
});
