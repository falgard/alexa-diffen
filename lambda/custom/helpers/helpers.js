const globals = require('../globals');

const cleanConstant = constant => constant.toLowerCase().replace('_', ' ');

const getValue = (event, key) => (event[key] && event[key] !== undefined) ? event[key] : null;

const findMatchInSynonyms = (availableTypes, inputString) => {
    let res;
    Object.entries(availableTypes).forEach(([key, value]) => {
        for (let synonym of value) {
            if (inputString.includes(synonym)) {
                res = cleanConstant(key);
                break;
            }
        }
    });
    return res;
};

const formatDate = date => {
    const objDate = new Date(date),
        locale = 'en-us',
        month = objDate.toLocaleString(locale, { month: 'long' }),
        day = objDate.getUTCDate(),
        hrs = objDate.getUTCHours() + 1, //runs at ireland?
        mins = objDate.getUTCMinutes();

    return `${month} ${day} ${hrs}:${mins === 0 ? '00' : mins}`;
};

const matchName = input => {
  const inputString = input.toLowerCase();
  const match = globals.TEAM_NAMES.filter(name => inputString.includes(name));
  return match.length > 0;
};

const matchType = input => {
    let res;
    const availableTypes = globals.EVENTTYPES;
    const eventTypes = Object.keys(availableTypes);
    const inputString = input.toLowerCase();

    for(let type of eventTypes) {
        const cleanType = cleanConstant(type);
        if (inputString.includes(cleanType)) {
            res = cleanType;
        }
    }
    return res ? res : findMatchInSynonyms(availableTypes, inputString);
};

const sort = (input, sortKey, desc = false) => {
    let value = -1;
    if (desc) value = 1;
    return input.sort((a, b) => {
        if(a[sortKey] < b[sortKey]) return value;
        if(a[sortKey] > b[sortKey]) return -(value);
        return 0;
    });
};

module.exports = {cleanConstant, findMatchInSynonyms, formatDate, getValue, matchName, matchType, sort};