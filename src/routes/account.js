const express = require('express');
const router = express.Router();

router.get('/account/api/public/account/:accountId', (req, res) => {
    res.json({
        id: req.params.accountId,
        displayName: req.params.accountId,
        name: req.params.accountId,
        email: `${req.params.accountId}@fortnite.com`,
        failedLoginAttempts: 0,
        numberOfUsers: 1,
        numberOfDisplayNameChanges: 0,
        ageGroup: "ADULT",
        headless: false,
        canUpdateDisplayName: true,
        emailVerified: true,
        minorVerified: false,
        minorExpected: false,
        minorStatus: "NOT_MINOR",
        cabinedMode: false,
        hasHashedEmail: false
    });
});

router.get('/account/api/public/account', (req, res) => {
    const accountIds = req.query.accountId || [];
    const accounts = Array.isArray(accountIds) ? accountIds : [accountIds];
    
    res.json(accounts.map(accountId => ({
        id: accountId,
        displayName: accountId,
        name: accountId,
        email: `${accountId}@fortnite.com`,
        failedLoginAttempts: 0,
        numberOfUsers: 1,
        numberOfDisplayNameChanges: 0,
        ageGroup: "ADULT",
        headless: false,
        canUpdateDisplayName: true,
        emailVerified: true,
        minorVerified: false,
        minorExpected: false,
        minorStatus: "NOT_MINOR",
        cabinedMode: false,
        hasHashedEmail: false
    })));
});

module.exports = router;
