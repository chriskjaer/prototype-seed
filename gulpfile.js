'use strict';

var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    sass        = require('gulp-sass'),
    uglify      = require('gulp-uglify'),
    jade        = require('gulp-jade'),
    watch       = require('gulp-watch'),
    prefix      = require('gulp-autoprefixer'),
    del         = require('del'),
    server      = require('./server'),
    kss         = require('gulp-kss'),
    browserSync = require('browser-sync');


//
// Paths
// -------------------------------------------------------------
var SOURCE = 'source/',
    BUILD  = 'build/',
    PUBLIC = 'public/',
    ASSETS = 'assets/',
    BOWER = 'bower_components/',
    STYLES = ASSETS + 'styles/',
    JS     = ASSETS + 'scripts/',
    IMAGES = ASSETS + 'images/',
    FONTS  = ASSETS + 'fonts/';


//
// TASKS
// -------------------------------------------------------------
gulp.task('css', function() {
  var FILES = SOURCE + STYLES + '*.scss';
  gulp.src(FILES)
    .pipe(watch(FILES, function(files) {
      return files
        .pipe(sass({ errLogToConsole: true }))
        .pipe(prefix("last 1 version", "> 1%", "ie 9")
              .on('error', function (error) { console.warn(error.message); }))
        .pipe(gulp.dest(BUILD + STYLES))
        .pipe(browserSync.reload({stream: true}));
    }));
});

gulp.task('js', function() {
  var FILES = [ SOURCE + JS + '*.js' ];
  gulp.src(FILES)
    .pipe(uglify()
          .on('error', function (error) { console.warn(error.message); }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(BUILD + JS))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('jade', function() {
  var FILES = SOURCE + '*.jade';
  gulp.src(FILES)
    .pipe(jade({ pretty: true })
          .on('error', function (error) { console.warn(error.message); }))
    .pipe(gulp.dest(BUILD) )
    .pipe(browserSync.reload({stream: true, once: true}) );
});

gulp.task('images', function() {
  var FILES = SOURCE + IMAGES + '*.*';
  gulp.src(FILES)
    .pipe(watch(FILES, function(files) {
      return files.pipe( gulp.dest(BUILD + IMAGES) );
    }));
});

gulp.task('fonts', function() {
  var FILES = SOURCE + FONTS + '*.*';
  gulp.src(FILES)
    .pipe(watch(FILES, function(files) {
      return files.pipe( gulp.dest(BUILD + FONTS));
    }));
});

gulp.task('vendor', function() {
  var FILES = [
    BOWER + 'modernizr/modernizr.js',
    BOWER + 'respond/src/respond.js' ];
  gulp.src(FILES)
      .pipe(concat('vendor.js'))
      .pipe(uglify())
      .pipe(gulp.dest(BUILD + JS));
});

gulp.task('clean', function(cb){
  del([BUILD], cb);
});

gulp.task('public', function() {
  var FILES = PUBLIC + '**/*.*';
  gulp.src(FILES)
    .pipe(watch(FILES, function(files) {
      return files.pipe( gulp.dest(BUILD));
    }));
});

gulp.task('kss', function() {
  gulp.src([SOURCE + STYLES + '**/*.scss'])
      .pipe(kss({
        overview: 'README.md',
        templateDirectory: SOURCE + 'styleguide-template/'
      }))
      .pipe(gulp.dest(BUILD + 'styleguide/'));
});

// --- Bringing it all together in a build task ---
gulp.task('build', ['js', 'css', 'jade', 'images', 'fonts', 'vendor', 'public', 'kss']);


// --- Setting up browser sync - see https://github.com/shakyShane/browser-sync ---
gulp.task('browser-sync', ['clean'], function() {
  gulp.start('build');
  browserSync({ server: { baseDir: BUILD } });
});


// --- Let gulp keep an eye on our files and compile stuff if it changes ---
gulp.task('watch', ['browser-sync'], function () {
  gulp.watch(SOURCE + STYLES + '**/*.scss',['css', 'kss']);

  gulp.watch(SOURCE + '**/*.jade',['jade']);

  gulp.watch(SOURCE + JS + '**/*.js',['js']);

  gulp.watch(SOURCE + IMAGES + '*.*',['images']);

  gulp.watch([SOURCE + 'styleguide-template/**/*.*', 'README.md'],['kss']);
});


// --- Default gulp task, run with gulp. - Starts our project and opens a new browser window.
gulp.task('default', ['clean'], function(){
  gulp.start('watch');
});


// --- Heroku Task. Is only run when deployed to heroku.
gulp.task('heroku', ['clean'], function() {
  gulp.start('build');
  var port = process.env.PORT || 3000;

  server.listen(port, function() {
    console.log("Listening on " + port);
  });
});
