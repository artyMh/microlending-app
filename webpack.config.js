const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    resolve: {
        modules: ['node_modules', 'src'],
        extensions: ['.js', '.jsx']
    },
    output: {
        path: __dirname + '/dist',
        filename: 'index_bundle.js'
    },
    module: {
        rules: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            // { test: /\.woff$/, loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]" },
            // { test: /\.woff2$/, loader: "url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]" },
            // { test: /\.(eot|ttf|svg|gif|png)$/, loader: "file-loader" }
        ]
    },
    plugins: [HtmlWebpackPluginConfig]
};
