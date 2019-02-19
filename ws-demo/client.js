const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080/stuff');

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function incoming(data) {
  console.log(data);
});

var stdin = process.openStdin();
stdin.addListener("data", function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    var input = d.toString().trim();
    console.log("you entered: [" + input + "]");
    ws.send(input);
  });