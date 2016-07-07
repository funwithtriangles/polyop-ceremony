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
            }
        ]
    },
    devServer: {
        progress: true,
        colors: true,
        inline: true,
        contentBase: 'dist/'
    }
};