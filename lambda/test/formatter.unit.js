'use strict';
require('babel-polyfill');

const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

const formatter = require('./../helpers/formatter');
const messages = require('./../../globals/messages');

const constructDifHockeyDate = date => {
  return `TZID="+01:00":20${date}T190000`; // Format for DIF Hockey 2017/2018
};

const _getExpectedDate = date => {
  const datePart = moment(date).format("dddd, MMMM Do,");
  const expected = `on ${datePart} 19:00`;
  return expected;
};

describe('Formatter', () => {
  describe('generateSummary', () => {
    let game;

    before(() => {
      game = {
        summary: 'DIF-rubb',
        dateMsg: '',
        location: 'hovet'
      }
    });

    it('should generate summary for a game today', () => {
      game.dateMsg = 'today at 19:00';
      expect(formatter.generateSummary(game)).to.equal('The next game is, DIF-rubb, today at 19:00 at hovet.');
    });

    it('should generate summary for a game tomorrow', () => {
      game.dateMsg = 'tomorrow at 19:00';
      expect(formatter.generateSummary(game)).to.equal('The next game is, DIF-rubb, tomorrow at 19:00 at hovet.');
    });

    it('should generate summary for a game later this week', () => {
      game.dateMsg = 'on Monday, January 1st, 19:00';
      expect(formatter.generateSummary(game)).to.equal('The next game is, DIF-rubb, on Monday, January 1st, 19:00 at hovet.');
    });
  });

  describe('shortenLocation', () => {
    it('should return string as is if no comma is present', () => {
      const str = 'Hovet';
      expect(formatter.shortenLocation(str)).to.equal('Hovet');
    });

    it('should remove address part from location', () => {
      const str = 'Tele 2 Arena, Arenaslingan 14, 121 77 Johanneshov';
      expect(formatter.shortenLocation(str)).to.equal('Tele 2 Arena');
    });
  });

  describe('generateDateMsg', () => {
    let today, tomorrow, thisWeek;

    before(() => {
      const now = moment().format('YYMMDD');
      const nowPlus1 = moment().add(1, 'days').format('YYMMDD');
      const nowPlus5 = moment().add(5, 'days').format('YYMMDD');
      today = constructDifHockeyDate(now);
      tomorrow = constructDifHockeyDate(nowPlus1);
      thisWeek = constructDifHockeyDate(nowPlus5);
    });

    it('should generate msg for today', () => {
      expect(formatter.generateDateMsg(today)).to.equal('today at 19:00');
    });

    it('should generate msg for tomorrow', () => {
      expect(formatter.generateDateMsg(tomorrow)).to.equal('tomorrow at 19:00');
    });

    it('should generate msg for later this week', () => {
      const res = _getExpectedDate(moment().add(5, 'days'));
      expect(formatter.generateDateMsg(thisWeek)).to.equal(res);
    });

    it('should throw invalid date error for invalid input', () => {
      expect(() => formatter.generateDateMsg('123456')).to.throw(messages.error.INVALID_DATE);
    });
  });

  describe('removeTags', () => {
    it('should remove short html tags', () => {
      const str = '<b>diffen</b>';
      expect(formatter.removeTags(str)).to.equal('diffen');
    });

    it('should remove long html tags', () => {
      const str = '<italic>diffen</italic>';
      expect(formatter.removeTags(str)).to.equal('diffen');
    });

    it('should return string untouched if there\'s no tags', () => {
      const str = 'diffen';
      expect(formatter.removeTags(str)).to.equal(str);
    });

    it('should return input if it\'s not a string', () => {
      const input = null;
      expect(formatter.removeTags(input)).to.equal(input);
    });
  });
});
