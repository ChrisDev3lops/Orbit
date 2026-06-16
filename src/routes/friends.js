const express = require('express');
const router = express.Router();

router.get('/fortnite/api/friends/v1/:accountId/list', (req, res) => {
    res.json([]);
});

router.get('/fortnite/api/friends/v1/:accountId/summary', (req, res) => {
    res.json({
        friends: [],
        incomingRequests: [],
        outgoingRequests: [],
        suggested: [],
        blocklist: []
    });
});

router.post('/fortnite/api/friends/v1/:accountId/:friendId', (req, res) => {
    res.json({});
});

router.delete('/fortnite/api/friends/v1/:accountId/:friendId', (req, res) => {
    res.json({});
});

module.exports = router;
