/* eslint-disable */

const path = require('path');
const package = require('./package.json');

module.exports = {
  entry: './src/app.ts',
  module: {
    rules: [{ test: /\.tsx?$/, use: 'ts-loader' }],
  },
  output: {
    filename: package.name + '.js',
    path: path.resolve(__dirname, 'bundle'),
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  target: 'node',
};
