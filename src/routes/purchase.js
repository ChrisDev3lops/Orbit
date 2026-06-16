const express = require('express');
const router = express.Router();
const { generateCatalogEntry } = require('../shop/shopGenerator');

router.post('/fortnite/api/game/v2/profile/:accountId/client/PurchaseCatalogEntry', (req, res) => {
    const { offerId, purchaseQuantity } = req.body;
    
    res.json({
        profileRevision: 1,
        profileId: "athena",
        profileChangesBaseRevision: 1,
        profileChanges: [
            {
                changeType: "fullProfileUpdate",
                profile: {
                    stats: {
                        attributes: {
                            current_mtx_balance: 10000
                        }
                    },
                    items: {}
                }
            }
        ],
        profileCommandRevision: 1,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

router.post('/fortnite/api/game/v2/profile/:accountId/client/RemoveGiftBox', (req, res) => {
    res.json({
        profileRevision: 1,
        profileId: "athena",
        profileChangesBaseRevision: 1,
        profileChanges: [],
        profileCommandRevision: 1,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

module.exports = router;
