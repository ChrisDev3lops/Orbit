const express = require('express');
const router = express.Router();

router.get('/fortnite/api/presence/v1/:accountId', (req, res) => {
    res.json([]);
});

router.get('/fortnite/api/presence/v1/user/:accountId', (req, res) => {
    res.json({
        availability: "ONLINE",
                status: "Playing Battle Royale",
                away: false,
                joined: false,
                last_online: new Date().toISOString(),
                properties: {}
    });
});

router.post('/fortnite/api/presence/v1/*', (req, res) => {
    res.json({});
});

module.exports = router;
