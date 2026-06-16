const express = require('express');
const router = express.Router();

router.use(require('../routes/maintenance'));
router.use(require('../routes/account'));
router.use(require('../routes/auth'));
router.use(require('../routes/oauth'));
router.use(require('../routes/sdk'));
router.use(require('../routes/launcher'));
router.use(require('../routes/cloudstorage'));
router.use(require('../routes/contentpages'));
router.use(require('../routes/lightswitch'));
router.use(require('../routes/datarouter'));
router.use(require('../routes/version'));
router.use(require('../routes/profile'));
router.use(require('../routes/mcp'));
router.use(require('../routes/keychain'));
router.use(require('../routes/matchmaking'));
router.use(require('../routes/party'));
router.use(require('../routes/presence'));
router.use(require('../routes/friends'));
router.use(require('../routes/shop'));
router.use(require('../routes/purchase'));
router.use(require('../routes/timeline'));

module.exports = router;

