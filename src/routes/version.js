const express = require('express');
const router = express.Router();

router.get('/fortnite/api/version', (req, res) => {
    res.json({
        version: "++Fortnite+Release-24.30-CL-00000000",
        build: "1.0.0",
        branch: "Live",
        modules: {}
    });
});

router.get('/fortnite/api/versioncheck', (req, res) => {
    res.json({
        type: "NO_UPDATE"
    });
});

module.exports = router;
