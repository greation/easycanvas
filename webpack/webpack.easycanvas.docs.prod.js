'use strict';

var CopyWebpackPlugin = require('copy-webpack-plugin');
var path = require('path');
var glob = require('glob');
var docConfig = require('./webpack.config.doc.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var StringReplacePlugin = require("string-replace-webpack-plugin");

var js = glob.sync('./doc-src/main.js').reduce(function (prev, curr) {
    prev[curr.slice(2, -3).replace('doc-src/', '')] = [curr];
    return prev;
}, {});

var html = glob.sync('./doc-src/index.html').map(function (item) {
    return new HtmlWebpackPlugin({
        filename: item.substr(0).replace('doc-src/', ''),
        template: item,
        inject: false
    });
});

var config = docConfig;

config.entry = js;
config.mode = 'production';
config.plugins = config.plugins.concat(html);

Object.assign(config, {
    output: {
        path: path.resolve('./docs'),
        filename: '[name].js',
        chunkFilename: '[name].bundle.js'
    },
    module: {
        rules: docConfig.module.rules.concat([{
            test: /\.js$/,
            use: [
                {
                    loader: StringReplacePlugin.replace({
                        replacements: [
                            {
                                pattern: /\.\.\/resource\//ig,
                                replacement: function (match, p1, offset, string) {
                                    // return 'https://raw.githubusercontent.com/c-zhuo/easycanvas/master/demos/resource/';
                                    return 'https://raw.githubusercontent.com/c-zhuo/easycanvas/develop/0.8.4/demos/resource/';
                                }
                            }
                        ]
                    }),
                }
            ]
        }])
    },
    plugins: ([
        new CopyWebpackPlugin([
            {
                from: './doc-src/lib/',
                to: './lib/'
            }
        ]),
    ]).concat(html),
});

config.node = {
    fs: 'empty' // https://github.com/webpack-contrib/css-loader/issues/447
};

module.exports = config;
