"use strict";

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: {
        vendor: ['angular', 'angular-animate', 'angular-route', 'moment', './vendor/ui-codemirror-0.3.0', 'angular-ui-validate', 'angular-toastr'],
        app: './app/app.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'head',
            title: 'Search Watcher',
            template: './app/viewport/index.html'}),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.js",
            minChunks: Infinity
        })
    ],

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            'app-root': path.resolve(__dirname, './app'),
            'static-content': path.resolve(__dirname, './content'),
            'widgets': path.resolve(__dirname, './app/widgets')
        }
    },

    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!postcss-loader'
            },
            {
                test: /\.(jpg|png)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[hash].[ext]',
                },
            },
            {
                test: /\.txt$/,
                loader: 'raw-loader'
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {   test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            }
        ]
    },

    output: {
        filename: 'deploy/bundle.js',
        path: path.resolve(__dirname, 'ape-e-eye')
    }
}