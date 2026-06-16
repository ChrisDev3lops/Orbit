const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// In-memory arena state
const arenaLeaderboards = new Map(); // eventWindowId -> [{accountId, score, matchesPlayed}]
const arenaMatchHistory = new Map(); // accountId -> [{sessionId, placement, points, timestamp}]
const activeSessions = new Map(); // sessionId -> sessionData

// OG Arena Season 1 scoring rules
const ogArenaScoringRules = {
    ruleSetName: "OG_Arena_Solo",
    ruleSetType: "Standard",
    trackType: "Hype",
    pointsEarnedForMatchPlacement: [],
    pointsEarnedForMatchEliminations: [
        { pointMultiplier: 1, pointsEarned: 1 }
    ]
};

// Generate placement points table (1-50)
for (let i = 1; i <= 50; i++) {
    let points = 0;
    if (i === 1) points = 15;
    else if (i === 2) points = 12;
    else if (i <= 4) points = 10;
    else if (i <= 8) points = 8;
    else if (i <= 16) points = 5;
    else if (i <= 25) points = 3;
    else if (i <= 50) points = 1;
    ogArenaScoringRules.pointsEarnedForMatchPlacement.push({
        placement: i,
        pointsEarned: points
    });
}

function makeId() {
    return crypto.randomUUID ? crypto.randomUUID() : require("uuid").v4();
}

function getArenaProfilePath(accountId) {
    return path.join(__dirname, '../../profiles', `arena_${accountId}.json`);
}

function getArenaProfile(accountId) {
    const profilePath = getArenaProfilePath(accountId);
    let profile;
    if (fs.existsSync(profilePath)) {
        profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    } else {
        profile = {
            hype: 0,
            totalMatchesPlayed: 0,
            totalWins: 0,
            totalKills: 0,
            highestPlacement: 0,
            history: []
        };
    }
    return profile;
}

function saveArenaProfile(accountId, profile) {
    const profilePath = getArenaProfilePath(accountId);
    fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
}

// Tournament Session Info
router.get('/fortnite/api/game/v2/tournament/sessionInfo', (req, res) => {
    res.json({
        tournamentDisplayId: "OG_Arena_S1",
        eventId: "OG_Arena",
        eventWindowId: "OG_Arena_Window1",
        sessionId: `session_${Date.now()}`,
        sessionType: "Qualifiers",
        phaseIndex: 0,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        scoringRuleSet: ogArenaScoringRules,
        matchCap: 10,
        sessionFlags: {
            isLimitedTimeEvent: true,
            requiresSquadFill: false,
            showSessionRefreshPrompt: true
        }
    });
});

// Get active tournament events
router.get('/fortnite/api/game/v2/events/:accountId', (req, res) => {
    res.json([
        {
            id: "OG_Arena",
            displayName: "OG Arena",
            description: "Original Fortnite Arena mode",
            eventWindows: [
                {
                    id: "OG_Arena_Window1",
                    name: "Solo Qualifiers",
                    beginTime: new Date().toISOString(),
                    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    scoringRules: ogArenaScoringRules,
                    maxMatches: 10,
                    isActive: true
                }
            ]
        }
    ]);
});

// Tournament metadata
router.get('/fortnite/api/game/v2/tournament/:eventId/:eventWindowId/metadata', (req, res) => {
    res.json({
        eventId: req.params.eventId,
        eventWindowId: req.params.eventWindowId,
        displayName: "OG Arena",
        description: "Original Fortnite Arena mode",
        scoringRules: ogArenaScoringRules,
        matchCap: 10,
        region: "EU",
        platform: "PC"
    });
});

// Leaderboard for an event window
router.get('/fortnite/api/game/v2/tournament/:eventId/:eventWindowId/leaderboard', (req, res) => {
    const { eventWindowId } = req.params;
    const entries = arenaLeaderboards.get(eventWindowId) || [];
    const sorted = entries.sort((a, b) => b.score - a.score).slice(0, 100);
    
    res.json({
        eventId: req.params.eventId,
        eventWindowId,
        totalPages: 1,
        currentPage: Number(req.query.page || 1),
        entries: sorted.map((e, idx) => ({
            rank: idx + 1,
            accountId: e.accountId,
            displayName: e.displayName || e.accountId,
            score: e.score,
            matchesPlayed: e.matchesPlayed || 0,
            wins: e.wins || 0,
            hype: e.hype || 0
        }))
    });
});

// Player's match history for an event window
router.get('/fortnite/api/game/v2/tournament/:eventId/:eventWindowId/history/:accountId', (req, res) => {
    const history = arenaMatchHistory.get(req.params.accountId) || [];
    res.json({
        eventId: req.params.eventId,
        eventWindowId: req.params.eventWindowId,
        accountId: req.params.accountId,
        matches: history.filter(h => h.eventWindowId === req.params.eventWindowId)
    });
});

// Report score from GS or client
router.post('/fortnite/api/game/v2/tournament/scoreReport', (req, res) => {
    const { accountId, eventId, eventWindowId, placement, eliminations, sessionId } = req.body;
    if (!accountId || !placement) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate points
    let placementPoints = 0;
    if (placement === 1) placementPoints = 15;
    else if (placement === 2) placementPoints = 12;
    else if (placement <= 4) placementPoints = 10;
    else if (placement <= 8) placementPoints = 8;
    else if (placement <= 16) placementPoints = 5;
    else if (placement <= 25) placementPoints = 3;
    else if (placement <= 50) placementPoints = 1;

    const killPoints = (eliminations || 0) * 1;
    const totalPoints = placementPoints + killPoints;

    // Update arena profile
    const profile = getArenaProfile(accountId);
    profile.hype += totalPoints;
    profile.totalMatchesPlayed += 1;
    if (placement === 1) profile.totalWins += 1;
    profile.totalKills += (eliminations || 0);
    if (placement < profile.highestPlacement || profile.highestPlacement === 0) {
        profile.highestPlacement = placement;
    }

    const matchRecord = {
        sessionId: sessionId || makeId(),
        eventId: eventId || "OG_Arena",
        eventWindowId: eventWindowId || "OG_Arena_Window1",
        placement,
        eliminations: eliminations || 0,
        placementPoints,
        killPoints,
        totalPoints,
        timestamp: new Date().toISOString()
    };
    profile.history.push(matchRecord);
    if (profile.history.length > 50) profile.history.shift(); // keep last 50
    saveArenaProfile(accountId, profile);

    // Update leaderboard
    let leaderboard = arenaLeaderboards.get(eventWindowId || "OG_Arena_Window1") || [];
    const existing = leaderboard.find(e => e.accountId === accountId);
    if (existing) {
        existing.score += totalPoints;
        existing.matchesPlayed += 1;
        existing.wins += (placement === 1 ? 1 : 0);
        existing.hype = profile.hype;
    } else {
        leaderboard.push({
            accountId,
            displayName: accountId,
            score: totalPoints,
            matchesPlayed: 1,
            wins: placement === 1 ? 1 : 0,
            hype: profile.hype
        });
    }
    arenaLeaderboards.set(eventWindowId || "OG_Arena_Window1", leaderboard);

    // Update match history
    let history = arenaMatchHistory.get(accountId) || [];
    history.push(matchRecord);
    arenaMatchHistory.set(accountId, history);

    res.json({
        success: true,
        placementPoints,
        killPoints,
        totalPoints,
        newHypeTotal: profile.hype
    });
});

// Get player's arena stats
router.get('/fortnite/api/game/v2/tournament/stats/:accountId', (req, res) => {
    const profile = getArenaProfile(req.params.accountId);
    res.json({
        accountId: req.params.accountId,
        hype: profile.hype,
        totalMatchesPlayed: profile.totalMatchesPlayed,
        totalWins: profile.totalWins,
        totalKills: profile.totalKills,
        highestPlacement: profile.highestPlacement,
        recentHistory: profile.history.slice(-10)
    });
});

// Get player's hype for event window
router.get('/fortnite/api/game/v2/tournament/:eventId/:eventWindowId/hype/:accountId', (req, res) => {
    const profile = getArenaProfile(req.params.accountId);
    res.json({
        accountId: req.params.accountId,
        eventId: req.params.eventId,
        eventWindowId: req.params.eventWindowId,
        hype: profile.hype,
        matchesPlayed: profile.totalMatchesPlayed
    });
});

module.exports = router;
