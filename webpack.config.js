const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = {
    entry: './index.js', // Replace with your entry point
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/, // Match .css files
                use: [
                    MiniCssExtractPlugin.loader, // Extracts CSS into separate files
                    'css-loader', // Translates CSS into CommonJS
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'src/styles/styles.css',
        }),
        new JavaScriptObfuscator({
            rotateStringArray: true,
        }),
    ],
};
