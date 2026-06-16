const express = require('express');
const router = express.Router();

router.get('/socialban/api/public/v1/*', (req, res) => {
    res.json({
        "bans": [],
        "warnings": []
    });
});

module.exports = router;
