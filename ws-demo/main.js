/**
 * Eventually, parameters for:
 * port:
 * whitelisted executable locations:
 * static content locations:
 */

module.exports = function(require, nativeRequire) {

    console.log("running server main!");

    const stuff = nativeRequire("./stuff");
    
    console.log(stuff);

    const spawn = require('child_process').spawn;
    const fs = require('fs');
    const SocketServer = require('ws').Server;
    var express = require('express');
    var path = require('path');
    
    var connectedUsers = [];
    //init Express
    var app = express();
    //init Express Router
    var router = express.Router();
    var port = process.env.PORT || 8080;
    
    //connect path to router
    app.use("/", router);
    app.use(express.static('static'))
    
    
    //return static page with websocket client
    app.get('/', function (req, res) {
        console.log("dirname: " + __dirname);
        res.sendFile(path.join(__dirname + '/test.html'));
    });
    
    app.get('/doStuff', function (req, resp) {
        const args = ["|", "echo"];
        const proc = spawn('ls', args);
    
        proc.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        proc.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
    
        proc.stdout.pipe(resp);
        proc.stderr.pipe(resp);
    });
    
    var server = app.listen(port, function () {
        console.log('node.js static server listening on port: ' + port + ", with websockets listener")
        spawn("C:/Program Files (x86)/Google/Chrome/Application/chrome.exe", ["--app=http://pc-PC:8080"])    
    })
    
    /**
     * 
     * @param {*} action object representing the command.
     * For example:
     * 
     * {
     *  type: "COMMAND",
     *  executable: "test.bat",
     *  args: []
     * }
     */
    function performAction(action, ws) {
        if (action.type === "COMMAND") {
            fs.access(action.executable, fs.constants.R_OK, function (err) {
                if (err == null) {
                    const proc = spawn(action.executable, action.args);
    
                    proc.stdout.on("data", function (data) {
                        ws.send(JSON.stringify({
                            type: "STDOUT",
                            data: data.toString()
                        }))
                    });
    
                    proc.stderr.on("data", function (data) {
                        ws.send(JSON.stringify({
                            type: "STDERR",
                            data: data.toString()
                        }))
                    });
                } else {
                    console.error("Tried to access executable: " + action.executable);
                }
            });
        }
    }
    
    const wss = new SocketServer({ server, path: "/ws" });
    //init Websocket ws and handle incoming connect requests
    wss.on('connection', function connection(ws) {
        console.log("connection ...");
    
        ws.on('message', function incoming(message) {
            console.log("received message...", message);
            performAction(JSON.parse(message), ws);
        });
    
        ws.on('close', function(code, reason) {
            console.log("Connection closed. Code: " + code + " reason: " + reason);
            console.log("Shutting down.");
            process.exit(0);
        });
    
        //on connect message
        ws.send('connected to server at ' + new Date());
    });
}