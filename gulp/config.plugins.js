'use strict';

module.exports = require('gulp-load-plugins')({
    pattern: [
        'gulp-*',
        'gulp.*',
        'del',
        'yargs',
        'run-sequence',
        'browser-sync',
        'less-plugin-autoprefix',
        'less-plugin-csscomb'
    ]
});
