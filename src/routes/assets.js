const express = require('express');
const router = express.Router();

router.post('/api/v1/assets/Fortnite/*/*', (req, res) => {
    res.json({
        "FortCreativeDiscoverySurface": {
            "meta": {
                "promotion": req.body.FortCreativeDiscoverySurface || 0
            },
            "assets": {}
        }
    });
});

module.exports = router;
