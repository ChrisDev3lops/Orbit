const express = require('express');
const router = express.Router();

router.get('/fortnite/api/game/v2/world/info', (req, res) => res.json({}));
router.get('/fortnite/api/game/v2/br/squad/account/:accountId', (req, res) => res.json([]));
router.get('/fortnite/api/game/v2/br/directory/account/:accountId', (req, res) => res.json([]));
router.get('/fortnite/api/game/v2/creative/lookup', (req, res) => res.json({}));
router.get('/fortnite/api/game/v2/news/banners/:accountId', (req, res) => res.json([]));
router.get('/fortnite/api/game/v2/news/smart/:accountId', (req, res) => res.json([]));
router.get('/fortnite/api/game/v2/twitch/account/:accountId', (req, res) => res.json({}));
router.get('/fortnite/api/game/v2/privacy/account/:accountId', (req, res) => res.json({ accountId: req.params.accountId, optOutOfPublicLeaderboards: false }));
router.get('/fortnite/api/cloudstorage/system/config', (req, res) => res.json({ "LastUpdated": new Date().toISOString(), "AppVersions": {} }));
router.get('/fortnite/api/receipts/v1/account/:accountId/receipts', (req, res) => res.json([]));
router.get('/fortnite/api/game/v2/events/:accountId', (req, res) => res.json([]));
router.get('/fortnite/api/game/v2/handshake/:accountId', (req, res) => res.json({}));
router.get('/fortnite/api/game/v2/waitingroom/:accountId', (req, res) => res.json({}));
router.get('/fortnite/api/game/v2/presence/:accountId', (req, res) => res.json({ "Status": "ONLINE", "bIsPlaying": false, "bIsJoinable": false, "bHasVoiceChat": false, "bIsInGame": false, "bIsInLobby": true, "SessionId": "", "Properties": {} }));
router.get('/fortnite/api/game/v2/leaderboards/cohort/:accountId', (req, res) => res.json([]));
router.get('/fortnite/api/game/v2/statsv2/account/:accountId', (req, res) => res.json({}));
router.get('/fortnite/api/game/v2/stats/account/:accountId/bulk/window/alltime', (req, res) => res.json({}));
router.get('/fortnite/api/game/v2/achievements/account/:accountId', (req, res) => res.json({}));
router.get('/fortnite/api/game/v2/creative/creative-island/account/:accountId', (req, res) => res.json({}));
router.get('/fortnite/api/game/v2/creative/creative-island/account/:accountId/history', (req, res) => res.json([]));
router.get('/fortnite/api/game/v2/creative/creative-island/search', (req, res) => res.json([]));
router.get('/fortnite/api/game/v2/creative/creative-island/featured', (req, res) => res.json([]));
router.get('/fortnite/api/game/v2/creative/creative-island/recommended', (req, res) => res.json([]));

module.exports = router;
