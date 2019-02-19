module.exports = {
  target: "node",
  entry: './expressServer.js',
  output: {
    filename: 'serverBundle.js',
    path: __dirname
  },
  node: {
    __dirname: false
  }
};