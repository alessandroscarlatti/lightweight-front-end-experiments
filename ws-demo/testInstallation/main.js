const BANNER = String.raw`
 __  __            _            _ ___ 
 |  \/  |_  _ _ __ | |__  ___ _ | / __|
 | |\/| | || | '  \| '_ \/ _ \ || \__ \
 |_|  |_|\_,_|_|_|_|_.__/\___/\__/|___/                                
 `

const FAVICON = "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";

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
    app.use(`/${SERVER_KEY}`, express.static(__dirname))

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

    /**
     * 
     * @param {*} action the action to consider
     * @param {*} ws the websocket connection that received the action
     * and will be used to emit responses.
     */
    function maybePerformShellCommand(action, ws) {

        var executablePath = path.normalize(
            path.join(__dirname, action.executable)
        );

        if (path.isAbsolute(executablePath) && path.dirname(executablePath) === __dirname) {
            fs.access(executablePath, fs.constants.R_OK, function (err) {
                if (err == null) {
                    performShellCommandInNewShell(action, ws);
                } else {
                    console.error("Unable to access executable: " + executablePath);
                    ws.send(JSON.stringify({
                        type: "COMMAND_FAILED",
                        message: "Unable to access executable: " + executablePath
                    }))
                }
            });
        } else {
            console.error("Bad executable path: " + executablePath);
            ws.send(JSON.stringify({
                type: "COMMAND_FAILED",
                message: "Unable to access executable." + executablePath
            }))
        }
    }

    function performShellCommandInNewShell(action, ws) {
        var proc;
        try {
            proc = spawn("cmd", ["/c", action.executable, ...action.args], {
                shell: true,
                detached: true
            });
        } catch (e) {
            console.error("Error starting process for action:", action, e);
        }

        console.log(`Started Process PID ${proc.pid} at ${new Date()}`)
        ws.send(JSON.stringify({
            type: "COMMAND_STARTED",
        }));

        proc.on("close", function () {
            console.log(`Completed Process PID ${proc.pid} at ${new Date()}`);
            ws.send(JSON.stringify({
                type: "COMMAND_COMPLETED"
            }));
        })

        proc.stdout.on("data", function (data) {
            ws.send(JSON.stringify({
                type: "COMMAND_STDOUT",
                data: data.toString()
            }))
        });

        proc.stderr.on("data", function (data) {
            ws.send(JSON.stringify({
                type: "COMMAND_STDERR",
                data: data.toString()
            }))
        });
    }

    //init Websocket ws and handle incoming connect requests
    const wss = new SocketServer({ server, path: "/ws" });
    var clients = [];
    wss.on('connection', function connection(ws, req) {
        console.log("Connected to client at " + req.connection.remoteAddress);
        clients.push(1);

        ws.on('message', function incoming(message) {
            console.log("received message...", message);
            performAction(JSON.parse(message), ws);
        });

        // we only want this
        ws.on('close', function (code, reason) {
            console.log(`Connection closed with ${req.connection.remoteAddress}. Code: ${code}`);
            clients.pop();
            if (clients.length === 0) {
                console.log("No Clients connected. Shutting down now.");
                process.exit(0);
            }
        });

        //on connect message
        ws.send('Connected to server at ' + new Date());
    });
}