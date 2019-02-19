/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Eventually, parameters for:
 * port:
 * whitelisted executable locations:
 * static content locations:
 */

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

/***/ })
/******/ ]);