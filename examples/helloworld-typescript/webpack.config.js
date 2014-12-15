var webpack = require("webpack");
var path = require('path');

module.exports = {
  entry: './lib/initialize.js',

  output: {
    filename: 'public/bundle.js'
  },

  module: {
    loaders: [
      { test: /\.coffee$/, loader: "coffee" }
    ]
  },

  resolve: {
    root: [],
    extensions: ["", ".coffee", ".js"]
  }
}
