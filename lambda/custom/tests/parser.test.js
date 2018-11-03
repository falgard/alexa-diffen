const parser = require('../helpers/parser');
const data = require('./testData');

describe('Parser', () => {
    describe('parseEvents', () => {
        let res;
        let event;
        const expectedEvent = {
          "summary": "DIF - Sirius",
          "location": "Tele2 Arena",
          "description": "Träningsmatch",
          "home": true,
          "start": "2018-11-11T14:00:00.000Z",
          "pastEvent": false
      }

        beforeAll.skip( async () => {
            res = await parser.parseEvents(data);
            const findEvent = (event) => (event.summary === expectedEvent.summary);
            event = res.find(findEvent);
        });

        test('should have parsed all valid events from input', async () => {
            expect(res.length).toEqual(6);
        });

        test('should have parsed a valid event', async () => {
            expect(res).toContainEqual(event);
        });

        test('should contain a summary', async () => {
            expect(event.summary).toEqual(expectedEvent.summary);
        });

        test('should contain a location', async () => {
            expect(event.location).toEqual(expectedEvent.location);
        });

        test('should contain a type', async () => {
            expect(event.type).toEqual(expectedEvent.type);
        });

        test('should contain a home boolean', async () => {
            expect(event.home).toEqual(expectedEvent.home);
        });

        test('should contain a pastEvent flag', async () => {
            expect(event.pastEvent).toEqual(expectedEvent.pastEvent);
        });

        test('should contain a date', async () => {
            expect(event.start).toEqual(expectedEvent.start);
        });

        test('should not include past events by default', async () => {
            const findPastEvent = (event) => (event.pastEvent === true);
            const pastEvents = res.find(findPastEvent);
            expect(pastEvents).toEqual(undefined);
        });

        test('should include past events if param is true', async () => {
            const resWithPast = await parser.parseEvents(data, true);
            expect(resWithPast.length).toEqual(8);
            expect(resWithPast[0].pastEvent).toEqual(true);
        });
    });

    describe('parseArena', () => {
        const tele2 = 'Tele2 Arena';
        const eskilstuna = 'Tunavallen';

        test('should return home if location is specified in home_arenas', () => {
            const res = parser.parseArena(tele2);
            expect(res).toEqual(true);
        });

        test('should return away if location is not specified in home_arenas', () => {
          const res = parser.parseArena(eskilstuna);
          expect(res).toEqual(false);
      });
    });

    describe('isValidGame', () => {
      test('should return true if summary is valid', () => {
          const res = parser.isValidGame('Dalkurd - Djurgården ');
          expect(res).toEqual(true);
      });

      test('should return false if summary is not valid', () => {
        const res = parser.isValidGame('Jul ');
        expect(res).toEqual(false);
      });

      test('should return false if summary is not valid', () => {
        const res = parser.isValidGame(null);
        expect(res).toEqual(null);
      });
    });

    describe('isPastEvent', () => {
        const today = Date.now();
        const lastWeek = today - 604800;
        const nextWeek = today + 604800;

        test('should return true if date is before today', () => {
            const res = parser.isPastEvent({start: lastWeek});
            expect(res).toEqual(true);
        });

        test('should return false if date is after today', () => {
            const res = parser.isPastEvent({start: nextWeek});
            expect(res).toEqual(false);
        });

        test('should return false if date is today', () => {
            const res = parser.isPastEvent({start: today});
            expect(res).toEqual(false);
        });

        test('should return null if event is missing a valid date', () => {
            const res = parser.isPastEvent({start: 'imorgon'});
            expect(res).toEqual(null);
        });
    });

    describe('stripLocation', () => {
        test('should return first part of location if delimited by comma', () => {
            const res = parser.stripLocation('Tele2 Arena, Arenaslingan 14, 121 77 Stockholm, Sverige');
            expect(res).toEqual('Tele2 Arena');
        });

        test('should return first part of location if delimited by new line', () => {
          const res = parser.stripLocation('Gavlevallen\nGavlehovsvägen 14');
          expect(res).toEqual('Gavlevallen');
      });

        test('should return entire location if not delimited by commas', () => {
            const res = parser.stripLocation('Stadion');
            expect(res).toEqual('Stadion');
        });

        test('should return an empty string if location is empty', () => {
            const res = parser.stripLocation('');
            expect(res).toEqual('');
        });
        
        test('should return an empty string if location is null', () => {
          const res = parser.stripLocation(null);
          expect(res).toEqual('');
      });
    });
});