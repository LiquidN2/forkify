/* eslint-disable import/no-commonjs,no-undef,import/no-nodejs-modules */
const path = require('path');

module.exports = {
  entry: {
    controller: path.resolve(__dirname, 'src/js/controller.js'),
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // clean: true, // wipe output folder every build
    publicPath: '/', //Load static assets
  },
};
