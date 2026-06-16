const express = require('express');
const router = express.Router();

router.get('/fortnite/api/v2/versioncheck/Windows', (req, res) => {
    res.json({
        "version": "++Fortnite+Release-20.00-CL-19458861-Windows",
        "buildDate": "2024-06-16T00:00:00.000Z",
        "buildId": "19458861",
        "branch": "Release-20.00",
        "modules": {}
    });
});

router.get('/fortnite/api/v2/versioncheck/:platform', (req, res) => {
    res.json({
        "version": "++Fortnite+Release-20.00-CL-19458861-Windows",
        "buildDate": "2024-06-16T00:00:00.000Z",
        "buildId": "19458861",
        "branch": "Release-20.00",
        "modules": {}
    });
});

module.exports = router;
