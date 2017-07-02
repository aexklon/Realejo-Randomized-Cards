const gulp = require('gulp')
const webpack = require('gulp-webpack')
const sass = require('gulp-sass')
const ejs = require('gulp-ejs')
const extReplace = require('gulp-ext-replace')
const usemin = require('gulp-usemin')
const sourcemaps = require('gulp-sourcemaps')
const livereload = require('gulp-livereload')
const xlsxj = require('xlsx-to-json')
// directories to be used in gulp //////////////////////////////////////////////
const dir = {
  src: './src',
  dist: './dist'
}
// task groups /////////////////////////////////////////////////////////////////
gulp.task('default', ['font-awesome', 'img', 'sass', 'webpack', 'ejs', 'serve', 'watch'])
// xlsx to josn utility ////////////////////////////////////////////////////////
gulp.task('xlsxj', () => {
  xlsxj({
			input: dir.src+'/demo.xlsx',
			output: dir.dist+'/demo.json',
			sheet: 'cards'
		}, function(err, result) {
		if(err) {
			console.error(err);
		} else {
			console.log(result);
		}
	})
})
// compile tasks ///////////////////////////////////////////////////////////////
gulp.task('font-awesome', () => {
  return gulp.src('./bower_components/font-awesome/fonts/*')
    .pipe(gulp.dest(dir.dist + '/fonts'))
})
gulp.task('img', () => {
  return gulp.src(dir.src + '/img/**/*.+(jpg|jpeg|gif|png)')
    .pipe(gulp.dest(dir.dist + '/img'))
})
gulp.task('sass', () => {
  return gulp.src(dir.src + '/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dir.dist))
})
gulp.task('ejs', () => {
  return gulp.src([dir.src + '/*.ejs', '!' + dir.src + '/_*'])
    .pipe(sourcemaps.init())
    .pipe(ejs())
    .pipe(extReplace('.html'))
    .pipe(usemin({
      css: [],
      js: []
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dir.dist))
})
gulp.task('webpack', function () {
  return gulp.src(dir.src + '/app.jsx')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(dir.dist))
})
// watch ///////////////////////////////////////////////////////////////////////
gulp.task('watch', () => {
  livereload.listen()
  gulp.watch([dir.src + '/*.jsx'], ['webpack'])
  gulp.watch([dir.src + '/*.ejs'], ['ejs'])
  gulp.watch([dir.src + '/*.scss'], ['sass'])
  gulp.watch([dir.src + '/img/**'], ['img'])
  gulp.watch(dir.dist + '/*', function (file) {
    livereload.changed(file.path)
  })
})
// development server //////////////////////////////////////////////////////////
gulp.task('serve', () => {
  const chalk = require('chalk')
  const express = require('express')
  const devServer = express()
  const port = 8080
  const paths = [{
    url: '/',
    path: dir.dist.replace('./', '/')
  }]
  // devServer.use((req, res, next)=>{
  //   console.log(chalk.inverse(' 127.0.0.1'+(port===80?'':':'+port)+' '), chalk.green(req.path))
  //   next()
  // })
  paths.forEach((item, i) => {
    devServer.use(item.url, express.static(__dirname + item.path))
    console.log('serving', chalk.gray(__dirname) + chalk.cyan(item.path), '@' + chalk.cyan(item.url))
  })
  devServer.listen(
    port,
    console.log(chalk.inverse(' 127.0.0.1' + (port === 80 ? '' : ':' + port) + ' '), chalk.green('online'))
  )
})
