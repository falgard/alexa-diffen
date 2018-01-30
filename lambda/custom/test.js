'use strict';
require('babel-polyfill');

const parseDatePart = rawDate => {
  console.log(rawDate);
  const date = rawDate.match(/\d+[T]\d+/g);
  if (date && date.length > 0) return date[0];
  return "20200101T190000";
};

console.log(parseDatePart("DTSTART;TZID=''+01:00':20180130T190000"));

console.log({ 2016-08-02T17:30:00.000Z tz: 'Europe/Stockholm' });
