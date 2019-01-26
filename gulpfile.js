const { src, dest, parallel } = require('gulp');
const typedoc = require("gulp-typedoc");

function doc() {
    return src(["projects/polpware/fe-data/src/lib/**/*.ts"])
        .pipe(typedoc({
            name: "Polpware typescript data (3.0.1)",            
            out: "docs/",            
            
            module: "commonjs",
            target: "es5",

            exclude: "projects/polpware/fe-data/src/lib/**/*.spec.ts",                        

            experimentalDecorators: true,
            excludePrivate: true,
            excludeExternals: true,

            "lib": [
                "lib.dom.d.ts",
                "lib.es2015.d.ts",                
                "lib.es2016.d.ts"
            ]
            
        }));
}

exports.doc = doc;
exports.default = doc;
