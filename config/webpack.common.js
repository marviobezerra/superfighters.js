var webpack = require('webpack'),
    Helper = require('./webpack.helper'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        'main': Helper.GetPath(['src', 'main.ts'])
    },
    output: {
        path: Helper.GetPath(['wwwroot']),
        filename: 'dist/[name].js',
        chunkFilename: 'dist/[name].[id].chunk.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html']
    },
    module: {
        rules: [{
                test: /\.ts$/,
                use: [
                    'awesome-typescript-loader',
                    'source-map-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|mp3|json)$/,
                use: ['file-loader?name=[path]/[name].[ext]']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            inject: 'body',
            template: 'src/index.html'
        }),
        new CopyWebpackPlugin([
            { from: Helper.GetPath(['lib']), to: "lib" }
        ])
    ]
};