const express = require('express');
const router = express.Router();
const functions = require('../structs/functions');

router.get('/fortnite/api/calendar/v1/timeline', (req, res) => {
    const memory = functions.GetVersionInfo(req);
    const season = memory.season;

    const activeEvents = [
        {
            "eventType": `EventFlag.Season${season}`,
            "activeUntil": "9999-12-31T23:59:59.999Z",
            "activeSince": "2019-12-31T23:59:59.999Z"
        },
        {
            "eventType": `EventFlag.${memory.lobby}`,
            "activeUntil": "9999-12-31T23:59:59.999Z",
            "activeSince": "2019-12-31T23:59:59.999Z"
        }
    ];

    res.json({
        "channels": {
            "client-matchmaking": {
                "states": [],
                "cacheExpire": "9999-12-31T23:59:59.999Z"
            },
            "client-events": {
                "states": [{
                    "validFrom": "2019-12-31T23:59:59.999Z",
                    "activeEvents": activeEvents,
                    "state": {
                        "activeStorefronts": [],
                        "eventNamedWeights": {},
                        "seasonNumber": season,
                        "seasonTemplateId": `AthenaSeason:athenaseason${season}`,
                        "matchXpBonusPoints": 0,
                        "seasonBegin": "2020-01-01T00:00:00Z",
                        "seasonEnd": "9999-12-31T23:59:59.999Z",
                        "seasonDisplayedEnd": "9999-12-31T23:59:59.999Z",
                        "weeklyStoreEnd": "9999-12-31T23:59:59.999Z",
                        "stwEventStoreEnd": "9999-12-31T23:59:59.999Z",
                        "stwWeeklyStoreEnd": "9999-12-31T23:59:59.999Z",
                        "sectionStoreEnds": {
                            "Featured": "9999-12-31T23:59:59.999Z"
                        },
                        "dailyStoreEnd": "9999-12-31T23:59:59.999Z"
                    }
                }],
                "cacheExpire": "9999-12-31T23:59:59.999Z"
            }
        },
        "eventsTimeOffsetHrs": 0,
        "cacheIntervalMins": 10,
        "currentTime": new Date().toISOString()
    });
});

module.exports = router;
