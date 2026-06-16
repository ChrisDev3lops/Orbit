const express = require('express');
const router = express.Router();

router.post('/fortnite/api/game/v2/tryPlayOnPlatform/account/:accountId', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(true);
});

router.get('/fortnite/api/game/v2/tryPlayOnPlatform/account/:accountId', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(true);
});

module.exports = router;
