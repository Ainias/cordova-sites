const rollup = require("rollup");
const path = require("path");
const fs = require('fs');
const jsonRollup = require("rollup-plugin-json");
const commonjs = require('rollup-plugin-commonjs');
const importFilePath = require("rollup-plugin-import-file-path");
const htmlImportFilePath = require("rollup-plugin-html-import-file-path");

const tmpFile = "./tmp/script.js";

const fileOptions = [{
    input: [
        path.resolve(process.cwd(), "src/js/"),
    ],
    output: {
        format: 'es',
        file: path.resolve(process.cwd(), 'dist/cordova-sites.js'),
        nameFile: path.resolve(process.cwd(), 'dist/cordova-sites.names.json'),
    }
},
    // {
    // input: [
    //     path.resolve(process.cwd(), "src/js/"),
    // ],
    // options: {
    //     plugins: [
    //         commonjs({
    //             include: 'node_modules/**',  // Default: undefined
    //         }),
    //         htmlImportFilePath({
    //             include: "**/*.html",
    //             importAttributes: {
    //                 "[data-view]": "data-view",
    //                 "img[src]": "src"
    //             },
    //             relative: true,
    //             asImport: false,
    //         }),
    //         importFilePath({
    //             include: "**/*.jpg"
    //         }),
    //         importFilePath({
    //             include: "**/*.png"
    //         }),
    //         jsonRollup({compact: true})
    //     ]
    // },
    // output: {
    //     format: 'es',
    //     file: path.resolve(process.cwd(), 'dist/cordova-sites.mjs'),
    //     // nameFile: path.resolve(process.cwd(), 'dist/cordova-sites.names.json'),
    // }
// }
];

const options = {
    input: path.resolve(process.cwd(), tmpFile),
    plugins: [
        commonjs({
            // non-CommonJS modules will be ignored, but you can also
            // specifically include/exclude files
            include: 'node_modules/**',  // Default: undefined
        }),
        htmlImportFilePath({
            include: "**/*.html",
            importAttributes: {
                "[data-view]": "data-view",
                "img[src]": "src"
            },
            relative: true,
            asImport: true,
        }),
        importFilePath({
            include: "**/*.jpg"
        }),
        importFilePath({
            include: "**/*.png"
        }),
        jsonRollup({compact: true})
    ]
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

async function buildEntryPoints(fileOption) {
    const cutLengthFront = 0;
    const resultDir = path.resolve(process.cwd(), path.dirname(tmpFile));

    let names = {};
    fileOption.input.forEach(dir => {
        Object.assign(names, findNames(dir + "/", []));
    });

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

    let buildPromise = Promise.resolve();
    fileOptions.forEach(async fileOption => {
        buildPromise = buildPromise.then(async () => {
            await buildEntryPoints(fileOption);

            let currentOptions = options;
            Object.assign(currentOptions, fileOption.options);
            const bundle = await rollup.rollup(currentOptions);

            // or write the bundle to disk
            await bundle.write(fileOption.output);
            fs.unlinkSync(tmpFile);
        });
    });
}

build();