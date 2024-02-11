const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
module.exports = {
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
