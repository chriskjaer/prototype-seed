'use strict';

var gulp        = require('gulp'),
    clean       = require('gulp-clean'),
    concat      = require('gulp-concat'),
    sass        = require('gulp-sass'),
    uglify      = require('gulp-uglify'),
    jade        = require('gulp-jade'),
    watch       = require('gulp-watch'),
    browserSync = require('browser-sync');

//
// TASKS
// -------------------------------------------------------------

gulp.task('css', function() {
  watch({glob: 'src/assets/styles/*.scss'}, function(files) {
    return files.pipe(sass({
        errLogToConsole: true
      }))
      .pipe(gulp.dest('build/assets/styles/'));
  });
});

gulp.task('js', function() {
  watch({glob: 'src/assets/scripts/*.js'}, function(files) {
    return files.pipe(concat('all.js'))
      .pipe(uglify())
      .pipe(gulp.dest('build/assets/scripts/'));
  });
});

gulp.task('jade', function() {
  watch({glob: 'src/*.jade'}, function(files) {
    return files.pipe(jade({
        pretty: true
      }))
      .pipe(gulp.dest('build/'));
  });
});

gulp.task('images', function() {
  watch({glob: 'src/assets/images/*.*'}, function(files) {
    return files.pipe(
        gulp.dest('build/assets/images/')
      );
  });
});

gulp.task('fonts', function() {   
  watch({glob: 'src/assets/fonts/*.*'}, function(files) {
    return files.pipe(
        gulp.dest('build/assets/fonts/')
      );
  });
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
    'build/*.html'
  ], {
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
  gulp.watch('src/assets/styles/**/*.scss',['css']);

  gulp.watch('src/**/*.jade',['jade']);

  gulp.watch('src/assets/scripts/**/*.js',['js']);

  gulp.watch('src/assets/images/*.*',['images']);
});


// --- Default gulp task, run with gulp. - Starts our project and opens a new browser window.
gulp.task('default', ['clean'], function(){
  gulp.start('watch');
});
