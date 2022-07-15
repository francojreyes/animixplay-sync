const { WebSocketServer } = require("ws");

const PORT = process.env.PORT || 3000;

const server = new WebSocketServer({ clientTracking: true, port: PORT });
server.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
}
server.broadcast = function (msg, sender) {
    for (const client of server.clients) {
        if (client.id !== sender.id) {
            client.send(msg);
        }
    }
}

server.on('connection', (socket) => {
    socket.id = server.getUniqueID();
    console.log(socket.id, 'Client connected');
    socket.on('close', () => console.log(socket.id, 'Client disconnected'));

    socket.on('message', (msg) => {
        const data = JSON.parse(msg);
        console.log(socket.id, data);
        if (data.type == 'event') {
            server.broadcast(JSON.stringify(data), socket);
        }
    });
});