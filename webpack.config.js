var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { 
                test: /\.css$/, 
                loader: "style!css"
            },
            {
                test: /\.glsl$/,
                loader: 'webpack-glsl'
            },
            { 
                test: /\.json$/, 
                loader: "json-loader"
            }
        ]
    },
    devServer: {
        progress: true,
        colors: true,
        inline: true,
        contentBase: 'dist/',
        host: '0.0.0.0'
    },
    plugins: [
    //  new webpack.optimize.UglifyJsPlugin({minimize: true})
        new HtmlWebpackPlugin({
            inject: false,
            template: 'pages/index.ejs',
            minify: {
              removeAttributeQuotes: true,
              collapseWhitespace: true,
              minifyJS: true,
              minifyCSS: true
            }
        }),
        new CopyWebpackPlugin([
            { from: 'files' }
        ])
    ]
};
