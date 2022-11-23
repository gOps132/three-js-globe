const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
	entry: path.resolve(__dirname, './src/index.js'),
	resolve: {
		extensions: ['.js', '.jsx', 'html'],
		alias: { 
			Assets: path.resolve(__dirname, './src/assets/'),
			Src: path.resolve(__dirname, './src/'),
			CSS: path.resolve(__dirname, './src/css/'),
		},
	},
	devtool: 'source-map',
	plugins:
	[
		new CopyWebpackPlugin([ { from: path.resolve(__dirname, './static') } ]),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, './src/index.html'),
			minify: true
		})
	],
	module:
	{
		rules:
		[
			// HTML
			{
				test: /\.(html)$/,
				use: ['html-loader']
			},

			// JS
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use:
				[
					'babel-loader'
				]
			},

			// CSS
			{
				test: /\.css$/,
				use:
				[
					'style-loader',
					'css-loader'
				]
			},

			// Images
			{
				test: /\.(svg|png|jpg|jpeg|gif|mp3)$/,
				use: {
					loader: "file-loader",
					options: {
						publicPath: 'assets',
						name: "[hash].[ext]",
						outputPath: "assets"
					},
				}
			},

			// Shaders
			{
				test: /\.(glsl|vs|fs|vert|frag)$/,
				exclude: /node_modules/,
				use: [
					'raw-loader',
					'glslify-loader'
				]
			}
		]
	}
}
