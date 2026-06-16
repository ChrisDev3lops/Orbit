const express = require('express');
const router = express.Router();
const { getContentPages } = require('../shop/contentpages');

router.get('/fortnite/api/contentpages', (req, res) => {
    res.json(getContentPages(req));
});

router.get('/fortnite/api/contentpages/*', (req, res) => {
    res.json(getContentPages(req));
});

module.exports = router;
