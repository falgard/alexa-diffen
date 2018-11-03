const helpers = require('./helpers');
const globals = require('../globals');
const now = Date.now();

const isPastEvent = event => {
    if (event.start === undefined) return null;
    const date = new Date(event.start);
    if (date == 'Invalid Date') return null;
    return date < now;
};

const stripLocation = location => {
  if (!location) return '';
  else if (location.includes('\n')) return location.split('\n')[0]
  return location.split(',')[0];
};

const parseArena = location => {
  if (!location) return false;
  const homeGame = globals.ARENAS.filter(arena => location.toLowerCase().includes(arena));
  return homeGame.length > 0;
};

const isValidGame = summary => {
  return (summary && helpers.matchName(summary))
};

const parseEvents = (data, type, includePast = false) => {
    console.log('Parser - parseEvents');
    let res = [];

    for (const k in data){
      if (data.hasOwnProperty(k)) {
        const ev = data[k];
      
        const summary = helpers.getValue(ev, 'summary');
        const pastEvent = isPastEvent(ev);

        if (!isValidGame(summary) || (!includePast && pastEvent)) continue;
        const location = helpers.getValue(ev, 'location');
        res.push({
            summary: summary,
            location: stripLocation(location),
            description: helpers.getValue(ev, 'description'),
            home: parseArena(location),
            start: helpers.getValue(ev, 'start'),
            pastEvent,
            type
        });
      }
    }
    console.log(JSON.stringify(res, null, 2));
    return helpers.sort(res, 'start');
};

module.exports = {isValidGame, isPastEvent, parseEvents, parseArena, stripLocation};