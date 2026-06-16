const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

function loadKeychain() {
    const keychainPath = path.join(__dirname, '../../responses/keychain.json');
    if (fs.existsSync(keychainPath)) {
        return JSON.parse(fs.readFileSync(keychainPath, 'utf8'));
    }
    return [];
}

router.get('/fortnite/api/storefront/v2/keychain', (req, res) => {
    res.json(loadKeychain());
});

router.get('/fortnite/api/keychain/*', (req, res) => {
    res.json(loadKeychain());
});

router.get('/catalog/api/shared/bulk/offers', (req, res) => {
    res.json({});
});

module.exports = router;
