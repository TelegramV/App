const webpack = require("webpack")
const path = require("path")

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin')

const config = {
    node: {
        fs: "empty"
    },
    entry: "./src/js/application.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.[hash].js"
    },
    module: {
        rules: [
            // wasm files should not be processed but just be emitted and we want
            // to have their public URL.
            {
                test: /\.wasm$/,
                type: "javascript/auto",
                loader: "file-loader",
                options: {
                    publicPath: "dist/"
                }
            },
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.worker\.js$/,
                use: [
                    "worker-loader",
                    "babel-loader"
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.s?css/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        outputPath: "images",
                        name: "[name].[ext]"
                    }
                }
            },
            {

                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        outputPath: "fonts"
                    }
                },
            },
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: "public"
        }]),
        // new FlowWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "bundle.[hash].css",
            chunkFilename: "./src/sass/application.scss",
            ignoreOrder: false,
        }),
        new HtmlWebpackPlugin({template: "./src/index.html"}),
        new CleanWebpackPlugin(),
        new FilterWarningsPlugin({
            exclude: /Critical dependency: the request of a dependency is an expression/,
        }),
    ],
    optimization: {
        // minimize: true,
        // minimizer: [new TerserPlugin()],
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8090
    }
}

module.exports = config
