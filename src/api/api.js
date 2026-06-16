const express = require('express');
const router = express.Router();

router.use(require('../routes/account'));
router.use(require('../routes/auth'));
router.use(require('../routes/cloudstorage'));
router.use(require('../routes/contentpages'));
router.use(require('../routes/lightswitch'));
router.use(require('../routes/datarouter'));
router.use(require('../routes/version'));

module.exports = router;

