var minimize = process.argv.indexOf('--minimize') !== -1;
var minifyHTML;

var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

if (minimize) {
    minifyHTML = {
      removeAttributeQuotes: true,
      collapseWhitespace: true,
      minifyJS: true,
      minifyCSS: true
    }
} else {
    minifyHTML = false;
}

var plugins = [
    new CopyWebpackPlugin([
        { from: 'files' }
    ]),
    new HtmlWebpackPlugin({
        inject: false,
        template: 'pages/index.ejs',
        minify: minifyHTML
    })
]

if (minimize) {
    plugins.push(new webpack.optimize.UglifyJsPlugin());
}

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
    plugins: plugins
};
