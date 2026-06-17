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

function saveProfile(profileId, profile) {
    const profilePath = path.join(profilesDir, profileId + '.json');
    fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
}

function getLevelFromXp(xp) {
    // Chapter 1: 80,000 XP per level
    return Math.floor(xp / 80000) + 1;
}

// Endpoint for the dedicated server to report match XP
router.post('/api/v1/dedicated/profile_update', (req, res) => {
    const { AccountId, AmountOfXP, QuestsCompleted, QuestsProgressed } = req.body;

    if (!AccountId || typeof AmountOfXP !== 'number') {
        return res.status(400).json({ error: 'Missing AccountId or AmountOfXP' });
    }

    const profile = getProfile('athena');
    const attrs = profile.stats.attributes;

    const oldXp = attrs.xp || 0;
    const oldBookXp = attrs.book_xp || 0;
    const newXp = oldXp + AmountOfXP;
    const newBookXp = oldBookXp + AmountOfXP;

    attrs.xp = newXp;
    attrs.book_xp = newBookXp;
    attrs.level = getLevelFromXp(newXp);
    attrs.book_level = getLevelFromXp(newBookXp);
    attrs.accountLevel = attrs.level;

    profile.rvn += 1;
    profile.commandRevision += 1;
    saveProfile('athena', profile);

    res.json({
        success: true,
        accountId: AccountId,
        xpGained: AmountOfXP,
        totalXp: newXp,
        newLevel: attrs.level
    });
});

module.exports = router;
