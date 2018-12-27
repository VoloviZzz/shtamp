"use strict";

var gulp = require('gulp'),
	cssnano = require('gulp-cssnano'),
	autoprefixer = require('gulp-autoprefixer'),
	sass = require('gulp-sass'),
	concatCss = require('gulp-concat-css');

gulp.task('scss', function () {
	return gulp
		.src('app/public/scss/**/*.scss') // Выбираем scss файлы
		.pipe(sass()) // Компилируем в css
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) //Проставляем автопрефиксы
		.pipe(concatCss('static.min.css')) // Собираем все в единый файл
		.pipe(cssnano()) // Удаляем пробелы и табуляции
		.pipe(gulp.dest('app/public/css')); // Выгружаем в папку css
})

gulp.task('default', ['scss'], function () { // Запускаем таск по умолчанию вместе с таском scss и отслеживаем изменения
	gulp.watch('app/public/scss/**/*.scss', ['scss']);
});