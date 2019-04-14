"use strict";

var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    "mode": "development",
    devtool: 'source-map',
    entry: {
        app: './ng-app/main.ts'
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: 'head',
            title: 'Search Watcher',
            template: './app/viewport/index.html'})
    ],

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        alias: {
            'app-root': path.resolve(__dirname, './app'),
            'static-content': path.resolve(__dirname, './content'),
            'widgets': path.resolve(__dirname, './app/widgets')
    },
        modules: [
            "node_modules"
        ]
    },

    module: {
        rules: [
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
                test: /\.tsx?/,
                exclude: [/node_modules/, /\.(spec|e2e)\.ts$/],
                include: path.resolve(__dirname, 'ng-app'),
                loader: ['ts-loader', 'angular2-template-loader']
            },
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/, /\.(spec|e2e)\.ts$/],
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