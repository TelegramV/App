const webpack = require("webpack")
const path = require("path")

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const FilterWarningsPlugin = require("webpack-filter-warnings-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BabelMinifyPlugin = require("babel-minify-webpack-plugin")

const __IS_PRODUCTION__ = process.argv.mode === "production" || process.argv.includes("production")

const config = {
    node: {
        fs: "empty",
    },
    entry: "./src/js/application.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.[hash].js",
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
                    publicPath: "dist/",
                },
            },
            {
                test: /\.js$/,
                use: [
                    "babel-loader",
                    // "eslint-loader",
                ],
                exclude: [/node_modules/, /vendor/],
            },
            {
                test: /\.worker\.js$/,
                use: [
                    "worker-loader",
                    "babel-loader",
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.s?css/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        query: {
                            modules: {
                                mode: "global",
                                localIdentName: __IS_PRODUCTION__ ? "[hash:base64]" : "[name]__[local]",
                                context: path.resolve(__dirname, "src/sass"),
                            },
                            localsConvention: "camelCase",
                        },
                    },
                    {
                        loader: "sass-loader",
                    },
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        outputPath: "images",
                        name: "[name].[ext]",
                    },
                },
            },
            {

                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        outputPath: "fonts",
                    },
                },
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: "public",
        }]),
        new webpack.DefinePlugin({
            __IS_PRODUCTION__: __IS_PRODUCTION__,
        }),
        // new FlowWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "bundle.[hash].css",
            chunkFilename: "./src/sass/application.scss",
            ignoreOrder: false,
        }),
        new HtmlWebpackPlugin({template: "./src/index.html"}),
        new CleanWebpackPlugin(),
        __IS_PRODUCTION__ ? new CompressionPlugin({
            filename: '[path].br[query]',
            algorithm: 'brotliCompress',
            compressionOptions: {level: 11},
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false,
        }) : () => null,
        __IS_PRODUCTION__ ? new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            threshold: 10240,
            minRatio: 0.8,
        }) : () => null,
        // __IS_PRODUCTION__ ? new BabelMinifyPlugin() : () => null, // ламає код
    ],
    optimization: {
        minimize: __IS_PRODUCTION__,
        minimizer: [new TerserPlugin()],
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        hot: false, // doesn't work
        port: 8090,
    },
    devtool: !__IS_PRODUCTION__ && "inline-source-map",
}

module.exports = config
