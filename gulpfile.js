const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const autoprefixer = require('autoprefixer');

gulp.task('prep-public', () => {

	gulp.src('client/graphics/*')
		.pipe(gulp.dest('public/graphics/'));

	return gulp.src('client/font-awesome/*')
		.pipe(gulp.dest('public/font-awesome/'));

});

gulp.task('sass', () => {

	const postcssOptions = [autoprefixer({ browsers: ['last 3 versions', '> 5%', 'ie > 8'] })];

	return gulp.src('client/index.sass')
		.pipe(plugins.sass({ outputStyle: 'nested', errLogToConsole: true, sourceComments : 'normal' }))
		.pipe(plugins.postcss(postcssOptions))
		.pipe(plugins.rename({ basename: `styles` }))
		.pipe(gulp.dest('public'));

});

gulp.task('pug', () => {

	return gulp.src('client/index.pug')
		.pipe(plugins.pug({ pretty: true }))
		.pipe(gulp.dest('public'));

});

gulp.task('build', plugins.sequence('prep-public', 'sass', 'pug'));