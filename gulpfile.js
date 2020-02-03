const gulp = require("gulp");
const nodemon = require("gulp-nodemon");
const gulpMocha = require("gulp-mocha");
const env = require("gulp-env");
const supertest = require("supertest");

gulp.task("default", function() {
    nodemon({
        script: "index.js",
        ext: "js",
        env: {
            PORT: 8000
        },
        ignore: ["./node_modules/*"]
    })
    .on("restart", ()=>{
        console.log("Restarting");
    });
});
// gulp.task("default", function() {
    
// });

// gulp.task('default', gulp.series(nodemon({
//         script: "index.js",
//         ext: "js",
//         env: {
//             PORT: 8000
//         },
//         ignore: ["./node_modules/**"]
//     })
//     .on("restart", ()=>{
//         console.log("Restarting");
//     })
//     ));

gulp.task("test", ()=>{
    env({vars: {ENV: "Test"}});
    return gulp.src("tests/*.test.js")
        .pipe(gulpMocha({reporter: "nyan"}))
});
