const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const isProduction = process.env.NODE_ENV === 'production';
const versionHash = isProduction ? `.${ packageJson.version }.min` : '';

gulp.task('assets', () => {

	gulp.src('client/graphics/*')
		.pipe(gulp.dest('public/graphics/'));

	return gulp.src('client/font-awesome/*')
		.pipe(gulp.dest('public/font-awesome/'));

});

gulp.task('css', () => {

	const sassOptions = isProduction
		? { outputStyle: 'compressed' }
		: { outputStyle: 'nested', errLogToConsole: true, sourceComments : 'normal' };

	return gulp.src('client/index.sass')
		.pipe(plugins.sass(sassOptions))
		.pipe(plugins.autoprefixer({ browsers: ['> 1%', 'ie > 8'] }))
		.pipe(plugins.rename({ basename: `styles${ versionHash }` }))
		.pipe(gulp.dest('public'));

});

gulp.task('js', () => {

	return gulp.src('client/index.js')
		.pipe(plugins.browserify())
		.pipe(plugins.babel({ presets: ['es2015'] }))
		.pipe(plugins.if(isProduction, plugins.uglify()))
		.pipe(plugins.rename({ basename: `scripts${ versionHash }` }))
		.pipe(gulp.dest('public'));

});

gulp.task('html', () => {

	return gulp.src('client/index.pug')
		.pipe(plugins.pug({ pretty: !isProduction, verbose: !isProduction }))
		.pipe(plugins.htmlReplace({
			'js': `/scripts${ versionHash }.js`,
			'css': `/styles${ versionHash }.css`
		}))
		.pipe(gulp.dest('public'));

});

gulp.task('build', plugins.sequence('assets', 'css', 'js', 'html'));