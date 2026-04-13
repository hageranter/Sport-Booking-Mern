const jwt = require('jsonwebtoken');
const config = require('./config');
const { registerConnection, unregisterConnection } = require('../utils/notificationSocket');

module.exports = (wss) => {
    // wss: instance of WebSocket.Server

    wss.on('connection', (ws, req) => {
        // parse token from query string ?token=...
        const params = new URLSearchParams(req.url.replace('/?', ''));
        const token = params.get('token');
        if (!token) {
            ws.close();
            return;
        }

        try {
            const decoded = jwt.verify(token, config.JWT_SECRET);
            ws.userId = decoded.userId;
            registerConnection(ws.userId.toString(), ws);
        } catch (err) {
            ws.close();
            return;
        }

        ws.on('close', () => {
            unregisterConnection(ws);
        });

        ws.on('message', (message) => {
            // currently ignoring incoming messages; could handle ping/pong or other commands
            // For future features (chat, etc) handle here.
        });
    });
};