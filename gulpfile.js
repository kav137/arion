var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
gulp.task('browser-sync',[], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
	gulp.watch(['js/*.js', 'templates/*.html', 'css/*.css', 'index.html']).on('change', browserSync.reload);
	// gulp.watch().on('change', browserSync.reload);
	// gulp.watch().on('change', browserSync.reload);
	// gulp.watch().on('change', browserSync.reload);
});


gulp.task('default', ['browser-sync']);

