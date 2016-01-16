'use strict';

var $ = require('gulp'),
    $$ = require('./config.plugins');

$.task('build', function(done) {
    $$.runSequence(
        'clean',
        [
            'build:styles',
            'build:scripts'
        ],
        done
    );
});
