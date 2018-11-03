const helpers = require('../helpers/helpers');

describe('Helpers', () => {  
    describe.only('formatDate', () => {
        test('should return month, day and time from a date', () => {
            const res = helpers.formatDate('2018-11-03T14:15:00.000Z',);
            expect(res).toEqual('November 3 15:15');
        });

        test('should add a zero if time end with a zero', () => {
          const res = helpers.formatDate('2018-11-03T14:00:00.000Z',);
          expect(res).toEqual('November 3 15:00');
      });
    });

    describe('getValue', () => {
        const event = {
            summary: 'getMe',
            description: undefined
        };

        test('should return value if present', () => {
            const res = helpers.getValue(event, 'summary');
            expect(res).toEqual('getMe');
        });

        test('should return null if key is missing', () => {
            const res = helpers.getValue(event, 'location');
            expect(res).toEqual(null);
        });

        test('should return null if value is undefined', () => {
            const res = helpers.getValue(event, 'description');
            expect(res).toEqual(null);
        });
      });


    describe('matchName', () => {
      test('should return true if input matches available names', () => {
          const res = helpers.matchName('Dalkurd - Djurgården ');
          expect(res).toEqual(true);
      });

      test('should return false if input doesn\'t match available names', () => {
        const res = helpers.matchName('Jul ');
        expect(res).toEqual(false);
      });
    });

    describe('matchType', () => {
        test('should return event type if match from available types is found', () => {
            const res = helpers.matchType('aw stockholm - kareoke');
            expect(res).toEqual('after work');
        });

        test('should return undefined if no match from available types is found', () => {
            const res = helpers.matchType('kareokekväll i stockholm');
            expect(res).toEqual(undefined);
        });

        test('should return event type if synonym is found', () => {
            const res = helpers.matchType('öl!');
            expect(res).toEqual('after work');
        });

        test('should return the first event type that is found', () => {
            const res = helpers.matchType('resa med frukost och fest som avslutning och även team building och öl');
            expect(res).toEqual('trip');
        });
    });

    describe('sort', () => {
        const unsortedData = [
            {
                'summary': 'aw',
                'start': '2018-11-07T16:00:00.000Z'
            },
            {
                'summary': 'julfest',
                'start': '2018-12-13T16:00:00.000Z'
            },
            {
                'summary': 'meetup',
                'start': '2018-10-10T15:00:00.000Z'
            }
        ];

        test('should sort list by date ascending', () => {
            const res = helpers.sort(unsortedData, 'start');
            expect(res[0].summary).toEqual('meetup');
            expect(res[1].summary).toEqual('aw');
            expect(res[2].summary).toEqual('julfest');
        });

        test('should sort list by date ascending', () => {
            const res = helpers.sort(unsortedData, 'start', true);
            expect(res[0].summary).toEqual('julfest');
            expect(res[1].summary).toEqual('aw');
            expect(res[2].summary).toEqual('meetup');
        });
    });
});