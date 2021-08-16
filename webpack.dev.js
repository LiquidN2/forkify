/* eslint-disable import/no-commonjs,no-undef,import/no-nodejs-modules */
const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',

  devtool: 'inline-source-map',

  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    watchContentBase: true,
    // port: 9000,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      inject: 'head',
      scriptLoading: 'defer',
    }),
  ],

  module: {
    rules: [
      // Load JS
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },

      // Load CSS, SASS, SCSS
      {
        test: /\.s?css$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',

          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },

          // Add PostCSS Autoprefixer
          'postcss-loader',

          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
});
