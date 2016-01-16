'use strict';

var $ = require('gulp'),
    $$ = require('./config.plugins'),
    paths = require('./config.paths');

$.task('clean', function(done) {
    return $$.del([
        paths.styles.dist.files,
        paths.scripts.dist.files
    ], done);
});
