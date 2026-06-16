const express = require('express');
const router = express.Router();

router.get('/launcher/api/public/distributionpoints/', (req, res) => {
    res.json({
        "distributions": [
            "https://epicgames-download1.akamaized.net/",
            "https://download.epicgames.com/",
            "https://download2.epicgames.com/",
            "https://download3.epicgames.com/",
            "https://download4.epicgames.com/",
            "https://asteria.ol.epicgames.com/"
        ]
    });
});

router.get('/launcher/api/public/assets/*', (req, res) => {
    res.json({
        "appName": "FortniteContentBuilds",
        "labelName": "Asteria",
        "buildVersion": "++Fortnite+Release-20.00-CL-19458861-Windows",
        "catalogItemId": "5cb97847cee34581afdbc445400e2f77",
        "expires": "9999-12-31T23:59:59.999Z",
        "items": {
            "MANIFEST": {
                "signature": "Asteria",
                "distribution": "https://asteria.ol.epicgames.com/",
                "path": "Builds/Fortnite/Content/CloudDir/Asteria.manifest",
                "hash": "55bb954f5596cadbe03693e1c06ca73368d427f3",
                "additionalDistributions": []
            },
            "CHUNKS": {
                "signature": "Asteria",
                "distribution": "https://asteria.ol.epicgames.com/",
                "path": "Builds/Fortnite/Content/CloudDir/Asteria.manifest",
                "additionalDistributions": []
            }
        },
        "assetId": "FortniteContentBuilds"
    });
});

module.exports = router;
