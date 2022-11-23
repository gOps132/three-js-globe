const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common,{
		mode: 'development',
		output: {
			path: path.resolve(__dirname, 'dist'), 
			filename: 'main.js',
			publicPath: '/',
		},
	}
)
