const webpack = require('webpack');
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const sourceDir = "./src/";
const tmpFile = "./dist/script.js";
const config = {
    entry: "./src/js/App.js",
    // entry: tmpFile,
    devtool: 'source-map',
    mode: "production",
    // mode:"development",
    optimization: {
        // We no not want to minimize our code.
        minimize: false,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                }
            }),
        ],
    },
    output: {
        path: path.resolve(process.cwd(), 'dist'),
        filename: 'cordova-sites.js',
        library: "Sites",
        libraryTarget: "umd"
    },
    module: {

        //Regeln: Wenn Regex zutrifft => führe Loader (in UMGEKEHRTER) Reihenfolge aus
        rules: [
            {
                //Kopiert HTML-Dateien in www. Nur die Dateien, welche im JS angefragt werden
                test: /html[\\\/].*\.html$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'html'
                        }
                    },
                    {
                        loader: 'extract-loader'
                    },
                    {
                        loader: 'html-loader',
                        options: {
                            //Sorgt dafür, dass Child-Views funktionieren
                            attrs: [
                                ":data-view",
                                ":src"
                            ]
                        }
                    }
                ],
            },
            {
                //Kopiert nur benutzte Bilder (benutzt durch JS (import), html oder css/sass)
                test: /img[\\\/]/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'img',
                            publicPath: 'img'
                            // useRelativePath: true
                        }
                    },
                ],
            },
            {
                //Compiliert SASS zu CSS und speichert es in Datei
                test: /\.scss$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].css',
                            outputPath: 'css'
                        }
                    },
                    {
                        loader: 'extract-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        //Compiliert zu CSS
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        //Delete www before every Build (to only have nessesary files)
        new CleanWebpackPlugin(["dist/*"]),

    ],
};

function findNames(dir, excluded) {
    let names = {};
    if (excluded.includes(dir)) {
        return names;
    }

    let files = fs.readdirSync(dir);
    files.forEach(file => {
        let stats = fs.statSync(dir + file);
        if (stats.isDirectory()) {
            let nameObject = findNames(dir + file + '/', excluded);
            names = Object.assign(names, nameObject);
        } else if (file.endsWith(".js") && !excluded.includes(dir + file)) {
            names[file.substring(0, file.length - 3)] = dir + file.substring(0, file.length - 3);
        }
    });
    return names;
}

async function buildEntryPoints() {
    const cutLengthFront = 0;
    const resultDir = path.resolve(process.cwd(), path.dirname(tmpFile));

    const names = findNames(sourceDir, []);

    let imports = '';
    for (let k in names) {
        imports += "export * from '" + path.resolve(process.cwd(), names[k].substring(cutLengthFront)) + "';\n";
    }

    console.log(imports);
    if (!fs.existsSync(resultDir)){
        fs.mkdirSync(resultDir);
    }
    fs.writeFileSync(tmpFile, imports);
}

async function build() {
    await buildEntryPoints();
    await new Promise((resolve, reject) => webpack(config, (err, stats) => {
        if (err) {
            console.error(error);
            reject(err);
            return;
        }
        if (stats.hasErrors()) {
            reject(stats.toString());
            return;
        }
        resolve();
    }));
    fs.unlinkSync(tmpFile);

}
// buildEntryPoints();

// console.log(process.cwd());

build();