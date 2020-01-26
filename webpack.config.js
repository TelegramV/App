const webpack = require("webpack")
const path = require("path")

const FlowWebpackPlugin = require("flow-webpack-plugin")

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin")

require("@babel/polyfill")

const config = {
    node: {
        fs: "empty"
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8090
    },
    entry: ["@babel/polyfill", "./src/js/application.js"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.[hash].js"
    },

    plugins: [
        new CopyWebpackPlugin([{
            from: "public"
        }]),
        new FlowWebpackPlugin(),
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
    module: {
        rules: [
            {
                test: /\.worker\.js$/,
                use: {
                    loader: "worker-loader",
                    options: {
                        // inline: true
                    }
                }
            },
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/
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
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
}

module.exports = config
