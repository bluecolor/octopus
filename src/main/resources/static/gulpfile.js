"use strict";

var gulp = require('gulp'),
    pug  = require('gulp-pug'),
    concat = require('gulp-concat'),
    sass   = require('gulp-sass'),
    path = require('path'),
    rename = require('gulp-rename');

gulp.task('pug', function () {
  return gulp.src(['./**/*.pug', '!./node_modules/**'])
    .pipe(pug({pretty:true}))
    .pipe(rename(function(path) {
      path.dirname = path.dirname != '.' ? `${path.dirname}/html`: path.dirname;
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass())
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./css'));
});


gulp.task('watch', function () {
  gulp.watch('./**/*.pug', ['pug']);
  gulp.watch('./sass/**/*.scss', ['sass']);
});




gulp.task('default', ['watch']);