const rollup = require("rollup");
const path = require("path");
const fs = require('fs');
const jsonRollup = require("rollup-plugin-json");
const commonjs = require('rollup-plugin-commonjs');
const importFilePath = require("rollup-import-file-path");
const htmlImportFilePath = require("rollup-plugin-html-import-file-path");

const sourceDir = "./src/";
const tmpFile = "./tmp/script.js";

console.log(process.cwd());

const inputOptions = {
    input: path.resolve(process.cwd(), tmpFile),
    plugins: [
        commonjs({
            // non-CommonJS modules will be ignored, but you can also
            // specifically include/exclude files
            include: 'node_modules/**',  // Default: undefined
        }),
        htmlImportFilePath({
            path: "**/*.html",
            importAttributes: {
                "[data-view]": "data-view",
                "img[src]":"src"
            },
            "relative":true,
            "asImport":true,
        }),
        importFilePath({
            path: "**/*.jpg"
        }),
        importFilePath({
            path: "**/*.png"
        }),
        jsonRollup({compact: true})
    ],
};
const outputOptions = {
    format: 'es',
    file: path.resolve(process.cwd(), 'dist/cordova-sites.js'),
    nameFile: path.resolve(process.cwd(), 'dist/cordova-sites.names.json'),
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

    if (!fs.existsSync(resultDir)) {
        fs.mkdirSync(resultDir);
    }
    fs.writeFileSync(tmpFile, imports);
}

async function build() {
    await buildEntryPoints();

    const bundle = await rollup.rollup(inputOptions);

    // or write the bundle to disk
    await bundle.write(outputOptions);
    fs.unlinkSync(tmpFile);
}

build();