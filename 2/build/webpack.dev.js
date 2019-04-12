/**
 * @file webpack config
 * @author luoxiaolan@badu.com
 */
const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const publicPath = '';

module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    entry: {
        index: [path.join(__dirname, '../src/index')]
    },
    output: {
        publicPath: '/',
        filename: `${publicPath}js/[name]-[hash:5].js`,
        chunkFilename: `${publicPath}js/[name].[hash:5].js`
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
                use: [{
                        loader: 'style-loader' // creates style nodes from JS strings
                    },
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
                        limit: 8192
                    }
                }],
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        contentBase: './dist',
        port: 8848,
        hot: true,
        open: true,
        historyApiFallback: true,
        host: '127.0.0.1',
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        proxy: {
            // '/console/approvalAdapt/audit/*': {
            //     target: 'http://172.18.22.67:8001',
            //     changeOrigin: true,
            //     secure: false
            // },
            // '/console/approvalAdapt/task/cancel': {
            //     target: 'http://172.18.22.67:8001',
            //     changeOrigin: true,
            //     secure: false
            // },
            // '/console/approvalAdapt/flow/add': {
            //     target: 'http://172.18.22.67:8001',
            //     changeOrigin: true,
            //     secure: false
            // },
            '/console/*': {
                target: 'http://10.52.183.114:8000/fdi-console-fe/api',
                changeOrigin: true,
                secure: false
            },
            '/console/web/login': {
                // target: 'http://10.52.183.114:8000/fdi',
                target: 'http://cp01-zhangjiayi03.epc.baidu.com:8091',
                changeOrigin: true,
                secure: false
            },
            // '/console/web/*': {
            //     // target: 'http://172.18.22.98:8081',
            //     target: 'http://cp01-zhangjiayi03.epc.baidu.com:8091',
            //     changeOrigin: true,
            //     secure: false
            // },
            '/console/auth/*': {
                target: 'http://cp01-zhangjiayi03.epc.baidu.com:8091',
                changeOrigin: true,
                secure: false
            },
            '/tongji/*': {
                target: 'http://cp01-zhangjiayi03.epc.baidu.com:8091',
                changeOrigin: true,
                secure: false
            },
            '/zero/*': {
                target: 'http://cp01-zhangjiayi03.epc.baidu.com:8091',
                changeOrigin: true,
                secure: false
            },
            '/console/approvalAdapt/*': {
                // target: 'http://10.52.183.114:8000/fdi',
                target: 'http://cp01-huzhongjian.epc.baidu.com:8011',
                changeOrigin: true,
                secure: false
            }
            // '/console/*': {
            //     target: 'http://10.52.183.114:8000/fdi',
            //     // target: 'http://bjyz-fsg-opdb-abc-baixin-susetest04.bjyz:8001',
            //     changeOrigin: true,
            //     secure: false
            // }
        }
    },
    plugins: [
        new HtmlwebpackPlugin({
            template: path.join(__dirname, '../public/index.html')
        }),
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};
