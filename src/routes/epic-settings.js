const express = require('express');
const router = express.Router();

router.get('/fortnite/api/game/v2/epic-settings', (req, res) => {
    res.json({});
});

router.all('/v1/epic-settings/public/users/*/values', (req, res) => {
    res.json({});
});

module.exports = router;
