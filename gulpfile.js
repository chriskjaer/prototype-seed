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
    STYLES = ASSETS + 'styles/',
    JS     = ASSETS + 'scripts/',
    IMAGES = ASSETS + 'images/',
    FONTS  = ASSETS + 'fonts/';


//
// TASKS
// -------------------------------------------------------------
gulp.task('css', function() {
  watch({glob: SOURCE + STYLES + '*.scss'}, function(files) {
    return files.pipe(sass({
        errLogToConsole: true
      }))
      .pipe(prefix("last 1 version", "> 1%", "ie 9")
        .on('error', function (error) {
          console.warn(error.message);
        })
      )
      .pipe(gulp.dest(BUILD + STYLES))
      .pipe(browserSync.reload({stream: true}));
  });
});

gulp.task('js', function() {
  return gulp.src([
      SOURCE + JS + '*.js'
    ])
    .pipe(uglify()
      .on('error', function (error) {
        console.warn(error.message);
      })
    )
    .pipe(gulp.dest(BUILD + JS))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('jade', function() {
  watch({glob: SOURCE + '*.jade'}, function(files) {
    return files.pipe(jade({
          pretty: true
        })
        .on('error', function (error) {
          console.warn(error.message);
        })
      )
      .pipe(gulp.dest(BUILD))
      .pipe(browserSync.reload({stream: true, once: true}));
  });
});

gulp.task('images', function() {
  watch({glob: SOURCE + IMAGES + '*.*'}, function(files) {
    return files.pipe(
        gulp.dest(BUILD + IMAGES)
      );
  });
});

gulp.task('fonts', function() {   
  watch({glob: SOURCE + FONTS + '*.*'}, function(files) {
    return files.pipe(
        gulp.dest(BUILD + FONTS)
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
    .pipe( gulp.dest(BUILD + JS));
});

gulp.task('clean', function(cb){
  return del([BUILD], cb);
});

gulp.task('public', function() {
  watch({glob: PUBLIC + '**/*.*'}, function(files) {
    return files.pipe(
      gulp.dest(BUILD)
     );
  });
});

gulp.task('kss', function() {
  return gulp.src([SOURCE + STYLES + '**/*.scss'])
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

  return browserSync({
    server: {
      baseDir: BUILD
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
