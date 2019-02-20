// create dependencies
const dp = {};
dp["ws"] = require('ws');
dp["express"] = require('express');

// get the native require method if we are inside webpack bundle.
const nativeRequire = require("./native-require");

// create a fake require method
function dpRequire(moduleName) {
    return dp[moduleName];
}

// now load the main server and pass the dependencies
const serverMain = nativeRequire('./main');
serverMain(dpRequire, nativeRequire, process.argv);