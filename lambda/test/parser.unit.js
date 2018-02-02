'use strict';
require('babel-polyfill');

const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

const parser = require('.././helpers/parser');
const messages = require('./../../globals/messages');

describe('Parser', () => {
  describe('isSameDay', () => {
    let today, tomorrow;

    before(() => {
      today = moment();
      tomorrow = moment(today).clone().add(1, 'days')
    });

    it('should return true if it\'s the same day', () => {
      expect(parser.isSameDay(today, today)).to.equal(true);
    });

    it('should return false if it\'s not the same day', () => {
      expect(parser.isSameDay(today, tomorrow)).to.equal(false);
    });
  });

  describe('parseDatePart', () => {
    it('should parse the date part (20180101T190000) from a string', () => {
      const rawDate = 'TZID="+01:00":20180210T190000';
      expect(parser.parseDatePart(rawDate)).to.equal('20180210T190000');
    });

    it('should return default date if there\'s no valid date in the string', () => {
      const rawDate = 'TZID="Jan 31 2018';
      expect(parser.parseDatePart.bind(rawDate)).to.throw(messages.error.INVALID_DATE);
    });
  });

  describe('parseGameDate', () => {
    const rawDate = 'TZID="+01:00":20180210T190000';
    const expected = moment("2018-02-10T19:00:00");

    it('should return a moment date if input is valid', () => {
      const res = parser.parseGameDate(rawDate);
      expect(res.format()).to.equal(expected.format());
      expect(res.isValid()).to.equal(true);
    });

    it('should return a default date if input is invalid', () => {
      expect(parser.parseGameDate.bind('123456')).to.throw(messages.error.INVALID_DATE);
    });

    it('should return default date if input isn\'t a valid string', () => {
      expect(parser.parseGameDate.bind(null)).to.throw(messages.error.INVALID_DATE);
    });
  });
});
