// Core imports.
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

// Constants.
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
};

// Plugin imports.
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Plugin definitions.

// Reduce letiable name size.
const occurrenceOrderPlugin = new webpack.optimize.OccurrenceOrderPlugin();

// Set environment as production to reduce React library size.
const definePlugin = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify('production'),
});

// Clear build/ directory before each build.
const cleanWebpackPlugin = new CleanWebpackPlugin([PATHS.build], {
  root: process.cwd(),
  verbose: true,
});

// let appConfig = require('./config/default.json');

// Webpack configuration.

let config = {};

// Common configuration.
const common = {
  entry: path.join(PATHS.app, 'index.jsx'),
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react', 'stage-1'],
        },
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader!postcss-loader'),
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css-loader!postcss-loader!sass-loader?precision=8'),
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    cleanWebpackPlugin,
    new ExtractTextPlugin({
      filename: 'style.[hash].css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      xhtml: true,
    }),
  ],
  // externals: {
  //   config: JSON.stringify(appConfig),
  // },
};

switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,
      {
        output: {
          path: PATHS.build,
          filename: 'bundle.[hash].js',
          publicPath: '/',
        },
        devtool: 'source-map',
        plugins: [
          definePlugin,
          occurrenceOrderPlugin,
        ],
      }
    );
    break;

  case 'start':
  default:
    config = merge(
      common,
      {
        devtool: 'eval-source-map',
        output: {
          path: PATHS.build,
          filename: 'bundle.[hash].js',
        },
        watchOptions: {
          aggregateTimeout: 300,
          poll: 1000,
        },
      }
    );
    break;
}

module.exports = config;
