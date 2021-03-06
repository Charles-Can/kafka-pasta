import gulp from 'gulp';
import babel from 'gulp-babel';

gulp.task('build', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest("dist"));
}); 

gulp.task('default', () => {
  gulp.watch('src/**/*.js', ['build'])
});