const express = require('express');
const router = express.Router();
const config = require('../../config.json');

router.use((req, res, next) => {
    if (config.features.maintenance.enabled) {
        res.status(503).json({
            errorCode: "errors.com.epicgames.common.maintenance",
            errorMessage: config.features.maintenance.message || "Server under maintenance",
            messageVars: [],
            numericErrorCode: 1006,
            originatingService: "fortnite",
            intent: "prod-live"
        });
    } else {
        next();
    }
});

module.exports = router;
