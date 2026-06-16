const express = require('express');
const router = express.Router();

router.get('/fortnite/api/game/v2/br-inventory/account/:accountId', (req, res) => {
    res.json({
        "stash": {
            "globalcash": 5000
        }
    });
});

module.exports = router;
