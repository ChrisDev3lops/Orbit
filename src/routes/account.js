const express = require('express');
const router = express.Router();

router.post('/account/api/oauth/token', (req, res) => {
    var accountId = req.body.account_id || req.body.username;
    if (!accountId) {
        return res.status(400).json({ error: "Missing account_id or username" });
    }
    if (accountId.includes("@")) accountId = accountId.split("@")[0];

    res.json({
        "access_token": "orbittokenlol",
        "expires_in": 28800,
        "expires_at": "9999-12-31T23:59:59.999Z",
        "token_type": "bearer",
        "refresh_token": "orbittokenlol",
        "refresh_expires": 86400,
        "refresh_expires_at": "9999-12-31T23:59:59.999Z",
        "account_id": accountId,
        "client_id": "orbitclientidlol",
        "internal_client": true,
        "client_service": "fortnite",
        "displayName": accountId,
        "app": "fortnite",
        "in_app_id": accountId,
        "device_id": "orbitdeviceidlol"
    });
});

router.post('/account/api/oauth/exchange', (req, res) => {
    res.json({});
});

router.get('/account/api/epicdomains/ssodomains', (req, res) => {
    res.json([
        "unrealengine.com",
        "unrealtournament.com",
        "fortnite.com",
        "epicgames.com"
    ]);
});

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
        "name": "Orbit",
        "email": accountId + "@orbit.com",
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
        "token": "orbittokenlol",
        "session_id": "orbitsessionid",
        "token_type": "bearer",
        "client_id": "orbitclientidlol",
        "internal_client": true,
        "client_service": "fortnite",
        "account_id": req.query.account_id || "unknown",
        "expires_in": 28800,
        "expires_at": "9999-12-31T23:59:59.999Z",
        "auth_method": "exchange_code",
        "display_name": req.query.account_id || "unknown",
        "app": "fortnite",
        "in_app_id": req.query.account_id || "unknown",
        "device_id": "orbitdeviceidlol"
    });
});

module.exports = router;
