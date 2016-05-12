'use strict';

/*-------------------------------------------------------------------
  Required plugins
-------------------------------------------------------------------*/
const gulp = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const concat = require('gulp-concat')
const fileinclude = require('gulp-file-include')
const flatten = require('gulp-flatten')
const htmlmin = require('gulp-htmlmin')
const imagemin = require('gulp-imagemin')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const gutil = require('gulp-util')
const webserver = require('gulp-webserver')
const runSequence = require('run-sequence')

/*-------------------------------------------------------------------
  Configuration
-------------------------------------------------------------------*/
const projectName = 'demo1'
const qiniu = {
  accessKey: '',
  secretKey: '',
  bucket: '',
  domain: 'http://'
}
const bui = {
  js: projectName + '-js',
  images: projectName + '-images',
  css: projectName + '-css',
  scss: projectName + '-scss',
  fonts: projectName + '-fonts',
  html: projectName + '-html',
  watch: projectName + '-watch',
  webserver: projectName + '-webserver'
}
const path = {
  js: './js',
  images: './images',
  css: './css',
  scss: './scss',
  fonts: './fonts',
  html: './tpl',
  deploy: './public'
}
const watch = {
  js: path.js + '/*.js',
  images: path.images + '/*',
  css: path.css + '/*.css',
  scss: path.scss + '/*.scss',
  fonts: [path.fonts + '/*', path.fonts + '/**/*',],
  html: path.html + '/**/*.html',
  page: path.html + '/page/*.html'
}
const watchBuiArr = [bui['images'], bui['js'], bui['css'], bui['scss'], bui['fonts'], bui['html']]
const deploy = {
  js: path.deploy + '/js',
  images: path.deploy + '/images',
  css: path.deploy + '/css',
  fonts: path.deploy + '/fonts',
  html: path.deploy + '/html'
}
const smile = gutil.colors.bgBlue(' ^_^ ')
let watchArr = []

/*-------------------------------------------------------------------
  DEV TASKS
-------------------------------------------------------------------*/
gulp.task(bui['js'], function() {
  gutil.log(smile + ' -> ' + bui['js']);
  return gulp.src(watch.js)
    .pipe(uglify())
    .pipe(flatten())
    .pipe(gulp.dest(deploy.js));
});
gulp.task(bui['images'], function() {
  gutil.log(smile + ' -> ' + bui['images']);
  return gulp.src(watch.images)
    .pipe(imagemin())
    .pipe(gulp.dest(deploy.images));
});
gulp.task(bui['css'], function() {
  gutil.log(smile + ' -> ' + bui['css']);
  return gulp.src(watch.css)
    .pipe(autoprefixer({browsers: ['last 2 versions'],}))
    .pipe(cleanCSS())
    .pipe(flatten())
    .pipe(gulp.dest(deploy.css));
});
gulp.task(bui['scss'], function() {
  gutil.log(smile + ' -> ' + bui['scss']);
  return gulp.src(watch.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 2 versions'],}))
    .pipe(cleanCSS())
    .pipe(flatten())
    .pipe(gulp.dest(deploy.css));
});
gulp.task(bui['fonts'], function() {
  gutil.log(smile + ' -> ' + bui['fonts']);
  return gulp.src(watch.fonts)
    .pipe(flatten())
    .pipe(gulp.dest(deploy.fonts));
});
gulp.task(bui['html'], function() {
  gutil.log(smile + ' -> ' + bui['html']);
  return gulp.src(watch.page)
    .pipe(fileinclude({prefix: '@@',basepath: '@file'}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(deploy.html));
});
gulp.task(bui['watch'], function() {
  gutil.log(smile + ' -> ' + bui['watch']);
  for (let i in watch) {
    watchArr.push(watch[i]);
  }
  gutil.log(smile + ' -> ' + 'watch path: ');
  gutil.log(watchArr);
  runSequence(watchBuiArr);
  gulp.watch(watchArr, watchBuiArr);
});
gulp.task(bui['webserver'], function() {
  gutil.log(smile + ' -> ' + bui['webserver']);
  gulp.src('./')
    .pipe(webserver({
      port: 8001,
      livereload: true,
      directoryListing: true,
      open: 'public/html/index.html'
    }));
});
gulp.task('default', function(callback) {
  runSequence(
    bui['webserver'],
    bui['watch'],
    callback)
});
