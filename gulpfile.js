var gulp = require('gulp');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var ghPages = require('gulp-gh-pages');

gulp.task('connect', function() {
  connect.server({
    port: 3000,
    livereload: true
  });
});

gulp.task('scripts', ['es6'], function() {
  return gulp.src([
      'node_modules/leaflet/dist/leaflet.js',
      'node_modules/leaflet.markercluster/dist/leaflet.markercluster.js',
      'libs/leaflet.awesome-markers/dist/leaflet.awesome-markers.min.js',
      'js/transpiled/**/*.js'
    ])
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js'))
    .pipe(connect.reload());
});

gulp.task('es6', function () {
  return gulp.src('scripts/**/*.js')
    .pipe(babel())
    .on('error', function(err) {
      console.log('Error compiling to ES5:\n' + err.message);
      this.emit('end');
    })
    .pipe(gulp.dest('js/transpiled'));
});

gulp.task('styles', ['fonts', 'am-images'], function() {
  return gulp.src([
      'node_modules/leaflet/dist/leaflet.css',
      'node_modules/leaflet.markercluster/dist/MarkerCluster.css',
      'node_modules/font-awesome/css/font-awesome.css',
      'libs/leaflet.awesome-markers/dist/leaflet.awesome-markers.css',
      'styles/main.css'
    ])
    .pipe(concat('all.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('css'))
    .pipe(connect.reload());
});

gulp.task('fonts', function() {
  gulp.src('bower_components/fontawesome/fonts/*')
    .pipe(gulp.dest('fonts'));
});

gulp.task('am-images', function() {
  gulp.src('libs/leaflet.awesome-markers/dist/images/*')
    .pipe(gulp.dest('css/images'));
});

gulp.task('watch', function () {
  gulp.watch('scripts/**/*.js', ['scripts']);
  gulp.watch('styles/**/*.css', ['styles']);
  gulp.watch('index.html', ['scripts', 'styles']);
});

gulp.task('deploy', ['scripts', 'styles'], function() {
  gulp.src([
    'js/all.min.js',
    'css/**/*',
    'data/*',
    'fonts/*',
    'index.html',
  ], { base: './' })
    .pipe(gulp.dest('dist'));

  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['connect', 'scripts', 'styles', 'watch']);
