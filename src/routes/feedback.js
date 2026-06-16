const express = require('express');
const router = express.Router();

router.post('/fortnite/api/feedback/*', (req, res) => {
    res.status(200);
    res.end();
});

module.exports = router;
