const express = require('express');
const router = express.Router();

router.get('/fortnite/api/game/v2/hotfixes', (req, res) => {
    res.json([]);
});

router.get('/fortnite/api/game/v2/hotfixes/*', (req, res) => {
    res.json([]);
});

module.exports = router;
