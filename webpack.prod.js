const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(common,{
		mode: 'production',
		output:
		{
			filename: 'bundle.[hash].js',
			path: path.resolve(__dirname, './dist')
		},
		mode: 'production',
		plugins:
		[
			new CleanWebpackPlugin()
		]
	}
)
