const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080, path: "/stuff" });

wss.on('connection', function connection(ws) {
  ws.onmessage = (function incoming(message) {
    console.log('received: %s', message.data);
  });

  ws.send('connected');
});