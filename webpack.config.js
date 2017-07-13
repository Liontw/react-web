'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    // devtool:'inline-eval-cheap-source-map',
    devtool: 'eval',

	entry: [
		'babel-polyfill',
		'webpack-hot-middleware/client', // for hot reload
		'./client/index.js' // entry point for the client app
	],

	//
	output: {
		path: path.join(__dirname, 'build'),
		filename: 'bundle.js',
		publicPath: '/static/'
	},

	//
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		// // 使用 CommonsChunkPlugin 將共用的模組整到 vendor.bundle.js 內
		// new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js", Infinity),

		// 進行js壓縮=>bundle.js
		// new webpack.optimize.UglifyJsPlugin({
		// 	minimize: true,
		// 	compressor: {
		// 		warnings: false
		// 	}
		// }),

		// 使用 OccurenceOrderPlugin 減少文件大小
		// new webpack.optimize.OccurrenceOrderPlugin(true),
		// new webpack.optimize.DedupePlugin(),

		// new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin("styles.css"),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			Promise: "bluebird"
		})
	],

	//
	resolve: {
		alias: {
		},
		// require() file without adding .jsx and .js .suffix
		extensions: ['', '.js', '.jsx']
	},

	// be sure to add 'stage-0' in .babelrc to support es7 syntax
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				// loader: 'babel',
				loader: 'babel-loader',
				exclude: /node_modules/,
				include: __dirname,
				query: {
					presets: [ 'react-hmre', "es2015", "stage-0", "react" ],
					plugins: [ "transform-decorators-legacy","transform-object-assign" ],
				}
			},
			{test: /\.json$/, loader: "json-loader"},
			{test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
			{test: /\.scss$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
			{test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=1'},
			{test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
			{test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff2"},
			{test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
			{test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
			{test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"}
		],
		noParse: ["react", "jquery", "bootstrap", "react-router", "redux"]
	}
};
