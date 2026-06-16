const express = require('express');
const router = express.Router();

router.get('/account/api/public/account', (req, res) => {
    var response = [];

    if (typeof req.query.accountId == "string") {
        var accountId = req.query.accountId;
        if (accountId.includes("@")) accountId = accountId.split("@")[0];

        response.push({
            "id": accountId,
            "displayName": accountId,
            "externalAuths": {}
        })
    }

    if (Array.isArray(req.query.accountId)) {
        for (var x in req.query.accountId) {
            var accountId = req.query.accountId[x];
            if (accountId.includes("@")) accountId = accountId.split("@")[0];

            response.push({
                "id": accountId,
                "displayName": accountId,
                "externalAuths": {}
            })
        }
    }

    res.json(response)
});

router.get('/account/api/public/account/:accountId', (req, res) => {
    var accountId = req.params.accountId;
    if (accountId.includes("@")) accountId = accountId.split("@")[0];

    res.json({
        "id": req.params.accountId,
        "displayName": accountId,
        "name": "Asteria",
        "email": accountId + "@asteria.com",
        "failedLoginAttempts": 0,
        "lastLogin": new Date().toISOString(),
        "numberOfDisplayNameChanges": 0,
        "ageGroup": "UNKNOWN",
        "headless": false,
        "country": "US",
        "lastName": "Server",
        "preferredLanguage": "en",
        "canUpdateDisplayName": false,
        "tfaEnabled": false,
        "emailVerified": true,
        "minorVerified": false,
        "minorExpected": false,
        "minorStatus": "NOT_MINOR",
        "cabinedMode": false,
        "hasHashedEmail": false
    })
});

router.get('/account/api/public/account/*/externalAuths', (req, res) => {
    res.json([])
});

router.delete('/account/api/oauth/sessions/kill', (req, res) => {
    res.status(204);
    res.end();
});

router.delete('/account/api/oauth/sessions/kill/*', (req, res) => {
    res.status(204);
    res.end();
});

router.get('/account/api/oauth/verify', (req, res) => {
    res.json({
        "token": "asteriatokenlol",
        "session_id": "asteriasessionid",
        "token_type": "bearer",
        "client_id": "asteriaclientidlol",
        "expires_at": 9999999999999,
        "expires_in": 28800,
        "product_id": "prod-fn",
        "deployment_id": "asteriadeploymentidlol"
    });
});

module.exports = router;
