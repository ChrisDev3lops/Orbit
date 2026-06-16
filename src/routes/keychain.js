const express = require('express');
const router = express.Router();

router.get('/fortnite/api/keychain/*', (req, res) => {
    res.json({});
});

router.post('/fortnite/api/keychain/*', (req, res) => {
    res.json({});
});

module.exports = router;
