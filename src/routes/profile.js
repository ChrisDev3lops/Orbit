const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const profilesDir = path.join(__dirname, '../../profiles');

function getProfile(profileId) {
    const profilePath = path.join(profilesDir, profileId + '.json');

    let profile;
    if (fs.existsSync(profilePath)) {
        profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    } else {
        profile = {};
    }

    if (!profile.rvn) profile.rvn = 0;
    if (!profile.items) profile.items = {};
    if (!profile.stats) profile.stats = {};
    if (!profile.stats.attributes) profile.stats.attributes = {};
    if (!profile.commandRevision) profile.commandRevision = 0;

    return profile;
}

router.post('/fortnite/api/game/v2/profile/:accountId/client/*', (req, res) => {
    const profileId = req.query.profileId || "athena";
    const profile = getProfile(profileId);

    let applyProfileChanges = [];
    const baseRevision = profile.rvn || 0;
    const queryRevision = req.query.rvn || -1;

    if (queryRevision != baseRevision) {
        applyProfileChanges = [{
            changeType: "fullProfileUpdate",
            profile: profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: profileId,
        profileChangesBaseRevision: baseRevision,
        profileChanges: applyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

router.post('/fortnite/api/game/v2/profile/:accountId/dedicated_server/*', (req, res) => {
    const profileId = req.query.profileId || "athena";
    const profile = getProfile(profileId);

    let applyProfileChanges = [];
    const baseRevision = profile.rvn || 0;
    const queryRevision = req.query.rvn || -1;

    if (queryRevision != baseRevision) {
        applyProfileChanges = [{
            changeType: "fullProfileUpdate",
            profile: profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: profileId,
        profileChangesBaseRevision: baseRevision,
        profileChanges: applyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

module.exports = router;
