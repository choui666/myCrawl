var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsp = ts.createProject('tsconfig.json'); //使用tsconfig.json文件配置tsc
var exec = require('child_process').exec;
var child;
//目录常量
var PATHS = {
    scripts: ['./src/**/*.ts'],
    output: './build',
};
//编译ts文件
gulp.task('build-ts', ['restart'], function () {
    console.log('build-ts......');
    return gulp.src(PATHS.scripts)
        .pipe(tsp())
        .pipe(gulp.dest(PATHS.output));
});
//监视ts文件变化
gulp.task('watch-ts', ['build-ts'], function () {
    console.log('watch-ts......');
    gulp.watch(PATHS.scripts, ['build-ts']);
});
//自动重启服务器
gulp.task('restart', function () {
    console.log('restart......');
    child = exec('supervisor -w build ./build/index.js', function (error, stdout, stderr) {
        console.log("stdout: " + stdout);
        console.log("stderr: " + stderr);
        if (error !== null) {
            console.log("exec error: " + error);
        }
    });
});
//开发任务
gulp.task('dev', ['build-ts', 'restart', 'watch-ts']);
//# sourceMappingURL=gulpfile.js.map