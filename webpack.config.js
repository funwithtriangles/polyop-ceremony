var webpack = require("webpack");

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
    ]
};
