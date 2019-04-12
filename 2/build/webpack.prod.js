/**
 * @file webpack 配置
 * @author luoxiaolan@badu.com
 */
const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const publicPath = 'assets/fdi-console-fe/';

module.exports = {
    mode: 'production',
    devtool: false,
    entry: {
        index: [path.join(__dirname, '../src/index')]
    },
    output: {
        publicPath: '/',
        filename: `${publicPath}js/[name]-[contenthash:5].js`,
        chunkFilename: `${publicPath}js/[name].[contenthash:5].js`
    },
    module: {
        rules:[
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer')({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9' // React doesn't support IE8 anyway
                                    ]
                                })
                            ]

                        }
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            javascriptEnabled: true
                        }
                    }
                ],
                exclude: /\.useable\.less$/
            },
            {
              test: /\.css$/,
              exclude: /\.useable\.css$/,
              loader: "style-loader!css-loader"
            },
            {
              test: /\.useable\.css$/,
              exclude: /node_modules/,
              loader: "style-loader/useable!css-loader"
            },
            {
                test: /\.(png|jpg|ttf|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: publicPath + 'img/[name].[hash:8].[ext]'
                    }
                }],
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
                uglifyOptions: {
                    compress: {
                        warnings: false
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessor: require('cssnano')({
                    reduceIdents: false,
                    autoprefixer: {
                        remove: false
                    }
                })
            })
        ],
        splitChunks: {
            chunks: 'all',
            name: 'vendors'
        },
        runtimeChunk: {
            name: 'runtime'
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new MiniCssExtractPlugin({
            filename: publicPath + 'css/[name].[contenthash:8].css',
            chunkFilename: publicPath + 'css/[id].[contenthash:8].css'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new CSSSplitWebpackPlugin({
            size: 4000,
            filename: publicPath + 'css/[name]-[part].[ext]'
        }),
        new HtmlwebpackPlugin({
            title: 'fdi-console-fe',
            template: path.join(__dirname, '../public/index.html'),
            filename: './template/fdi-console-fe/index.html'
        }),
        // new BundleAnalyzerPlugin()
    ]
};
