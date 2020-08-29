const webpack = require("webpack")
const path = require("path")

const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const FilterWarningsPlugin = require("webpack-filter-warnings-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const __IS_PRODUCTION__ = process.argv.mode === "production" || process.argv.includes("production")
const __IS_DEV__ = !__IS_PRODUCTION__

const config = {
    node: {
        fs: "empty",
    },
    entry: "./src/js/application.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: __IS_PRODUCTION__ ? "bundle.[hash].js" : "[name].js",
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
                test: /encoderWorker\.min\.js$/,
                use: [{ loader: 'file-loader' }]
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
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: __IS_DEV__,
                            reloadAll: true,
                        },
                    },
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 2,
                        },
                        // query: {
                        // modules: {
                        //     mode: "global",
                        //     localIdentName: __IS_PRODUCTION__ ? "[hash:base64]" : "[name]__[local]",
                        //     context: path.resolve(__dirname, "src/sass"),
                        // },
                        // localsConvention: "camelCase",
                        // },
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
            __IS_DEV__: __IS_DEV__,
        }),
        // new FlowWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: __IS_PRODUCTION__ ? "bundle.[hash].css" : "[name].css",
            chunkFilename: "./src/sass/application.scss",
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
        // __IS_DEV__ ? new webpack.HotModuleReplacementPlugin({}) : () => null, // ламає код
    ],
    optimization: {
        minimize: __IS_PRODUCTION__,
        minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        hot: true,
        inline: true,
        port: 8090,
    },
}

module.exports = config
