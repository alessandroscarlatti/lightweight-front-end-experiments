module.exports = function (dpRequire, require, args) {
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
        console.log(`Server started at ${url} on ${new Date()}`);
        spawn("C:/Program Files (x86)/Google/Chrome/Application/chrome.exe", [`--app=${url}`], {
            detached: true  // we don't want chrome to crash if our app crashes!
        })
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
        try {
            if (action.type === "COMMAND") {
                maybePerformShellCommand(action, ws);
            }
        } catch (e) {
            console.error("Error handling action", action);
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

        if (path.isAbsolute(executablePath) && executablePath.startsWith(__dirname)) {
            fs.access(executablePath, fs.constants.R_OK, function (err) {
                if (err == null) {
                    performShellCommandInNewShell(executablePath, action.args, ws);
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

    function performShellCommandInNewShell(executablePath, args, ws) {
        console.log(`Executing ${executablePath} with args ${args}`);
        var proc;
        try {
            //fix args if args are empty
            if (args == null) {
                args = [];
            }
            proc = spawn("cmd", ["/c", executablePath, ...args], {
                shell: true,
                detached: true
            });
        } catch (e) {
            console.error("Error starting process for executable:", executablePath, e);
            ws.send(JSON.stringify({
                type: "COMMAND_FAILED",
                message: "Error starting process for executable:" + executablePath
            }));
            return;
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