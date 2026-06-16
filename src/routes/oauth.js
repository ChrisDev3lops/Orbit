const express = require('express');
const router = express.Router();

router.post('/auth/v1/oauth/token', (req, res) => {
    res.json({
        "access_token": "asteriatokenlol",
        "token_type": "bearer",
        "expires_in": 28800,
        "expires_at": "9999-12-31T23:59:59.999Z",
        "nonce": "asteriaserver",
        "features": ["AntiCheat", "CommerceService", "Connect", "ContentService", "Ecom", "EpicConnect", "Inventories", "LockerService", "MagpieService", "Matchmaking Service", "PCBService", "QuestService", "Stats"],
        "deployment_id": "asteriadeploymentidlol",
        "organization_id": "asteriaorganizationidlol",
        "organization_user_id": "asteriaorganisationuseridlol",
        "product_id": "prod-fn",
        "product_user_id": "asteriaproductuseridlol",
        "product_user_id_created": false,
        "id_token": "asteriaidtokenlol",
        "sandbox_id": "fn"
    })
});

router.post('/epic/oauth/v2/token', (req, res) => {
    var accountId = req.body.account_id || "asteria";
    if (accountId.includes("@")) accountId = accountId.split("@")[0];

    res.json({
        "scope": "basic_profile friends_list openid presence",
        "token_type": "bearer",
        "access_token": "asteriatokenlol",
        "expires_in": 28800,
        "expires_at": "9999-12-31T23:59:59.999Z",
        "refresh_token": "asteriatokenlol",
        "refresh_expires_in": 86400,
        "refresh_expires_at": "9999-12-31T23:59:59.999Z",
        "account_id": accountId,
        "client_id": "asteriaclientidlol",
        "application_id": "asteriaapplicationidlol",
        "selected_account_id": accountId,
        "id_token": "asteriatokenlol"
    })
});

router.get('/epic/id/v2/sdk/accounts', (req, res) => {
    var accountId = req.query.accountId || "asteria";
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
