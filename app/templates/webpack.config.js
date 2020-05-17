const path = require('path');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  entry: {
    app: ['./node_modules/saslprep/index.js', './dist/index.js'],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'build.js',
  },
  plugins: [
    new webpack.IgnorePlugin(/^hiredis$/),
  ],
};
