var webpack = require('webpack');

module.exports = {
    //页面入口文件配置
    entry: {
        index: './src/index.js'
    },
    //入口文件输出配置
    output: {
        path: 'src/',
        filename: '[name].bundle.js'
    },
    module: {
        //加载器配置
        loaders: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.(png|jpg|gif|woff|woff2|eot|ttf)$/,
            loader: 'url-loader?limit=102040'
        }, {
            test: /\.html$/,
            loader: 'html',
        }],
        htmlLoader: {
            ignoreCustomFragments: [/\{\{.*?}}/]
        }
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        })
    ]
};