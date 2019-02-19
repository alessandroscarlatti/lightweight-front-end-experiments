// file: native-require.js
// webpack replaces calls to `require()` from within a bundle. This module
// is not parsed by webpack and exports the real `require`
// NOTE: since the module is unparsed, do not use es6 exports
if (typeof __non_webpack_require__ !== 'undefined' && __non_webpack_require__) {
    nativeRequire = __non_webpack_require__;
} else {
    module.exports = require;
}

