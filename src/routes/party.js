const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// In-memory party storage
const parties = new Map();
const userPartyMap = new Map(); // accountId -> partyId

function makePartyId() {
    return crypto.randomUUID ? crypto.randomUUID() : require("uuid").v4();
}

function makeRevision() {
    return Date.now();
}

function getDefaultPartyMeta() {
    return {
        "Default:PrimaryGameModeId_s": "Playlist_DefaultSolo",
        "Default:PlaylistData_j": JSON.stringify({
            "PlaylistData": {
                "playlistName": "Playlist_DefaultSolo",
                "tournamentId": "",
                "eventWindowId": "",
                "regionId": "EU"
            }
        }),
        "Default:PrivacySettings_j": JSON.stringify({
            "PrivacySettings": {
                "partyType": "Public",
                "partyInviteRestriction": "AnyMember",
                "bOnlyLeaderFriendsCanJoin": false
            }
        }),
        "Default:PartyState_s": "InLobby",
        "Default:PartySize_s": "1",
        "Default:AllowJoinInProgress_b": "false",
        "Default:AthenaSquadFill_b": "true",
        "Default:PartyIsLocked_b": "false"
    };
}

function getDefaultMemberMeta() {
    return {
        "Default:Status_s": "NotReady",
        "Default:ReadyInputType_s": "None",
        "Default:CrossplayPreference_s": "OptedIn",
        "Default:VoiceChatStatus_s": "Disabled",
        "Default:PlatformClass_s": "Desktop",
        "Default:PlatformData_j": JSON.stringify({
            "PlatformData": {
                "platform": "WIN",
                "uniqueId": "",
                "sessionId": ""
            }
        })
    };
}

function createParty(creatorId) {
    const partyId = `Party-${makePartyId()}`;
    const now = new Date().toISOString();
    const party = {
        id: partyId,
        party_type: "Default",
        party_privacy_type: "Public",
        primary_game_session_id: "",
        party_eligibility: [],
        requestee_id: null,
        invitation_id: null,
        build_id: "",
        members: [],
        applicants: [],
        meta: getDefaultPartyMeta(),
        invites: [],
        revision: makeRevision(),
        attributes: {},
        created_at: now,
        updated_at: now,
        notification_sent: false,
        join_info: {
            connection: {},
            meta: {}
        }
    };

    const member = {
        account_id: creatorId,
        role: "CAPTAIN",
        display_name: creatorId,
        joined_at: now,
        updated_at: now,
        meta: getDefaultMemberMeta(),
        revision: makeRevision(),
        connections: []
    };

    party.members.push(member);
    parties.set(partyId, party);
    userPartyMap.set(creatorId, partyId);
    return party;
}

function getParty(partyId) {
    return parties.get(partyId);
}

function getUserParty(accountId) {
    const partyId = userPartyMap.get(accountId);
    if (!partyId) return null;
    return parties.get(partyId);
}

function leaveParty(accountId, partyId) {
    const party = parties.get(partyId);
    if (!party) return false;
    const idx = party.members.findIndex(m => m.account_id === accountId);
    if (idx !== -1) {
        party.members.splice(idx, 1);
        userPartyMap.delete(accountId);
    }
    if (party.members.length === 0) {
        parties.delete(partyId);
    } else {
        // Promote next member to CAPTAIN if captain left
        const hasCaptain = party.members.some(m => m.role === "CAPTAIN");
        if (!hasCaptain && party.members.length > 0) {
            party.members[0].role = "CAPTAIN";
        }
        party.revision = makeRevision();
        party.updated_at = new Date().toISOString();
    }
    return true;
}

// Get user's parties
router.get('/fortnite/api/party/v1/Fortnite/user/:accountId', (req, res) => {
    const party = getUserParty(req.params.accountId);
    res.json({
        current: party ? [party.id] : [],
        pending: [],
        invites: []
    });
});

// Get party details
router.get('/fortnite/api/party/v1/Fortnite/parties/:partyId', (req, res) => {
    const party = getParty(req.params.partyId);
    if (!party) {
        return res.status(404).json({ error: "Party not found" });
    }
    res.json(party);
});

// Create party
router.post('/fortnite/api/party/v1/Fortnite/parties', (req, res) => {
    const config = req.body.config || {};
    const joinInfo = req.body.join_info || {};
    const meta = req.body.meta || {};
    const party = createParty(req.body.join_info?.connection?.id || "unknown");
    
    // Override meta if provided
    Object.assign(party.meta, meta);
    if (joinInfo.meta) Object.assign(party.join_info.meta, joinInfo.meta);
    if (joinInfo.connection) party.join_info.connection = joinInfo.connection;
    
    party.updated_at = new Date().toISOString();
    party.revision = makeRevision();
    res.json(party);
});

// Join party
router.post('/fortnite/api/party/v1/Fortnite/parties/:partyId/members/:accountId/join', (req, res) => {
    const party = getParty(req.params.partyId);
    if (!party) {
        return res.status(404).json({ error: "Party not found" });
    }
    
    const accountId = req.params.accountId;
    const existing = party.members.find(m => m.account_id === accountId);
    if (!existing) {
        const now = new Date().toISOString();
        party.members.push({
            account_id: accountId,
            role: "MEMBER",
            display_name: accountId,
            joined_at: now,
            updated_at: now,
            meta: getDefaultMemberMeta(),
            revision: makeRevision(),
            connections: []
        });
        userPartyMap.set(accountId, party.id);
    }
    
    party.revision = makeRevision();
    party.updated_at = now;
    res.json(party);
});

// Confirm join
router.post('/fortnite/api/party/v1/Fortnite/parties/:partyId/members/:accountId/confirm', (req, res) => {
    res.json({});
});

// Leave party / Kick member
router.delete('/fortnite/api/party/v1/Fortnite/parties/:partyId/members/:accountId', (req, res) => {
    leaveParty(req.params.accountId, req.params.partyId);
    res.status(204).end();
});

// Promote member
router.post('/fortnite/api/party/v1/Fortnite/parties/:partyId/members/:accountId/promote', (req, res) => {
    const party = getParty(req.params.partyId);
    if (!party) return res.status(404).json({ error: "Party not found" });
    
    const member = party.members.find(m => m.account_id === req.params.accountId);
    if (!member) return res.status(404).json({ error: "Member not found" });
    
    party.members.forEach(m => { if (m.role === "CAPTAIN") m.role = "MEMBER"; });
    member.role = "CAPTAIN";
    party.revision = makeRevision();
    party.updated_at = new Date().toISOString();
    res.json(party);
});

// Kick member
router.post('/fortnite/api/party/v1/Fortnite/parties/:partyId/members/:accountId/kick', (req, res) => {
    leaveParty(req.params.accountId, req.params.partyId);
    res.status(204).end();
});

// Delete party
router.delete('/fortnite/api/party/v1/Fortnite/parties/:partyId', (req, res) => {
    const party = getParty(req.params.partyId);
    if (party) {
        party.members.forEach(m => userPartyMap.delete(m.account_id));
        parties.delete(req.params.partyId);
    }
    res.status(204).end();
});

// Update party meta (e.g. playlist, privacy)
router.patch('/fortnite/api/party/v1/Fortnite/parties/:partyId', (req, res) => {
    const party = getParty(req.params.partyId);
    if (!party) return res.status(404).json({ error: "Party not found" });
    
    const { config, join_info, meta, party_state_overrides, party_privacy_type, invite_ttl_seconds } = req.body;
    
    if (config) Object.assign(party, { config });
    if (join_info) {
        if (join_info.meta) Object.assign(party.join_info.meta, join_info.meta);
        if (join_info.connection) party.join_info.connection = join_info.connection;
    }
    if (meta) {
        const deletes = meta.delete || [];
        deletes.forEach(key => delete party.meta[key]);
        Object.assign(party.meta, meta.update || {});
    }
    if (party_privacy_type) party.party_privacy_type = party_privacy_type;
    if (party_state_overrides) Object.assign(party, party_state_overrides);
    
    party.revision = makeRevision();
    party.updated_at = new Date().toISOString();
    res.json(party);
});

// Update member meta (READY UP / NOT READY)
router.patch('/fortnite/api/party/v1/Fortnite/parties/:partyId/members/:accountId/meta', (req, res) => {
    const party = getParty(req.params.partyId);
    if (!party) return res.status(404).json({ error: "Party not found" });
    
    const member = party.members.find(m => m.account_id === req.params.accountId);
    if (!member) return res.status(404).json({ error: "Member not found" });
    
    const body = req.body || {};
    const deletes = body.delete || [];
    const updates = body.update || {};
    
    deletes.forEach(key => delete member.meta[key]);
    Object.assign(member.meta, updates);
    
    member.revision = makeRevision();
    member.updated_at = new Date().toISOString();
    party.revision = makeRevision();
    party.updated_at = new Date().toISOString();
    
    res.json(member);
});

// Update party meta directly at /meta
router.patch('/fortnite/api/party/v1/Fortnite/parties/:partyId/meta', (req, res) => {
    const party = getParty(req.params.partyId);
    if (!party) return res.status(404).json({ error: "Party not found" });
    
    const body = req.body || {};
    const deletes = body.delete || [];
    const updates = body.update || {};
    
    deletes.forEach(key => delete party.meta[key]);
    Object.assign(party.meta, updates);
    
    party.revision = makeRevision();
    party.updated_at = new Date().toISOString();
    res.json(party);
});

// Accept applicant / invite
router.post('/fortnite/api/party/v1/Fortnite/parties/:partyId/applications', (req, res) => {
    res.json({ status: "SENT" });
});

// Get party pings
router.get('/fortnite/api/party/v1/Fortnite/parties/:partyId/pings', (req, res) => {
    res.json([]);
});

module.exports = router;
