// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
	entry: './src/index.tsx',
	devtool: isProduction ? 'source-map' : 'inline-source-map',
	output: {
		clean: true,
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
	devServer: {
		open: true,
		// host: 'localhost',
		hot: true,
    historyApiFallback: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'index.html',
		}),

		// Add your plugins here
		// Learn more about plugins from https://webpack.js.org/configuration/plugins/
	],
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/i,
				loader: 'ts-loader',
				exclude: ['/node_modules/'],
			},
			{
        test: /\.(sa|sc|c)ss$/, // styles files
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
        use: {
          loader: "url-loader",
        },
      },
			{
        test: /\.node$/,
        loader: "node-loader",
      },
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
	},
};

module.exports = () => {
	if (isProduction) {
		config.mode = 'production';


	} else {
		config.mode = 'development';
	}
	return config;
};
