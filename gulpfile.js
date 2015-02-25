var gulp = require('gulp'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload');

gulp.task('connect', function() {
    connect.server({
        port: 3000,
        livereload: true
    });
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch("*.html").on("change", livereload.changed);
    gulp.watch("css/**/*.css").on("change", livereload.changed);
    gulp.watch("scripts/**/*.js").on("change", livereload.changed);
});

gulp.task('default', ['connect', 'watch']);
