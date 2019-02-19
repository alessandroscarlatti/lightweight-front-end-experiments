// create dependencies
const dp = {};
dp["child_process"] = require('child_process')
dp["fs"] = require('fs');
dp["ws"] = require('ws');
dp["express"] = require('express');
dp["path"] = require('path');

// get the native require method if we are inside webpack bundle.
const nativeRequire = require("./native-require");

// create a fake require method
function dpRequire(moduleName) {
    return dp[moduleName];
}

// now load the main server and pass the dependencies
const serverMain = nativeRequire('./serverMain');
serverMain(dpRequire);