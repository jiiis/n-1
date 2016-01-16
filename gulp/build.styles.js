'use strict';

var $ = require('gulp'),
    $$ = require('./config.plugins'),
    paths = require('./config.paths'),
    argv = $$.yargs.argv,
    isEnvProd = argv.env === 'prod';

$.task('build:styles:less', function() {
    return $.src(paths.styles.src.file)
        .pipe($$.plumber())
        .pipe($$.less({
            plugins: [
                new $$.lessPluginAutoprefix({
                    browsers: ['last 2 versions']
                }),
                new $$.lessPluginCsscomb()
            ]
        }))
        .pipe($.dest(paths.styles.dist.dir));
});

$.task('build:styles:minify', function() {
    return $.src([
        paths.styles.dist.file
    ], {
        base: paths.styles.dist.dir
    })
        .pipe($$.plumber())
        .pipe($$.sourcemaps.init())
        .pipe($$.if(isEnvProd, $$.minifyCss({
            compatibility: 'ie8',
            keepSpecialComments: 0
        })))
        .pipe($$.sourcemaps.write('./'))
        .pipe($.dest(paths.styles.dist.dir));
});

$.task('build:styles', function(done) {
    return $$.runSequence(
        'build:styles:less',
        'build:styles:minify',
        done
    );
});
