const express = require('express');
const router = express.Router();

router.get('/fortnite/api/datacloud', (req, res) => {
    res.json({});
});

router.get('/fortnite/api/datacloud/*', (req, res) => {
    res.json({});
});

router.post('/datarouter/api/v1/public/data', (req, res) => {
    res.status(204);
    res.end();
});

router.get('/datarouter/api/v1/public/data', (req, res) => {
    res.json({});
});

module.exports = router;
