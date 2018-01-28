var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var templates = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-minify-html');

// Minify and templateCache your Angular Templates
// Add a 'templates' module dependency to your app:
// var app = angular.module('appname', [ ... , 'templates']);

gulp.task('templates', function () {
  gulp.src([
      './**/*.html',
      '!./node_modules/**'
    ])
    .pipe(minifyHTML({
      quotes: true
    }))
    .pipe(templates('templates.js'))
    .pipe(gulp.dest('tmp'));
});

// Concat and uglify all your JavaScript

gulp.task('default', ['templates'], function() {
  gulp.src([
      './**/*.js',
      '!./public/js/**/*.js',
      '!./node_modules/**',
      '!./gulpfile.js',
      '!./dist/all.js'
    ])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});