const ical = require('node-ical');
const helpers = require('./helpers');
const globals = require('../globals');

const fetchFromCalendar = url => {
    return new Promise((resolve, reject) => {
        ical.fromURL(url, {}, (err, data) => {
            if (err) {
                console.log(err);
                reject(new Error(err));
            }
            resolve(data);
        });
    });
};

const filterEvents = (events, filters) => {
    const filteredEvents = events.filter(event => {
        for (let key in filters) {
            if (filters[key] && (event[key] === undefined || event[key] !== filters[key])) return false;
        }
        return true;
    });
    return filteredEvents;
};

const getNextEvent = (events, eventType) => {
    console.log('Fetcher - getNextEvent');
    // if (eventType) {
    //     const translatedType = eventType ? helpers.matchType(eventType) : null;
    //     const filters = {type: translatedType};
    //     const filteredEvents = filterEvents(events, filters);
    //     console.log('Filtered events count: ', filteredEvents.length);
    //     return filteredEvents[0];
    // }
    console.log('Events count: ', events.length);
    return events[0];
};

const listEvents = async (eventType) => {
    console.log('Fetcher - listEvents');
    const type = eventType ? eventType.toUpperCase() : 'ALL';
    let res = [];

    if (type === 'FOOTBALL') {
      res = await fetchFromCalendar(globals.URLS.FOOTBALL);
    } else if (type === 'HOCKEY'){
      res = await fetchFromCalendar(globals.URLS.HOCKEY);
    } else {
      // TODO: Promise.all()
    }
    return res;
};

module.exports = {filterEvents, getNextEvent, listEvents};