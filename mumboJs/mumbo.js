/**
 * MumboJS.
 * 
 * May pass the script to load as the first argument to the script.
 * Example: node mumbo somescript
 */

const BANNER = String.raw`
 __  __            _            _ ___ 
|  \/  |_  _ _ __ | |__  ___ _ | / __|
| |\/| | || | '  \| '_ \/ _ \ || \__ \
|_|  |_|\_,_|_|_|_|_.__/\___/\__/|___/                                
`
console.log(BANNER);

//Create bundled dependencies map
const dp = {};
dp["ws"] = require('ws');
dp["express"] = require('express');

//Get the native require method so that we can perform
//native requires even if we are inside a webpack bundle.
const nativeRequire = require("./native-require");

//create a fake require method
function dpRequire(moduleName) {
    return dp[moduleName];
}

//Now find the main script.
var serverMain;
if (process.argv.length > 2) {
    serverMain = nativeRequire(`./${process.argv[2]}`);
} else {
    serverMain = nativeRequire('./main');
}

//Run the main script and pass the dependencies and the arguments.
serverMain(dpRequire, nativeRequire, process.argv);