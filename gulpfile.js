var gulp = require('gulp');
var connect = require('gulp-connect');
var livereload = require('gulp-livereload');
var babel = require('gulp-babel');

gulp.task('connect', function() {
    connect.server({
        port: 3000,
        livereload: true
    });
});

gulp.task('es6', function () {
  return gulp.src('scripts/**/*.js')
    .pipe(babel())
    .on('error', function(err) {
        console.log('Error compiling to ES5:\n' + err.message);
        this.emit('end');
    })
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch('*.html').on('change', livereload.changed);
    gulp.watch('styles/**/*.css').on('change', livereload.changed);
    gulp.watch('scripts/**/*.js').on('change', livereload.changed);
    gulp.watch('scripts/**/*.js', ['es6']);
});

gulp.task('default', ['connect', 'es6', 'watch']);
