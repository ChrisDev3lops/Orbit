const express = require('express');
const router = express.Router();

router.get('/fortnite/api/party/v1/Fortnite/user/:accountId', (req, res) => {
    res.json({
        current: [],
        pending: [],
        invites: []
    });
});

router.post('/fortnite/api/party/v1/Fortnite/parties', (req, res) => {
    res.json({
        id: "party-" + Date.now(),
        members: [],
        applications: {},
        invites: {},
        meta: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });
});

router.get('/fortnite/api/party/v1/Fortnite/parties/:partyId', (req, res) => {
    res.json({
        id: req.params.partyId,
        members: [],
        applications: {},
        invites: {},
        meta: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });
});

router.post('/fortnite/api/party/v1/Fortnite/parties/:partyId/members/:accountId/join', (req, res) => {
    res.json({});
});

router.delete('/fortnite/api/party/v1/Fortnite/parties/:partyId/members/:accountId', (req, res) => {
    res.json({});
});

router.post('/fortnite/api/party/v1/Fortnite/parties/:partyId/members/:accountId/confirm', (req, res) => {
    res.json({});
});

router.post('/fortnite/api/party/v1/Fortnite/parties/:partyId/members/:accountId/kick', (req, res) => {
    res.json({});
});

module.exports = router;
