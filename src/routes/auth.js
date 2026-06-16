const express = require('express');
const router = express.Router();

router.post('/fortnite/api/game/v2/grant_access/:accountId', (req, res) => {
    res.json({});
});

router.post('/fortnite/api/game/v3/profile/:accountId/client/ClientLogin', (req, res) => {
    res.json({
        profileRevision: 1,
        profileId: "athena",
        profileChangesBaseRevision: 1,
        profileChanges: [],
        profileCommandRevision: 1,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

router.get('/fortnite/api/game/v2/enabled_features', (req, res) => {
    res.json({});
});

module.exports = router;
