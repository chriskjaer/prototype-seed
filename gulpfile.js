var gulp        = require('gulp'),
    clean       = require('gulp-clean'),
    concat      = require('gulp-concat'),
    sass        = require('gulp-sass'),
    csso        = require('gulp-csso'),
    uglify      = require('gulp-uglify'),
    jade        = require('gulp-jade'),
    path        = require('path'),
    browserSync = require('browser-sync'),
    app         = require('./package.json');

//
// TASKS
// -------------------------------------------------------------

gulp.task('css', function() {
  return gulp.src('src/assets/styles/*.sass')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(csso()) 
    .pipe(gulp.dest('build/assets/styles/'));
});

gulp.task('js', function() {
  return gulp.src([
      'src/assets/scripts/*.js'
    ])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/assets/scripts/'));
});

gulp.task('jade', function() {
  return gulp.src('src/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('images', function() {
  return gulp.src('src/assets/images/*.*')
    .pipe( gulp.dest('build/assets/images/'));
});

gulp.task('fonts', function() {
  return gulp.src('src/assets/fonts/*.*')
    .pipe( gulp.dest('build/assets/fonts/'));
});

gulp.task('vendor', function() {
  return gulp.src([
      'bower_components/modernizr/modernizr.js',
      'bower_components/respond/src/respond.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe( gulp.dest('build/assets/scripts/'));
});

gulp.task('clean', function(){
  return gulp.src('./build/', {read: false})
    .pipe(clean({force: true}));
});


// --- Bringing it all together in a build task ---
gulp.task('build', ['js', 'css', 'jade', 'images', 'fonts', 'vendor']);


// --- Setting up browser sync - see https://github.com/shakyShane/browser-sync ---
gulp.task('browser-sync', ['build'], function() {  
  browserSync.init([
    'build/assets/styles/*.css', 
    'build/assets/scripts/**/*.js',
    'build/*.html'], {
    server: {
      baseDir: './build/'
    },
    ghostMode: {
      clickedLinks: true, // Allow click events on <a> elements (buggy, avoid if possible)
      clicks: true,
      links: false,
      forms: true,
      scroll: true
    },
    timestamps: false // turn this off, and allow chrome to write to disk and see magic happens across devices when you change stuff in style inspector.
  });
});


// --- Let gulp keep an eye on our files and compile stuff if it changes ---
gulp.task('watch', ['browser-sync'], function () {
  gulp.watch('src/assets/styles/**/*.sass',['css']);

  gulp.watch('src/**/*.jade',['jade']);

  gulp.watch('src/assets/scripts/**/*.js',['js']);

  gulp.watch('src/assets/images/*.*',['images']);
});


// --- Default gulp task, run with gulp. - Starts our project and opens a new browser window.
gulp.task('default', ['clean'], function(){
  gulp.start('watch');
});
