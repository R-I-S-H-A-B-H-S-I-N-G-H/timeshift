const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

const devConfig = {
	mode: "development",
	entry: {
		main: "./src/index.js",
		DateUtil: "./src/util/timeUtil/DateUtil.js",
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
			filename: "./index.html",
		}),
	],
};

const prodConfig = {
	...devConfig,
	mode: "production",
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: true,
			}),
		],
	},
};

module.exports = (env) => {
	const isProd = env?.production ? "production" : "development";
	switch (isProd) {
		case "production":
			return prodConfig;
		default:
			return devConfig;
	}
};
