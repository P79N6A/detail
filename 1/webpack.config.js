/* eslint-disable */
/**
 * @file webpack配置文件
 * @author yangxiaoxu@baidu.com
*/
const path = require('path');
const webpack = require('webpack'); // 访问内置的插件
const HtmlWebpackPlugin = require('html-webpack-plugin');


// 项目相关配置(app-config)
const APP_NAME_CN = '决策平台';
const ROOT_PATH = path.resolve(__dirname);


module.exports = {
    entry: './src/App.jsx',
    output: {
        // 目录
        path: ROOT_PATH,
        // 文件名
        filename: '[name].bundle.js?[hash]',
        chunkFilename: '[name].chunk.js?[hash]',
        publicPath: '/'
    },
    devtool: 'eval-source-map',
    devServer: {
        port: 8008,
        host: '0.0.0.0',
        hot: true,
        inline: true,
        historyApiFallback: true,
        compress: true,
        contentBase: path.join(__dirname, 'dist'),
        proxy: {
            '/(api|mind)/**': {
                target: 'http://10.52.183.114:8000/decision-platform',
                // target: 'http://cp01-zhangjiayi03.epc.baidu.com:8098/',
                // target: 'http://10.99.206.89:8098',
                changeOrigin: true,
                secure: false
            }
        }
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
                    'style-loader',
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
                        limit: 8192
                    }
                }]
            }
        ]
    },

    optimization: {
        splitChunks: {
            // name: 'vendors',
            minChunks: 2 // 检测被引用两次即被抽离出来
        }
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: APP_NAME_CN,
            template: path.join(__dirname, './src/layout.tpl.html'),
            filename: 'index.html',
            minify: {
                minifyJS: true,
                removeComments: true,
                minifyCSS: true
            }
        }),
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};
