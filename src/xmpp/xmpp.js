const config = require('../../config.json');
const { Server } = require('node-xmpp-server');
const { Client } = require('node-xmpp-client');
const logger = require('../structs/logger');

const clients = new Map();

if (config.features.xmpp.enabled) {
    const xmppServer = new Server({
        port: config.features.xmpp.port || 5222,
        domain: 'asteria.local'
    });

    xmppServer.on('connect', (client) => {
        const jid = client.jid;
        clients.set(jid, client);
        logger.Log(`XMPP Client connected: ${jid}`);

        client.on('stanza', (stanza) => {
            if (stanza.is('presence')) {
                handlePresence(stanza, client);
            } else if (stanza.is('message')) {
                handleMessage(stanza, client);
            } else if (stanza.is('iq')) {
                handleIQ(stanza, client);
            }
        });

        client.on('disconnect', () => {
            clients.delete(jid);
            logger.Log(`XMPP Client disconnected: ${jid}`);
        });

        client.send(new xmppServer.Element('presence', { type: 'available' }));
    });

    function handlePresence(stanza, client) {
        const type = stanza.attr('type') || 'available';
        const from = stanza.attr('from');
        const to = stanza.attr('to');

        clients.forEach((c) => {
            if (c !== client) {
                c.send(stanza);
            }
        });
    }

    function handleMessage(stanza, client) {
        const from = stanza.attr('from');
        const to = stanza.attr('to');
        const body = stanza.getChild('body');

        if (to) {
            const targetClient = clients.get(to);
            if (targetClient) {
                targetClient.send(stanza);
            }
        }
    }

    function handleIQ(stanza, client) {
        const type = stanza.attr('type');
        const id = stanza.attr('id');

        if (type === 'get') {
            const response = new xmppServer.Element('iq', {
                type: 'result',
                id: id,
                from: stanza.attr('to'),
                to: stanza.attr('from')
            });
            client.send(response);
        }
    }

    xmppServer.on('listening', () => {
        logger.Log(`XMPP Server listening on port ${config.features.xmpp.port || 5222}`);
    });

    module.exports = {
        xmppServer,
        clients,
        broadcast: (stanza) => {
            clients.forEach((client) => {
                client.send(stanza);
            });
        }
    };
} else {
    module.exports = {
        xmppServer: null,
        clients: new Map(),
        broadcast: () => {}
    };
}
