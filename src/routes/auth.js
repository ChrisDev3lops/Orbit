const express = require('express');
const router = express.Router();

router.post('/fortnite/api/game/v2/grant_access/*', (req, res) => {
    res.json({});
});

router.post('/fortnite/api/game/v2/grant_access', (req, res) => {
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

router.get('/fortnite/api/game/v2/friendcodes/*/epic', (req, res) => {
    res.json([{
        "codeId": "ORBIT",
        "codeType": "CodeToken:FounderFriendInvite",
        "dateCreated": "2024-06-16T21:37:00.420Z"
    },
    {
        "codeId": "orbitcode",
        "codeType": "CodeToken:FounderFriendInvite_XBOX",
        "dateCreated": "2024-06-16T21:37:00.420Z"
    },
    {
        "codeId": "orbitmobile",
        "codeType": "CodeToken:MobileInvite",
        "dateCreated": "2024-06-16T21:37:00.420Z"
    }])
});

router.get('/eulatracking/api/shared/agreements/fn*', (req, res) => {
    res.json({})
});

module.exports = router;
