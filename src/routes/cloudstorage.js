const express = require('express');
const router = express.Router();

router.get('/fortnite/api/cloudstorage/system', (req, res) => {
    res.json([]);
});

router.get('/fortnite/api/cloudstorage/user/:accountId', (req, res) => {
    res.json([]);
});

router.get('/fortnite/api/cloudstorage/user/:accountId/:fileName', (req, res) => {
    res.json({});
});

router.put('/fortnite/api/cloudstorage/user/:accountId/:fileName', (req, res) => {
    res.json({});
});

router.delete('/fortnite/api/cloudstorage/user/:accountId/:fileName', (req, res) => {
    res.json({});
});

module.exports = router;
