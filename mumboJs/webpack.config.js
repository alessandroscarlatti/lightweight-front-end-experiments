module.exports = {
  target: "node",
  entry: './src',
  output: {
    filename: 'dist/mumbo.js',
    library: 'mumbo',
    libraryTarget: 'umd',
    path: __dirname
  },
  node: {
    __dirname: false  // allows __dirname to be used in bundled code
  }
};