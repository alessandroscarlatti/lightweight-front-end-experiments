module.exports = {
  target: "node",
  entry: './mumbo.js',
  output: {
    filename: 'dist/mumbo.js',
    path: __dirname
  },
  node: {
    __dirname: false  // allows __dirname to be used in bundled code
  },
  module: {
    noParse: /native-require.js$/  // don't parse this module so that native require will still work!
  }
};