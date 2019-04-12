/**
 * @file webpack
 * @author xueliqiang@baidu.com
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

module.exports = {
    entry: [
        'babel-polyfill',
        './src/index'
    ],
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                loader: 'babel-loader?cacheDirectory'
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
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
                        loader: 'less-loader'
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
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
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [path.resolve(__dirname, 'node_modules')],
        alias: {
            'moment': 'moment/min/moment-with-locales.min.js',
            'react-dom': 'react-dom/umd/react-dom.development.js',
            'react': 'react/umd/react.development.js',
            'redux': 'redux/dist/redux.min.js',
            'react-router-dom': 'react-router-dom/umd/react-router-dom.min.js',
            'redux-saga': 'redux-saga/dist/redux-saga.min.js'
        }
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './dist',
        port: 8081,
        hot: true,
        historyApiFallback: true,
        host: '0.0.0.0',
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        proxy: {
            '/model/*': {
                // target: 'http://10.52.183.114:8000/infinite',
                // target: 'http://bjyz-fsg-opdb-abc-baixin-susetest04.bjyz:8618/',
                target: 'http://10.64.5.49:8691',
                changeOrigin: true,
                secure: false
            },
            '/predict/*': {
                // target: 'http://10.52.183.114:8000/infinite',
                // target: ' http://10.95.109.152:8093',
                // target: 'http://10.99.206.89:8091',
                target: 'http://10.64.5.49:8691',
                changeOrigin: true,
                secure: false
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};
