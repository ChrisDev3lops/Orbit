const express = require('express');
const router = express.Router();

router.get('/fortnite/api/game/v2/twitch/*', (req, res) => {
    res.status(200);
    res.end();
});

module.exports = router;
