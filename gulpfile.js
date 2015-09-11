console.log("Gulp starting...");

var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
//var webserver = require('gulp-webserver');
//var babelify = require('babelify');
//var browserify = require('browserify');
var source = require('vinyl-source-stream');
var minifyCss = require('gulp-minify-css');

var WATCHLIST = [];

var BUILD_PATH = "frontend/public";

gulp.task('vendors', function(){
  var paths = ['frontend/app/vendor/jquery/dist/jquery.js', 
  'frontend/app/vendor/socket.io-client/socket.io.js', 
  'frontend/app/vendor/angular/angular.js', 
  'frontend/app/vendor/bootstrap/dist/js/bootstrap.js',
  'frontend/app/vendor/angular-bootstrap/ui-bootstrap-tpls.js'];
  WATCHLIST.push({
      path: paths,
      taskName: ['vendors']
    });
    return gulp.src(paths)
      .pipe(concat('vendor.js'))
        //.pipe(gulp.dest(BUILD_PATH + "/build"))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(BUILD_PATH + '/js'));
});

gulp.task('scripts', function() {
    var paths = ['frontend/app/js/*.js', 'frontend/app/js/**/*.js'];
    WATCHLIST.push({
      path: paths,
      taskName: ['scripts']
    });
    return gulp.src(paths)
      .pipe(concat('main.js'))
        //.pipe(gulp.dest(BUILD_PATH + "/build"))
//        .pipe(babel())
        .pipe(rename({suffix: '.min'}))
        //.pipe(uglify())
        .pipe(gulp.dest(BUILD_PATH + '/js'));
});

gulp.task('copy-index', function(){
  var paths = ['frontend/app/index.html'];
  WATCHLIST.push({
    path: paths,
    taskName: ['copy-index']
  });
  return gulp.src(paths)
    .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('templates', function(){
  var paths = ['frontend/app/templates/*'];
  WATCHLIST.push({
    path: paths,
    taskName: ['templates']
  });
  return gulp.src(paths)
    .pipe(gulp.dest(BUILD_PATH + "/templates"));
});

gulp.task('minify-css', function() {
  var paths = ['frontend/app/vendor/bootstrap/dist/css/bootstrap.css', 
  'frontend/app/vendor/bootstrap/dist/css/bootstrap-theme.css',
  'frontend/app/css/*.css']
  WATCHLIST.push({
    path: paths,
    taskName: ['minify-css']
  });
  return gulp.src(paths)
    .pipe(concat('style.css'))
    //.pipe(minifyCss())
    .pipe(gulp.dest(BUILD_PATH + '/style'));
});

gulp.task('watch', function(){
  WATCHLIST.forEach(function(watches){
    gulp.watch(watches.path, watches.taskName);
  });
});

 // Default Task
gulp.task('default', ['copy-index', 'templates','vendors','scripts','minify-css','watch']);

