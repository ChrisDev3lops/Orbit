const { Server: WebSocketServer } = require("ws");
const crypto = require("crypto");
const config = require("../../config.json");
const logger = require("../structs/logger");

const mmConfig = config.matchmaker || {};

function startWsMatchmaker() {
    if (!mmConfig.enabled) {
        logger.Log("[MATCHMAKER] WebSocket matchmaker disabled in config");
        return;
    }

    const port = mmConfig.wsPort || 80;
    const wss = new WebSocketServer({ port });

    wss.on("listening", () => {
        logger.Log(`[MATCHMAKER] WebSocket matchmaker listening on port ${port}`);
    });

    wss.on("connection", (ws, req) => {
        if (ws.protocol && ws.protocol.toLowerCase().includes("xmpp")) {
            return ws.close();
        }

        logger.Log(`[MATCHMAKER] Client connected from ${req.socket.remoteAddress}`);

        const ticketId = crypto.createHash("md5").update(`1${Date.now()}`).digest("hex");
        const matchId = crypto.createHash("md5").update(`2${Date.now()}`).digest("hex");
        const sessionId = crypto.createHash("md5").update(`3${Date.now()}`).digest("hex");

        const delays = {
            connecting: mmConfig.delayConnecting || 200,
            waiting: mmConfig.delayWaiting || 1000,
            queued: mmConfig.delayQueued || 2000,
            sessionAssignment: mmConfig.delaySessionAssignment || 6000,
            join: mmConfig.delayJoin || 8000
        };

        function sendStatus(state, extra = {}) {
            try {
                ws.send(JSON.stringify({
                    payload: { state, ...extra },
                    name: "StatusUpdate"
                }));
            } catch (e) {}
        }

        function sendPlay() {
            try {
                ws.send(JSON.stringify({
                    payload: {
                        matchId,
                        sessionId,
                        joinDelaySec: 1
                    },
                    name: "Play"
                }));
            } catch (e) {}
        }

        setTimeout(() => sendStatus("Connecting"), delays.connecting);
        setTimeout(() => sendStatus("Waiting", { totalPlayers: 1, connectedPlayers: 1 }), delays.waiting);
        setTimeout(() => sendStatus("Queued", { ticketId, queuedPlayers: 0, estimatedWaitSec: 0, status: {} }), delays.queued);
        setTimeout(() => sendStatus("SessionAssignment", { matchId }), delays.sessionAssignment);
        setTimeout(() => sendPlay(), delays.join);

        ws.on("close", () => {
            logger.Log("[MATCHMAKER] Client disconnected");
        });

        ws.on("error", () => {});
    });

    return wss;
}

module.exports = { startWsMatchmaker };
