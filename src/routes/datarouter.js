const express = require('express');
const router = express.Router();

router.get('/fortnite/api/datacloud', (req, res) => {
    res.json({});
});

router.get('/fortnite/api/datacloud/*', (req, res) => {
    res.json({});
});

module.exports = router;
