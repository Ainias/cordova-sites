const path = require('path');
const webpack = require('webpack');
// const PrettierPlugin = require('prettier-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const getPackageJson = require('./scripts/getPackageJson');
const nodeExternals = require('webpack-node-externals');

const { version, name, license, repository, author } = getPackageJson(
    'version',
    'name',
    'license',
    'repository',
    'author'
);

const banner = `
  ${name} v${version}
  ${repository.url}
  Copyright (c) ${author.replace(/ *<[^)]*> */g, ' ')} and project contributors.
  This source code is licensed under the ${license} license found in the
  LICENSE file in the root directory of this source tree.
`;

module.exports = (env) => {
    return {
        mode: env.production ? 'production' : 'development',
        devtool: env.production ? 'source-map' : 'eval-source-map',
        entry: {
            client: './src/client.ts',
            shared: './src/shared.ts',
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
            library: { type: 'umd' },
            clean: true,
            globalObject: 'this',
            publicPath: '',
        },
        externals: [
            {
                react: 'commonjs react',
                'react-dom': 'commonjs react-dom',
                next: 'commonjs2 next',
                '@fortawesome/react-fontawesome': 'commonjs2 @fortawesome/react-fontawesome',
                '@fortawesome/fontawesome-svg-core': 'commonjs2 @fortawesome/fontawesome-svg-core',
                '@fortawesome/free-solid-svg-icons': 'commonjs2 @fortawesome/free-solid-svg-icons',
                '@ainias42/react-bootstrap-mobile': 'commonjs2 @ainias42/react-bootstrap-mobile',
            },
            nodeExternals(),
        ],
        optimization: {
            minimize: false,
            minimizer: [new TerserPlugin({ extractComments: false })],
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)?$/,
                    exclude: /(node_modules)/,
                    use: [{ loader: 'babel-loader' }, { loader: 'ts-loader' }],
                },
                {
                    //Compiliert SASS zu CSS und speichert es in Datei
                    test: /\.scss$/,
                    use: [
                        { loader: 'isomorphic-style-loader' },
                        {
                            loader: 'css-loader',
                            options: {
                                esModule: false,
                                modules: {
                                    localIdentName: '[local]__[hash:base64:5]',
                                },
                            },
                        },
                        { loader: 'sass-loader' },
                    ],
                },
                {
                    //Kopiert nur benutzte Bilder/Videos/Sound (benutzt durch JS (import), html oder css/sass)
                    test: /\.(png|svg)$/,
                    type: 'asset/inline',
                },
            ],
        },
        plugins: [new webpack.BannerPlugin(banner)],
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
        },
    };
};
