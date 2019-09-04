const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
  target: 'node',
  entry: {
    app: ['./node_modules/saslprep/index.js', './dist/index.js'],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'build.js',
  },
  resolve: {
    alias: {
      hiredis: path.join(__dirname, 'aliases/hiredis.js'),
    },
  },
  plugins: [
    new CopyPlugin([
      { from: 'node_modules/saslprep/code-points.mem', to: '' },
      { from: '<FILE_NAME>', to: '' },
    ]),
  ],
};
