const express = require('express');
const router = express.Router();

router.get('/sdk/v1/*', (req, res) => {
    res.json({
        "id": "fortnite",
        "name": "Fortnite",
        "titleId": "Fortnite",
        "deploymentId": "fortnite",
        "productId": "prod-fn",
        "organizationId": "orbit",
        "ownerId": "orbit",
        "environment": "prod",
        "redirectUrl": "https://www.epicgames.com",
        "permissions": [],
        "clientCredentials": {},
        "clientSecret": "",
        "clientSecretValid": 0,
        "authToken": "orbittokenlol",
        "refreshToken": "orbittokenlol",
        "expiresIn": 28800,
        "expiresAt": "9999-12-31T23:59:59.999Z",
        "tokenType": "bearer"
    });
});

module.exports = router;
