/* eslint-disable */
/**
 * @file webpack配置文件
 * @author yangxiaoxu@baidu.com
*/
const path = require('path');
const webpack = require('webpack'); // 访问内置的插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 项目相关配置(app-config)
const APP_NAME_EN = 'decision-platform';
const APP_NAME_CN = '决策平台';
const APP_ASSETS = 'assets/' + APP_NAME_EN;
const APP_TEMPLATE = 'template/' + APP_NAME_EN;

module.exports = {
    entry: {
        app: './src/App.jsx'
    },
    output: {
        // 目录
        path: path.resolve(__dirname, './output'),
        // 文件名
        filename: APP_ASSETS + '/js/[name]_[hash:8].bundle.js',
        chunkFilename: APP_ASSETS + '/js/[name]_[chunkhash:8].chunk.js',
        publicPath: '/'
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react', 'stage-0']
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.(less|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
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
                                '@icon-url': '"/assets/decision-platform/iconfont/iconfont"'
                            }
                        }
                    }
                ],
                exclude: [/\.useable\.less$/]
            },
            {
                test: /\.useable\.less$/,
                use: [
                    'style-loader/useable',
                    'css-loader',
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
                    'less-loader'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        name: APP_ASSETS + '/img/[name].[hash:8].[ext]'
                    }
                }]
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
                        drop_console: true
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
            name: 'vendor'
        },
        runtimeChunk: {
            name: 'manifest'
        }
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new CleanWebpackPlugin(['output']),

        new MiniCssExtractPlugin({
            filename: APP_ASSETS + '/css/[name].[hash:8].css',
            chunkFilename: APP_ASSETS + '/css/[id].[hash:8].css'
        }),

        new CSSSplitWebpackPlugin({
            size: 4000,
            filename: APP_ASSETS + '/css/[name]-[part].[ext]'
        }),

        new CopyWebpackPlugin([{
            from: __dirname + '/src/components/v3Jump',
            to: __dirname + '/output/' + APP_ASSETS + '/v3Jump'
        }]),

        new CopyWebpackPlugin([{
            from: __dirname + '/src/components/iconfont',
            to: __dirname + '/output/' + APP_ASSETS + '/iconfont'
        }]),

        // new BundleAnalyzerPlugin({
        //     analyzerPort: 8000
        // }),

        new webpack.ProvidePlugin({
            $: 'jquery'
        }),

        new HtmlWebpackPlugin({
            title: APP_NAME_CN,
            template: path.join(__dirname, './src/layout.tpl.html'),
            filename: APP_TEMPLATE + '/index.html',
            chunksSortMode: 'dependency',
            minify: {
                minifyJS: true,
                removeComments: true,
                minifyCSS: true
            }
        })
    ]
};