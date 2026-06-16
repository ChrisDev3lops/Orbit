const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

function getProfile(profileId, accountId) {
    const profilePath = path.join(__dirname, '../../profiles', profileId + '.json');
    
    if (fs.existsSync(profilePath)) {
        const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
        profile.accountId = accountId;
        return profile;
    }
    
    return {
        accountId: accountId,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        rvn: 1,
        wn: 1,
        profileId: profileId,
        version: "jan_2025",
        items: {},
        stats: {
            attributes: {
                current_mtx_balance: 10000,
                current_season_level: 100,
                season_num: 2,
                book_level: 100,
                book_xp: 1000000,
                battlestars: 1000,
                xp_boosts: [],
                friend_xp_boosts: [],
                homebase_rating: 1,
                has_linked_device: false,
                in_app_purchases: {},
                mfa_enabled: false,
                monthly_vbucks: 0,
                num_vbucks_purchased: 0,
                platform: "Windows",
                remaining_daily_match_play_count: 0,
                remaining_timed_match_play_count: 0,
                voice_chat_enabled: false
            }
        },
        commandRevision: 1
    };
}

router.get('/fortnite/api/game/v2/profile/:accountId', (req, res) => {
    const profileId = req.query.profileId || "athena";
    const profile = getProfile(profileId, req.params.accountId);
    
    res.json({
        profileRevision: profile.rvn || 1,
        profileId: profileId,
        profileChangesBaseRevision: profile.rvn || 1,
        profileChanges: [
            {
                changeType: "fullProfileUpdate",
                profile: profile
            }
        ],
        profileCommandRevision: profile.commandRevision || 1,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

router.post('/fortnite/api/game/v2/profile/:accountId/client/QueryProfile', (req, res) => {
    const profileId = req.body.profileId || "athena";
    const profile = getProfile(profileId, req.params.accountId);
    
    res.json({
        profileRevision: profile.rvn || 1,
        profileId: profileId,
        profileChangesBaseRevision: profile.rvn || 1,
        profileChanges: [
            {
                changeType: "fullProfileUpdate",
                profile: profile
            }
        ],
        profileCommandRevision: profile.commandRevision || 1,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

router.post('/fortnite/api/game/v2/profile/:accountId/client/ClientQuestLogin', (req, res) => {
    const profile = getProfile("athena", req.params.accountId);
    
    res.json({
        profileRevision: profile.rvn || 1,
        profileId: "athena",
        profileChangesBaseRevision: profile.rvn || 1,
        profileChanges: [
            {
                changeType: "fullProfileUpdate",
                profile: profile
            }
        ],
        profileCommandRevision: profile.commandRevision || 1,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

router.post('/fortnite/api/game/v2/profile/:accountId/client/SetMtxPlatform', (req, res) => {
    const profile = getProfile("athena", req.params.accountId);
    
    res.json({
        profileRevision: profile.rvn || 1,
        profileId: "athena",
        profileChangesBaseRevision: profile.rvn || 1,
        profileChanges: [
            {
                changeType: "fullProfileUpdate",
                profile: profile
            }
        ],
        profileCommandRevision: profile.commandRevision || 1,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

router.post('/fortnite/api/game/v2/profile/:accountId/client/PurchaseCatalogEntry', (req, res) => {
    const profile = getProfile("athena", req.params.accountId);
    
    res.json({
        profileRevision: profile.rvn || 1,
        profileId: "athena",
        profileChangesBaseRevision: profile.rvn || 1,
        profileChanges: [
            {
                changeType: "fullProfileUpdate",
                profile: profile
            }
        ],
        profileCommandRevision: profile.commandRevision || 1,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

module.exports = router;
