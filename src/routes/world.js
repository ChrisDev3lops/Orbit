const express = require('express');
const router = express.Router();

router.get('/fortnite/api/game/v2/world/info', (req, res) => {
    res.json({
        "theater": {
            "enabled": true,
            "region": "EU",
            "server": "orbitserver"
        }
    });
});

module.exports = router;
