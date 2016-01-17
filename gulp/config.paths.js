'use strict';

var path = require('path'),
    dirAssets = path.join(__dirname, '../app/assets'),
    dirStyles = path.join(dirAssets, 'styles'),
    dirScripts = path.join(dirAssets, 'scripts'),
    dirVendors = path.join(dirAssets, 'vendors');

module.exports = {
    assets: {
        dir: dirAssets
    },
    styles: {
        dir: dirStyles,
        src: {
            dir: path.join(dirStyles, 'src'),
            file: path.join(dirStyles, 'src', 'app.less'),
            files: path.join(dirStyles, 'src', '**/*')
        },
        dist: {
            dir: path.join(dirStyles, 'dist'),
            file: path.join(dirStyles, 'dist', 'app.css'),
            files: path.join(dirStyles, 'dist', '**/*')
        }
    },
    scripts: {
        dir: dirScripts,
        src: {
            shared: {
                top: {
                    files: [
                        path.join(dirVendors, 'bower', 'selectivizr', 'selectivizr.js'),
                        path.join(dirVendors, 'bower', 'respond', 'dest', 'respond.src.js'),
                        path.join(dirVendors, 'bower', 'html5shiv', 'dist', 'html5shiv.js')
                    ]
                },
                bottom: {
                    files: [
                        path.join(dirVendors, 'bower', 'jquery', 'dist', 'jquery.js'),
                        path.join(dirVendors, 'bower', 'jquery-mousewheel', 'jquery.mousewheel.js'),
                        path.join(dirScripts, 'src', 'app.js')
                    ]
                }
            },
            pages: {}
        },
        dist: {
            dir: path.join(dirScripts, 'dist'),
            files: path.join(dirScripts, 'dist', '**/*')
        }
    },
    vendors: {
        dir: dirVendors,
        styles: {
            files: path.join(dirVendors, '**/*.@(less|css)')
        }
    }
};
