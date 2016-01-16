'use strict';

var $ = require('gulp'),
    $$ = require('./config.plugins'),
    paths = require('./config.paths'),
    argv = $$.yargs.argv,
    isEnvProd = argv.env === 'prod';

$.task('build:scripts:shared-top', function() {
    return $.src(paths.scripts.src.shared.top.files)
        .pipe($$.plumber())
        .pipe($$.sourcemaps.init())
        .pipe($$.concat('shared-top.js'))
        .pipe($$.if(isEnvProd, $$.uglify({
            preserveComments: false
        })))
        .pipe($$.sourcemaps.write('./'))
        .pipe($.dest(paths.scripts.dist.dir));
});

$.task('build:scripts:shared-bottom', function() {
    return $.src(paths.scripts.src.shared.bottom.files)
        .pipe($$.plumber())
        .pipe($$.sourcemaps.init())
        .pipe($$.concat('shared-bottom.js'))
        .pipe($$.if(isEnvProd, $$.uglify({
            preserveComments: false
        })))
        .pipe($$.sourcemaps.write('./'))
        .pipe($.dest(paths.scripts.dist.dir));
});

$.task('build:scripts', function(done) {
    return $$.runSequence(
        [
            'build:scripts:shared-top',
            'build:scripts:shared-bottom'
        ],
        done
    );
});
