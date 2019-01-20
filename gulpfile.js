const { src, dest, parallel, watch, series } = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const minifyCss = require("gulp-csso");
const pug = require("gulp-pug");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const rename = require("gulp-rename");
const responsive = require("gulp-responsive");

function serve(done) {
  browserSync.init({
    server: {
      baseDir: "./build"
    },
    port: 3000,
    open: true
  });
  done();
}

function browserSynReload(done) {
  browserSync.reload();
  done();
}

function html() {
  return src("./client/**/*.pug")
    .pipe(pug({ pretty: true }))
    .pipe(dest("build"))
    .pipe(browserSync.stream());
}

function css(done) {
  return src("client/sass/**/*.scss")
    .pipe(
      sass({
        outputStyle: "expaneded"
      })
    )
    .on("error", sass.logError)
    .pipe(
      autoprefixer({
        browsers: ["> 0.5%", "last 2 versions", "not dead"],
        cascade: false
      })
    )
    .pipe(dest("build/css"))
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(minifyCss())
    .pipe(dest("build/css"))
    .pipe(browserSync.stream());
}

function js() {
  return src("client/js/**/*.js", { sourcemaps: true })
    .pipe(concat("app.min.js"))
    .pipe(dest("build/js", { sourcemaps: true }));
}

function images() {
  return src("./client/images/*.{jpg,jpeg,png}")
    .pipe(
      responsive({
        "*": [
          {
            // image-small.jpg is 200 pixels wide
            width: 200,
            rename: {
              suffix: "-small",
              extname: ".jpg"
            }
          },
          {
            // image-small@2x.jpg is 400 pixels wide
            width: 200 * 2,
            rename: {
              suffix: "-small@2x",
              extname: ".jpg"
            }
          },
          {
            // image-large.jpg is 480 pixels wide
            width: 480,
            rename: {
              suffix: "-large",
              extname: ".jpg"
            }
          },
          {
            // image-large@2x.jpg is 960 pixels wide
            width: 480 * 2,
            rename: {
              suffix: "-large@2x",
              extname: ".jpg"
            }
          },
          ,
          {
            // image-small.webp is 200 pixels wide
            width: 200,
            rename: {
              suffix: "-small",
              extname: ".webp"
            }
          },
          {
            // image-small@2x.webp is 400 pixels wide
            width: 200 * 2,
            rename: {
              suffix: "-small@2x",
              extname: ".webp"
            }
          },
          {
            // image-large.webp is 480 pixels wide
            width: 480,
            rename: {
              suffix: "-large",
              extname: ".webp"
            }
          },
          {
            // image-large@2x.webp is 960 pixels wide
            width: 480 * 2,
            rename: {
              suffix: "-large@2x",
              extname: ".webp"
            }
          }
        ]
      })
    )
    .pipe(dest("build/assets/images"));
}

function watchFiles() {
  watch("client/sass/**/*", css);
  watch("./client/**/*", html);
  watch("client/js/**/*", series(js, browserSynReload));
}

exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.watch = parallel(watchFiles, serve);
exports.default = parallel(html, css, js, images);
