const express = require('express');
const router = express.Router();

router.post('/fortnite/api/game/v2/chat/*/*/*/pc', (req, res) => {
    res.json({ "GlobalChatRooms": [{"roomName":"orbitglobal"}] });
});

router.post('/fortnite/api/game/v2/chat/*/recommendGeneralChatRooms/pc', (req, res) => {
    res.json({});
});

module.exports = router;
