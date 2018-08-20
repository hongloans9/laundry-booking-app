const path = require('path')
const fs = require('fs')
const appDirectory = fs.realpathSync(process.cwd())
const resolvePath = (relativePath) => path.resolve(appDirectory, relativePath)
const SCSS_DATA = `
    @import "_color.scss";
    @import "_variable.scss";
`;

const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const devServer = {
    port: 3000,
    disableHostCheck: true,
    historyApiFallback: true,
    open: true,
    overlay: true,
    stats:  'minimal',
    inline: true,
    compress: true,
    contentBase: '/'
}

module.exports = {
    entry: {
        main: [
            resolvePath('./src/index')
        ]
    },
    output: {
        // filename: './public/bundle.js',
        filename: '[name]__[hash].chunk.js',
        path: resolvePath('./dist'),
        publicPath : '/',
        chunkFilename: '[name]__[hash].chunk.js',
        devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath)
    },
    module: {
        rules: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                include: resolvePath('./src'),
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader" // creates style nodes from JS strings
                    },
                    {
                        loader: "css-loader", // translates CSS into CommonJS
                        options: {
                            modules: true,
                            camelCase: true,
                            localIdentName: process.env.NODE_ENV === 'development' ?
                                '[name]__[local]___[hash:base64:5]'
                                : '[name]__[hash:base64:8]'
                        }
                    },
                    {                        
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('autoprefixer')(),
                                require('cssnano')(),
                            ],
                            sourceMap: Boolean(process.env.NODE_ENV === 'development'),
                        },
                    },
                    {
                        loader: "sass-loader", // compiles Sass to CSS
                        options: {
                            includePaths: [resolvePath('./src/commons/scss')],
                            sourceMap: Boolean(process.env.NODE_ENV === 'development'),
                            data: SCSS_DATA
                        }
                    }
                ]
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.eot$|\.ttf$|\.wav$|\.mp3$|\.ico$/,
                loader: 'file-loader'
            },
            // load css
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader'
                ]
            },
        ]
    },
    plugins: [
        // build and append html
        new HtmlWebpackPlugin(
            {
                title: 'Laundry Booking',
                chunksSortMode: 'dependency',
                template: './views/index.html',
                inject: true
            }
        ),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({ // import jquery
            '$': 'jquery',
            'jQuery': 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery'
        })
    ],
    resolve: {
        extensions: ['.js', '.scss', '.css'],
        modules: ['src', 'packages', 'node_modules'],
        alias: {
            'jquery': path.join( __dirname, 'node_modules/jquery/dist/jquery')
        }
    },
    devServer
}
