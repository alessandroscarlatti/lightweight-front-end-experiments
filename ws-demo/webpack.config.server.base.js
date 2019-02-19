module.exports = {
  target: "node",
  entry: './bootstrapOriginal.js',
  output: {
    filename: 'bootstrap.js',
    path: __dirname
  },
  node: {
    __dirname: false  // allows __dirname to be used in bundled code
  },
  module: {
    noParse: /native-require.js$/
  },
  // optimization: {
  //   minimize: false  // don't uglify
  // }
};