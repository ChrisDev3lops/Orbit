const express = require('express');
const router = express.Router();
const { generateShop } = require('../shop/shopGenerator');
const shopConfig = require('../shop/shopConfig.json');

router.get('/fortnite/api/storefront/v2/catalog', (req, res) => {
    const catalog = generateShop(shopConfig.rotation || []);
    res.json(catalog);
});

module.exports = router;
