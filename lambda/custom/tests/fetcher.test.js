const fetcher = require('../helpers/fetcher');

describe('Fetcher', () => {
    const events = [
        {
            'summary': 'AW med Shuffle board',
            'location': 'BrewDog Bar Malmö, Baltzarsgatan 25, 211 36 Malmö, Sverige',
            'description': 'Hej vänner,\n\nTänkte att vi kör en go AW med lite shuffle board på Brewdog i Malmö. Banorna är bokade mellan 17-19.\n\nSjälvklart blir det öl eller annan dryck och lite goa nachos!\n\nVäl mött!\n\n//Richard\n\nDen här händelsen har ett videosamtal.\nGå med: https://meet.google.com/dyp-sray-ttj\n+1 315-646-8224 PIN-kod: 889367004#',
            'type': 'after_work',
            'city': 'malmö',
            'start': '2018-11-08T16:00:00.000Z',
            'pastEvent': false
        },
        {
            'summary': 'AW Stockholm - kareoke',
            'location': 'tbd',
            'description': 'På önskan av Simon kör vi en aw med (frivillig?) kareoke',
            'type': 'after_work',
            'city': 'stockholm',
            'start': '2018-11-16T16:00:00.000Z',
            'pastEvent': false
        },
        { 
            summary: 'Julfest Stockholm - Matlagning',
            location: 'Cajsa Warg, Renstiernas gata 20, 116 31 Stockholm, Sverige',
            type: 'party',
            city: 'stockholm',
            start: '2018-12-13T16:00:00.000Z',
            pastEvent: false 
        }
    ];

    describe('filterEvents', () => {
        test('should return entire array if no filters are passed', () => {
            const res = fetcher.filterEvents(events, {type: null, city: null});
            expect(res).toEqual(events);
        });

        test('should return an empty array if filters don\'t get any matches', () => {
            const res = fetcher.filterEvents(events, {type: 'meetup', city: 'malmö'});
            expect(res).toEqual([]);
        });

        test('should return events filtered on city', () => {
            const res = fetcher.filterEvents(events, {type: null, city: 'stockholm'});
            expect(res.length).toEqual(2);
            expect(res).toContainEqual(events[1]);
            expect(res).toContainEqual(events[2]);
        });

        test('should return events filtered on type', () => {
            const res = fetcher.filterEvents(events, {type: 'after_work', city: null});
            expect(res.length).toEqual(2);
            expect(res).toContainEqual(events[0]);
            expect(res).toContainEqual(events[1]);
        });

        test('should return events filtered on city and type', () => {
            const res = fetcher.filterEvents(events, {type: 'after_work', city: 'stockholm'});
            expect(res.length).toEqual(1);
            expect(res).toContainEqual(events[1]);
        });
    });

    describe('getNextEvent', () => {
        test('should return first event from array if no filters are passed', () => {
            const res = fetcher.getNextEvent(events, null, null);
            expect(res).toEqual(events[0]);
        });

        test('should return first event from array filtered on city', () => {
            const res = fetcher.getNextEvent(events, null, 'stockholm');
            expect(res).toEqual(events[1]);
        });

        test('should return first event from array filtered on type', () => {
            const res = fetcher.getNextEvent(events, 'after_work', null);
            expect(res).toEqual(events[0]);
        });

        test('should return first event from array filtered on city and type', () => {
            const res = fetcher.getNextEvent(events, 'julfest', 'stockholm');
            expect(res).toEqual(events[2]);
        });

        test('should return undefined if an empty array is passed', () => {
            const res = fetcher.getNextEvent([], null, null);
            expect(res).toEqual(undefined);
        });
    });
});