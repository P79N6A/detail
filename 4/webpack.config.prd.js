/**
 * @file webpack
 * @author xueliqiang@baidu.com
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;

module.exports = {
    entry: [
        'babel-polyfill',
        './src/index'
    ],
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
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
                            modifyVars: {
                                '@mainColor': '#2A2F44'
                            }
                        }
                    }
                ],
                exclude: /\.useable\.less$/
            },
            {
                test: /\.useable\.less$/,
                use: [
                    {
                        loader: 'style-loader/useable'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: loader => [
                                require('autoprefixer')()
                            ]
                        }
                    },
                    {
                        loader: 'less-loader'
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'assets/infinite/img/[name].[hash:8].[ext]'
                    }
                }]
            }
        ],
        noParse: [
            /moment-with-locales/,
            /react.production.min/,
            /react-router-dom.production.min/,
            /redux.min.js/,
            /react-router.min.js/,
            /redux-saga.min.js/
        ]
    },
    output: {
        publicPath: '/',
        filename: 'assets/infinite/js/[name].[chunkhash:8].js',
        chunkFilename: 'assets/infinite/js/[name].[chunkhash:8].js'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [path.resolve(__dirname, 'node_modules')],
        alias: {
            'moment': 'moment/min/moment-with-locales.min.js',
            'react-dom': 'react-dom/umd/react-dom.production.min.js',
            'react': 'react/umd/react.production.min.js',
            'redux': 'redux/dist/redux.min.js',
            'react-router-dom': 'react-router-dom/umd/react-router-dom.min.js',
            'redux-saga': 'redux-saga/dist/redux-saga.min.js'
        }
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
                uglifyOptions: {
                    compress: {
                        /* eslint-disable */
                        drop_console: true
                        /* eslint-enable */
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessor: require('cssnano')({
                    reduceIdents: false,
                    zindex: false,
                    autoprefixer: {
                        remove: false
                    }
                })
            })
        ],
        splitChunks: {
            chunks: 'all',
            name: 'vendor'
        },
        runtimeChunk: {
            name: 'runtime'
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new MiniCssExtractPlugin({
            filename: 'assets/infinite/css/[name].[contenthash:8].css',
            chunkFilename: 'assets/infinite/css/[id].[contenthash:8].css'
        }),
        new CSSSplitWebpackPlugin({
            size: 4000,
            filename: 'assets/infinite/css/[name]-[part].[ext]'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: './template/infinite/index.html'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new webpack.HashedModuleIdsPlugin()
        // new BundleAnalyzerPlugin()
    ]
};
