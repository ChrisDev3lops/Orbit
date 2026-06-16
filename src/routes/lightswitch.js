const express = require('express');
const router = express.Router();

router.get('/fortnite/api/lightswitch/broadcast/*', (req, res) => {
    res.json({});
});

router.get('/lightswitch/api/service/bulk/status', (req, res) => {
    res.json([
        {
            serviceInstanceId: "fortnite",
            status: "UP",
            message: "All Systems Operational",
            maintenanceUri: null,
            allowedActions: ["PLAY", "DOWNLOAD"],
            banned: false,
            launcherInfoDTO: {
                appName: "Fortnite",
                catalogItemId: "4fe75bbc5a674f4789799daab52073d1"
            }
        }
    ]);
});

module.exports = router;
