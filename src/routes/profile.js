const express = require('express');
const router = express.Router();

router.get('/fortnite/api/game/v2/profile/:accountId', (req, res) => {
    res.json({
        profileRevision: 1,
        profileId: req.params.profileId || "athena",
        profileChangesBaseRevision: 1,
        profileChanges: [],
        profileCommandRevision: 1,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

router.post('/fortnite/api/game/v2/profile/:accountId/client/QueryProfile', (req, res) => {
    const profileId = req.body.profileId || "athena";
    res.json({
        profileRevision: 1,
        profileId: profileId,
        profileChangesBaseRevision: 1,
        profileChanges: [],
        profileCommandRevision: 1,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

router.post('/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin', (req, res) => {
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

router.post('/fortnite/api/game/v2/profile/:accountId/client/SetMtxPlatform', (req, res) => {
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

router.post('/fortnite/api/game/v2/profile/:accountId/client/PurchaseCatalogEntry', (req, res) => {
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

module.exports = router;
