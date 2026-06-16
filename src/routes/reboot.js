const express = require('express');
const router = express.Router();
const logger = require('../structs/logger');

router.post('/asteria/api/reboot', (req, res) => {
    res.json({ success: true, message: "Server rebooting..." });
    logger.Log("Reboot command received, restarting server...");
    
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});

router.post('/asteria/api/restart', (req, res) => {
    res.json({ success: true, message: "Server restarting..." });
    logger.Log("Restart command received, restarting server...");
    
    setTimeout(() => {
        process.exit(0);
    }, 1000);
});

router.get('/asteria/api/status', (req, res) => {
    res.json({
        status: "online",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version
    });
});

module.exports = router;
