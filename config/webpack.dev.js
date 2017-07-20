var webpack = require('webpack'),
    Helper = require('./webpack.helper');

module.exports = {
    cache: true,
    devtool: 'source-map',
    performance: {
        hints: false
    },
    devServer: {
        contentBase: Helper.GetPath(['wwwroot']),
        port: 8080
    },
};