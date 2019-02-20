/**
 * Eventually, parameters for:
 * port:
 * whitelisted executable locations:
 * static content locations:
 */

 const BANNER = String.raw`
 __  __            _            _ ___ 
 |  \/  |_  _ _ __ | |__  ___ _ | / __|
 | |\/| | || | '  \| '_ \/ _ \ || \__ \
 |_|  |_|\_,_|_|_|_|_.__/\___/\__/|___/                                
 `

module.exports = function (dpRequire, require, args) {
    console.log(BANNER);
    console.log("Starting server with args:", args);

    const path = require('path');
    const fs = require('fs');
    const spawn = require('child_process').spawn;
    const SocketServer = dpRequire('ws').Server;
    const express = dpRequire('express');
    const os = require("os");

    // https://gist.github.com/6174/6062387
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    const SERVER_KEY = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    //init Express
    var app = express();
    //init Express Router
    var router = express.Router();

    //connect path to router
    app.use("/" + SERVER_KEY, router);
    app.use(express.static('static'))

    //return static page with a GET request to /{SERVER_KEY}
    app.get("/" + SERVER_KEY, function (req, res) {
        var indexHtmlPath = path.join(__dirname, 'index.html');
        console.log(`Serving ${indexHtmlPath} to ${req.connection.remoteAddress}`)
        res.sendFile(indexHtmlPath);
    });

    // start on a random open port
    var server = app.listen(0);
    server.on("listening", function () {
        const hostname = os.hostname();
        const port = server.address().port;
        const url = `http://${hostname}:${port}/${SERVER_KEY}`;
        console.log(`Server started at ${url}`);
        spawn("C:/Program Files (x86)/Google/Chrome/Application/chrome.exe", [`--app=${url}`])
    })

    /**
     * 
     * @param {*} action object representing the command.
     * For example:
     * 
     * {
     *  type: "COMMAND",
     *  executable: "test.bat",
     *  args: [],
     * }
     */
    function performAction(action, ws) {
        if (action.type === "COMMAND") {
            maybePerformShellCommand(action, ws);
        }
    }

    function maybePerformShellCommand(action, ws) {

        var executablePath = path.join(__dirname, action.executable);
        
        if (path.isAbsolute(executablePath) && path.dirname(executablePath) === __dirname) {
            fs.access(executablePath, fs.constants.R_OK, function (err) {
                if (err == null) {
                    performShellCommandInNewShell(action, ws);
                } else {
                    console.error("Unable to access executable: " + executablePath);
                }
            });
        } else {
            console.error("Bad executable path: " + executablePath);
        }
    }

    function performShellCommandInNewShell(action, ws) {
        var proc;
        try {
            proc = spawn("cmd", ["/c", action.executable, ...action.args], {
                shell: true,
                detached: true
            });
            console.log(`Started process with PID ${proc.pid}`)
        } catch (e) {
            console.error("Error starting process for action:", action, e);
        }

        proc.on("close", function() {
            console.log("process closing.");
        })

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
    }

    //init Websocket ws and handle incoming connect requests
    const wss = new SocketServer({ server, path: "/ws" });
    wss.on('connection', function connection(ws, req) {
        console.log("Connected to client at " + req.connection.remoteAddress);

        ws.on('message', function incoming(message) {
            console.log("received message...", message);
            performAction(JSON.parse(message), ws);
        });

        ws.on('close', function (code, reason) {
            console.log("Connection closed. Code: " + code);
            console.log("Shutting down now.");
            process.exit(0);
        });

        //on connect message
        ws.send('Connected to server at ' + new Date());
    });
}