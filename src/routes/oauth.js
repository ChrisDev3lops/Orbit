const express = require('express');
const router = express.Router();

router.post('/auth/v1/oauth/token', (req, res) => {
    res.json({
        "access_token": "orbittokenlol",
        "token_type": "bearer",
        "expires_in": 28800,
        "expires_at": "9999-12-31T23:59:59.999Z",
        "nonce": "orbitserver",
        "features": ["AntiCheat", "CommerceService", "Connect", "ContentService", "Ecom", "EpicConnect", "Inventories", "LockerService", "MagpieService", "Matchmaking Service", "PCBService", "QuestService", "Stats"],
        "deployment_id": "orbitdeploymentidlol",
        "organization_id": "orbitorganizationidlol",
        "organization_user_id": "orbitorganisationuseridlol",
        "product_id": "prod-fn",
        "product_user_id": "orbitproductuseridlol",
        "product_user_id_created": false,
        "id_token": "orbitidtokenlol",
        "sandbox_id": "fn"
    })
});

router.post('/epic/oauth/v2/token', (req, res) => {
    var accountId = req.body.account_id;
    if (!accountId) {
        return res.status(400).json({ error: "Missing account_id" });
    }
    if (accountId.includes("@")) accountId = accountId.split("@")[0];

    res.json({
        "scope": "basic_profile friends_list openid presence",
        "token_type": "bearer",
        "access_token": "orbittokenlol",
        "expires_in": 28800,
        "expires_at": "9999-12-31T23:59:59.999Z",
        "refresh_token": "orbittokenlol",
        "refresh_expires_in": 86400,
        "refresh_expires_at": "9999-12-31T23:59:59.999Z",
        "account_id": accountId,
        "client_id": "orbitclientidlol",
        "application_id": "orbitapplicationidlol",
        "selected_account_id": accountId,
        "id_token": "orbittokenlol"
    })
});

router.get('/epic/id/v2/sdk/accounts', (req, res) => {
    var accountId = req.query.accountId;
    if (!accountId) {
        return res.status(400).json({ error: "Missing accountId" });
    }
    if (accountId.includes("@")) accountId = accountId.split("@")[0];

    res.json([{
        "accountId": accountId,
        "displayName": accountId,
        "preferredLanguage": "en",
        "cabinedMode": false,
        "empty": false
    }])
});

module.exports = router;
