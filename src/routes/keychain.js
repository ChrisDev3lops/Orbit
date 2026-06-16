const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.get('/fortnite/api/keychain/*', (req, res) => {
    const keychainPath = path.join(__dirname, '../../responses/keychain.json');
    if (fs.existsSync(keychainPath)) {
        const keychain = JSON.parse(fs.readFileSync(keychainPath, 'utf8'));
        res.json(keychain);
    } else {
        res.json([]);
    }
});

router.post('/fortnite/api/keychain/*', (req, res) => {
    const keychainPath = path.join(__dirname, '../../responses/keychain.json');
    if (fs.existsSync(keychainPath)) {
        const keychain = JSON.parse(fs.readFileSync(keychainPath, 'utf8'));
        res.json(keychain);
    } else {
        res.json([]);
    }
});

module.exports = router;
