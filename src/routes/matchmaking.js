const express = require('express');
const router = express.Router();

router.get('/fortnite/api/matchmaking/session/:sessionId', (req, res) => {
    res.json({
        id: req.params.sessionId,
        attributes: {},
        state: "OPEN",
        joinRequests: []
    });
});

router.post('/fortnite/api/matchmaking/session/:sessionId/join', (req, res) => {
    res.json({});
});

router.post('/fortnite/api/matchmaking/session/start', (req, res) => {
    res.json({});
});

router.delete('/fortnite/api/matchmaking/session/:sessionId', (req, res) => {
    res.json({});
});

module.exports = router;
