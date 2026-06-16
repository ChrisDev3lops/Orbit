const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const config = require("../../config.json");

const gameServer = config.gameServer || { ip: "127.0.0.1", port: 7777 };
const wsUrl = config.server?.host ? `${config.server.host}:${config.matchmaker?.wsPort || 80}` : "127.0.0.1";

function makeId() {
    return crypto.randomUUID ? crypto.randomUUID() : require("uuid").v4();
}

function parseBuildInfo(req) {
    const ua = req.headers["user-agent"] || "";
    let season = 2;
    let build = 2.0;
    try {
        const rel = ua.split("Release-")[1];
        if (rel) {
            const b = rel.split("-")[0];
            const parts = b.split(".");
            season = Number(parts[0]);
            build = Number(parts.slice(0, 2).join("."));
        }
    } catch {}
    return { season, build };
}

function getPlaylistForBucket(bucketId) {
    if (!bucketId) return "Playlist_DefaultSolo";
    const lower = bucketId.toLowerCase();
    if (lower.includes("solo")) return "Playlist_DefaultSolo";
    if (lower.includes("duo")) return "Playlist_DefaultDuo";
    if (lower.includes("squad")) return "Playlist_DefaultSquad";
    if (lower.includes("creative")) return "Playlist_Creative_Powerup";
    if (lower.includes("playground")) return "Playlist_Playground";
    if (lower.includes("ltm")) return "Playlist_LTM";
    return "Playlist_DefaultSolo";
}
router.get("/fortnite/api/game/v2/matchmakingservice/ticket/player/*", (req, res) => {
    const bucketId = req.query.bucketId || "0";
    res.cookie("currentbuildUniqueId", bucketId.split(":")[0] || "0");

    res.json({
        serviceUrl: `ws://${wsUrl}`,
        ticketType: "mms-player",
        payload: "69=",
        signature: "420="
    });
});

router.get("/fortnite/api/game/v2/matchmaking/ticket/player/:accountId", (req, res) => {
    const bucketId = req.query.bucketId || "0";
    res.cookie("currentbuildUniqueId", bucketId.split(":")[0] || "0");

    res.json({
        serviceUrl: `ws://${wsUrl}`,
        ticketType: "mms-player",
        payload: "69=",
        signature: "420="
    });
});

router.get("/fortnite/api/matchmaking/session/findPlayer/*", (req, res) => {
    res.status(200).end();
});

router.get("/fortnite/api/game/v2/matchmaking/account/:accountId/session/:sessionId", (req, res) => {
    res.json({
        accountId: req.params.accountId,
        sessionId: req.params.sessionId,
        key: "AOJEv8uTFmUh7XM2328kq9rlAzeQ5xzWzPIiyKn2s7s="
    });
});

router.get("/fortnite/api/matchmaking/session/:sessionId", (req, res) => {
    const { season } = parseBuildInfo(req);
    const playlist = getPlaylistForBucket(req.cookies.currentbuildUniqueId);

    const isChapter1 = season >= 1 && season <= 10;
    const region = "EU";
    const subregion = "GB";

    res.json({
        id: req.params.sessionId,
        ownerId: makeId().replace(/-/g, "").toUpperCase(),
        ownerName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
        serverName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968",
        serverAddress: gameServer.ip,
        serverPort: Number(gameServer.port),
        maxPublicPlayers: 100,
        openPublicPlayers: 95,
        maxPrivatePlayers: 0,
        openPrivatePlayers: 0,
        attributes: {
            REGION_s: region,
            GAMEMODE_s: "FORTATHENA",
            ALLOWBROADCASTING_b: true,
            SUBREGION_s: subregion,
            DCID_s: "FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880",
            tenant_s: "Fortnite",
            MATCHMAKINGPOOL_s: "Any",
            STORMSHIELDDEFENSETYPE_i: 0,
            HOTFIXVERSION_i: 0,
            PLAYLISTNAME_s: playlist,
            SESSIONKEY_s: makeId().replace(/-/g, "").toUpperCase(),
            TENANT_s: "Fortnite",
            BEACONPORT_i: 15009,
            ...(isChapter1 ? {} : {
                BUILDUNIQUEID_s: req.cookies.currentbuildUniqueId || "0"
            })
        },
        publicPlayers: [],
        privatePlayers: [],
        totalPlayers: 1,
        allowJoinInProgress: false,
        shouldAdvertise: false,
        isDedicated: true,
        usesStats: false,
        allowInvites: true,
        usesPresence: false,
        allowJoinViaPresence: true,
        allowJoinViaPresenceFriendsOnly: false,
        buildUniqueId: req.cookies.currentbuildUniqueId || "0",
        lastUpdated: new Date().toISOString(),
        started: false
    });
});

router.post("/fortnite/api/matchmaking/session/:sessionId/join", (req, res) => {
    res.status(204).end();
});

router.post("/fortnite/api/matchmaking/session/matchMakingRequest", (req, res) => {
    res.json([]);
});

router.delete("/fortnite/api/matchmaking/session/:sessionId", (req, res) => {
    res.status(204).end();
});
router.get("/fortnite/api/matchmaking/session/:sessionId/players", (req, res) => {
    res.json([]);
});

router.get("/fortnite/api/game/v2/matchmaking/account/:accountId/session/:sessionId/players", (req, res) => {
    res.json([]);
});

module.exports = router;
