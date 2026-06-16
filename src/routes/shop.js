const express = require('express');
const router = express.Router();
const ItemShopTags = require('../shop/ItemShopTags');

router.get('/fortnite/api/storefront/v2/catalog', (req, res) => {
    res.json({
        storefronts: [
            {
                name: "BRDailyStorefront",
                catalogEntries: []
            },
            {
                name: "BRWeeklyStorefront",
                catalogEntries: []
            }
        ],
        refreshIntervalHrs: 24
    });
});

module.exports = router;
