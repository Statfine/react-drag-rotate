const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "./example/src/index.html"),
    filename: "./index.html"
});

module.exports = {
    entry: path.join(__dirname, "./example/src/app.js"),
    output: {
        path: path.join(__dirname, "example/dist"),
        filename: "bundle.js",
        library: 'react-drag-rotate',
        libraryTarget: 'umd',
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            use: "babel-loader",
            exclude: /node_modules/
        }]
    },
    plugins: [htmlWebpackPlugin],
    resolve: {
        extensions: [".js", ".jsx"]
    },
    devtool: 'source-map',
    devServer: {
        port: 3011
    }
};
