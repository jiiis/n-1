'use strict';

var $ = require('gulp'),
    $$ = require('./config.plugins'),
    paths = require('./config.paths');

$.task('serve', function() {
    $$.browserSync({
        server: {
            baseDir: paths.app.dir
        }
    });
});
