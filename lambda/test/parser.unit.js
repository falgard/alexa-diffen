'use strict';
require('babel-polyfill');

const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

const parser = require('./../helpers/parser');
const messages = require('./../globals/messages');

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

  describe('isEmptyObject', () => {
    it('should return false for a object', () => {
      const game = {
        summary: 'Dif-rubb',
        location: 'hovet'
      };
      expect(parser.isEmptyObject(game)).to.equal(false);
    });

    it('should return true for a empty object', () => {
      expect(parser.isEmptyObject({})).to.equal(true);
    });

    it('should return true for null', () => {
      expect(parser.isEmptyObject(null)).to.equal(true);
    });

    it('should return true for undefined', () => {
      expect(parser.isEmptyObject(undefined)).to.equal(true);
    });
  });

  describe('parseDatePart', () => {
    it('should parse the date part (20180101T190000) from a string', () => {
      const rawDate = 'TZID="+01:00":20180210T190000';
      expect(parser.parseDatePart(rawDate)).to.equal('20180210T190000');
    });

    it('should return input if it is a valid date', () => {
      const date = '2018-02-01 19:00:00';
      expect(parser.parseDatePart(date)).to.equal('2018-02-01 19:00:00');
    });

    it('should throw invalid date error if input isn\t a string', () => {
      expect(() => parser.parseDatePart(null)).to.throw(messages.error.INVALID_DATE);
    });

    it('should throw invalid date error if there is no valid date in the string', () => {
      const rawDate = 'TZID="asd123';
      expect(() => parser.parseDatePart('asd')).to.throw(messages.error.INVALID_DATE);
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

    it('should throw invalid date error if input is invalid', () => {
      expect(() => parser.parseGameDate('123456')).to.throw(messages.error.INVALID_DATE);
    });

    it('should throw invalid date error if input is not a valid string', () => {
      expect(() => parser.parseGameDate(null)).to.throw(messages.error.INVALID_DATE);
    });
  });
});
