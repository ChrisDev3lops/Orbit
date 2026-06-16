const express = require('express');
const router = express.Router();

function parseVersionFromUA(ua) {
    // Example: ++Fortnite+Release-12.61-CL-13477524-Windows
    const match = ua.match(/Release-([\d.]+)-CL-(\d+)/);
    if (match) {
        return {
            branch: `Release-${match[1]}`,
            buildId: match[2],
            version: `++Fortnite+Release-${match[1]}-CL-${match[2]}-Windows`
        };
    }
    // Fallback for 12.61
    return {
        branch: "Release-12.61",
        buildId: "13477524",
        version: "++Fortnite+Release-12.61-CL-13477524-Windows"
    };
}

router.get('/fortnite/api/v2/versioncheck/:platform', (req, res) => {
    const ua = req.headers['user-agent'] || '';
    const parsed = parseVersionFromUA(ua);

    res.json({
        type: "NO_UPDATE",
        version: parsed.version,
        buildDate: new Date().toISOString(),
        buildId: parsed.buildId,
        branch: parsed.branch,
        modules: {}
    });
});

module.exports = router;
