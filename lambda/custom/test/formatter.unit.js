'use strict';
require('babel-polyfill');

const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');

const formatter = require('.././helpers/formatter');

const constructDifHockeyDate = date => {
  return `TZID="+01:00":20${date}T190000`; // Format for DIF Hockey 2017/2018
};

const getExpectedDate = date => {
  const datePart = moment(date).format("dddd, MMMM Do,");
  const expected = `on ${datePart} 19:00`;
  return expected;
};

describe('Formatter', () => {
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
      const res = getExpectedDate(moment().add(5, 'days'));
      expect(formatter.generateDateMsg(thisWeek)).to.equal(res);
    });

    it('should return Jan 1 for invalid date', () => {
      expect(formatter.generateDateMsg('invalid date')).to.equal('on Monday, January 1st, 19:00');
    });
  });
});
