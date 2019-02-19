module.exports = {
  target: "node",
  entry: './serverBase.js',
  output: {
    filename: 'serverBaseBundle.js',
    path: __dirname
  },
  node: {
    __dirname: false  // allows __dirname to be used in bundled code
  },
  module: {
    noParse: /native-require.js$/
  },
  optimization: {
    minimize: false
  }
};