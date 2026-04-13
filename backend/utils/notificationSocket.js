// Utility to manage WebSocket connections and deliver notifications in real time

const connections = new Map(); // userId -> Set of ws connections

function registerConnection(userId, ws) {
    if (!userId) return;
    const existing = connections.get(userId) || new Set();
    existing.add(ws);
    connections.set(userId, existing);
}

function unregisterConnection(ws) {
    if (!ws || !ws.userId) return;
    const userId = ws.userId;
    const set = connections.get(userId);
    if (set) {
        set.delete(ws);
        if (set.size === 0) {
            connections.delete(userId);
        }
    }
}

function sendNotification(userId, notification) {
    if (!userId) return;
    const set = connections.get(userId.toString());
    if (!set) return;

    const payload = {
        type: 'notification',
        data: notification
    };
    const json = JSON.stringify(payload);
    set.forEach(ws => {
        try {
            ws.send(json);
        } catch (e) {
            // ignore send errors; connection closing will clean up
        }
    });
}

module.exports = {
    registerConnection,
    unregisterConnection,
    sendNotification
};