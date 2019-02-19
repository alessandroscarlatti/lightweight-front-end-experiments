function isExternal(module) {
  var context = module.context;

  if (typeof context !== 'string') {
    return false;
  }

  return context.indexOf('node_modules') !== -1;
}

module.exports = {
  target: "node",
  entry: './expressServer.js',
  output: {
    filename: 'serverBundle2.js',
    path: __dirname
  },
  node: {
    __dirname: false
  },
  module: {
    noParse: /expressServer.js/
  },
  optimization: {
    minimize: false,
    splitChunks: {
      chunks: "initial"
    }
  }
};