const loaderUtils = require('loader-utils');

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

const regexLikeIndexModule = /(?<!pages[\\/])index\.module\.(scss|sass|css)$/;

function cssFileResolve(url, _resourcePath, urlImports) {
    if (url.startsWith('/')) {
        return false;
    }
    if (!urlImports && /^[a-z][a-z0-9+.-]*:/i.test(url)) {
        return false;
    }
    return true;
}

function getCssModuleLocalIdent(context, _, exportName, options) {
    const relativePath = path.relative(context.rootContext, context.resourcePath).replace(/\\+/g, '/');

    // Generate a more meaningful name (parent folder) when the user names the
    // file `index.module.css`.
    const fileNameOrFolder = regexLikeIndexModule.test(relativePath) ? '[folder]' : '[name]';

    // Generate a hash to make the class name unique.
    const hash = loaderUtils.getHashDigest(
        Buffer.from(`filePath:${relativePath}#className:${exportName}`),
        'md5',
        'base64',
        5
    );

    // Have webpack interpolate the `[folder]` or `[name]` to its real value.
    return (
        loaderUtils
            .interpolateName(context, fileNameOrFolder + '_' + exportName + '__' + hash, options)
            .replace(
                // Webpack name interpolation returns `about.module_root__2oFM9` for
                // `.root {}` inside a file named `about.module.css`. Let's simplify
                // this.
                /\.module_/,
                '_'
            )
            // Replace invalid symbols with underscores instead of escaping
            // https://mathiasbynens.be/notes/css-escapes#identifiers-strings
            .replace(/[^a-zA-Z0-9-_]/g, '_')
            // "they cannot start with a digit, two hyphens, or a hyphen followed by a digit [sic]"
            // https://www.w3.org/TR/CSS21/syndata.html#characters
            .replace(/^(\d|--|-\d)/, '__$1')
    );
}

module.exports = {
    mode: 'production',
    // devtool: 'source-map',
    entry: './src/client.ts',
    output: {
        filename: 'client.js',
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
        },
        nodeExternals(),
    ],
    optimization: {
        minimize: false,
        minimizer: [
            new TerserPlugin({ extractComments: false }),
            // new OptimizeCSSAssetsPlugin({
            //     cssProcessorOptions: {
            //         map: {
            //             inline: false
            //         }
            //     }
            // })
        ],
    },
    module: {
        rules: [
            // {
            //     test: /\.(js|json)?$/,
            //     exclude: /(node_modules)/,
            //     use: [
            //         {
            //             loader: 'babel-loader',
            //         },
            //     ],
            // },
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
                            modules: true,
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
    plugins: [
        // new PrettierPlugin(),
        // new MiniCssExtractPlugin({
        //     filename: 'css/index.css',
        // }),
        new webpack.BannerPlugin(banner),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
};
