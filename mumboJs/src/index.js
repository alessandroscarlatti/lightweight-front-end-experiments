/**
 * MumboJS.
 * 
 */

//Create bundled dependencies map
const modules = {
    ws: require("ws"),
    express: require("express")
}

//Get the native require method so that we can perform
//native requires even if we are inside a webpack bundle.
// const nativeRequire = require("./native-require");

//create a fake require method
function requireBundledModule(moduleName) {
    return modules[moduleName];
}

module.exports = {
    require: requireBundledModule
}