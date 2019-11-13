const webpack = require("webpack")
const path = require("path")

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

const CopyWebpackPlugin = require('copy-webpack-plugin')

require("@babel/polyfill")

const COCOCO = {
    node: {
        fs: "empty"
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8090
    },
    // watch: true,
    entry: ["@babel/polyfill", './src/js/application.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[hash].js'
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "bundle.[hash].css",
            chunkFilename: "./src/sass/application.scss",
            ignoreOrder: false,
        }),
        new HtmlWebpackPlugin({template: "./src/index.html"}),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {from: "public"}
        ])
    ],
    module: {
        rules: [
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
    }
}


const config = {
    node: {
        fs: "empty"
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8090
    },
    watch: true,
    entry: ["@babel/polyfill", "./src/js/application.js"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader, // or MiniCssExtractPlugin.loader
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                ],
            },
            // {
            //     test: /\.css$/,
            //
            //     use: [
            //         "style-loader",
            //         MiniCssExtractPlugin.loader,
            //         {
            //             loader: "css-loader",
            //             options: {
            //                 importLoaders: 1,
            //                 modules: true
            //             }
            //         },
            //         "postcss-loader"
            //     ],
            //
            // },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: "file-loader"
            },
            {

                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    "file-loader",
                ],
            },
// {
//     test: /\.(png|jpg|jpeg)$/,
//     use: [
//         {
//             loader: "url-loader",
//             options: {
//                 mimetype: "image/png"
//             }
//         }
//     ]
// }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: "style.css",
            chunkFilename: "[name].css"
        }),
    ]
}

module.exports = COCOCO;