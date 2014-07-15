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
    browserSync = require('browser-sync');

//
// TASKS
// -------------------------------------------------------------

gulp.task('css', function() {
  watch({glob: 'src/assets/styles/*.scss'}, function(files) {
    return files.pipe(sass({
        errLogToConsole: true
      }))
      .pipe(prefix("last 1 version", "> 1%", "ie 9").on('error', function (error) {
        console.warn(error.message);
      }))
      .pipe(gulp.dest('build/assets/styles/'))
      .pipe(browserSync.reload({stream: true}));
  });
});

gulp.task('js', function() {
  return gulp.src([
      'src/assets/scripts/*.js'
    ])
    .pipe(uglify())
    .pipe(gulp.dest('build/assets/scripts/'))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('jade', function() {
  watch({glob: 'src/*.jade'}, function(files) {
    return files.pipe(jade({
        pretty: true
      }))
      .pipe(gulp.dest('build/'))
      .pipe(browserSync.reload({stream: true, once: true}));
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

gulp.task('clean', function(cb){
  return del(['./build'], cb);
});

gulp.task('public', function() {
  watch({glob: 'src/public/**/*.*'}, function(files) {
    return files.pipe(
      gulp.dest('build/')
     );
  });
});

// --- Bringing it all together in a build task ---
gulp.task('build', ['js', 'css', 'jade', 'images', 'fonts', 'vendor', 'public']);


// --- Setting up browser sync - see https://github.com/shakyShane/browser-sync ---
gulp.task('browser-sync', ['clean'], function() {  
  gulp.start('build');

  return browserSync({
    server: {
      baseDir: 'build'
    },
    ghostMode: {
      clicks: true,
      location: true,
      forms: true,
      scroll: true
    }
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

gulp.task('heroku', ['clean'], function() {
  gulp.start('build');
  var port = process.env.PORT || 3000;
   
  server.listen(port, function() {
    console.log("Listening on " + port);
  });
});
