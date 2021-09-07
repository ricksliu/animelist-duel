const path = require('path');

module.exports = {
    mode: 'none',
    entry: {
        '_index': path.join(__dirname, 'react', '_index.tsx')
    },
    target: 'web',
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            }
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'resources/static/js')
    }
}