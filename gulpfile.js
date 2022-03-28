const { watch, src, dest, series, parallel } = require("gulp");

// Include more
const browserSync = require("browser-sync").create(); // dev server with port
const sourcemaps = require("gulp-sourcemaps");
const connect = require("gulp-connect");
const concat = require("gulp-concat");

// HTML
const fileinclude = require("gulp-file-include"); // html partials
const minifyHTML = require("gulp-minify-html"); // html minify
const image = require("gulp-image"); // images optymize

// SCSS
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer"); // browser prefixes
const purgecss = require("@fullhuman/postcss-purgecss"); // remove unused
const cssnano = require("cssnano"); // css compression
const postcss = require("gulp-postcss");
const critical = require("critical").stream; // critical css

// JS
const babel = require("gulp-babel"); // js transforms
const uglify = require("gulp-uglify"); // js minify
const rollup = require("gulp-better-rollup"); // ES6 Bundler - import/export
const rollupBabel = require("rollup-plugin-babel"); // babel - js transforms
const commonjs = require("@rollup/plugin-commonjs"); // import/export from node
const nodeResolve = require("@rollup/plugin-node-resolve"); // import/export from node
const eslint = require("gulp-eslint"); // js code checker

const javascriptObfuscator = require("gulp-javascript-obfuscator"); // obfuscator

// Custom tasks
const webp = require("gulp-webp");
const gulpAvif = require("gulp-avif");
// const img = require("./gulp-tasks/images.js");

const responsive = require("gulp-responsive");

const path = {
  html: "src/html/*.html",
  scss: "src/scss/*.scss",
  js: "src/js/*.js",
  partials: "src/html/partials/"
};

const htmlTask = () => {
  return src(path.html)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: path.partials
      })
    )
    .pipe(minifyHTML({ empty: true }))
    .pipe(dest("dist/"))
    .pipe(browserSync.stream());
};

const scssTask = () => {
  return src(path.scss)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      postcss([
        autoprefixer(),
        cssnano({
          discardComments: { removeAll: true }
        }),
        purgecss({
          content: [
            "src/**/*.html",
            "src/**/*.js",
            "node_modules/swiper/**/*.js"
          ],
          keyframes: true
        })
      ])
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
};

const jsTask = () => {
  return src([
    "node_modules/jquery/dist/jquery.js",
    "node_modules/datatables/media/js/jquery.dataTables.js",
    "src/js/main.js"
  ])
    .pipe(
      rollup(
        {
          plugins: [
            rollupBabel({
              presets: ["@babel/preset-env"]
            })
          ]
        },
        "umd"
      )
    )
    .pipe(concat("main.js"))
    .pipe(dest("dist/js"));
};

const respImages = () => {
  return src("src/images/**/*.{jpg,png}")
    .pipe(
      responsive(
        {
          "**/*.jpg": [
            {
              width: "10%",
              blur: 1.2,
              rename: { suffix: "-placeholder" },
              format: ["webp", "jpg"]
            }
          ],
          "**/*.png": [
            {
              width: "10%",
              blur: 1.2,
              rename: { suffix: "-placeholder" },
              format: ["webp", "png"]
            }
          ]
        },
        {
          errorOnEnlargement: false,
          skipOnEnlargement: true,
          errorOnUnusedConfig: false,
          errorOnUnusedImage: false
        }
      )
    )
    .pipe(dest("dist/images"));
};

const convertWebp = () => {
  return src("src/images/**/*.{jpg,jpeg,png}")
    .pipe(webp({ quality: 60 }))
    .pipe(dest("dist/images"));
};

const images = () => {
  return src("src/images/**/*.*").pipe(dest("dist/images"));
};

const documents = () => {
  return src("src/documents/**/*.*").pipe(dest("dist/documents"));
};

const rootFiles = () => {
  return src(["src/*.*", "src/.htaccess"]).pipe(dest("dist/"));
};

const imagesMinify = () => {
  return src("src/images/**/*.*")
    .pipe(
      image({
        zopflipng: false,
        svgo: false
      })
    )
    .pipe(dest("dist/images"));
};

const fontsTask = () => {
  return src("src/fonts/**/*.*").pipe(dest("dist/fonts"));
};

const swTask = () => {
  return src("src/service-worker.js").pipe(dest("dist"));
};

const manifestTask = () => {
  return src("src/manifest.webmanifest").pipe(dest("dist"));
};

const filesTask = () => {
  return src("src/files/**/*.*").pipe(dest("dist/files"));
};

const video = () => {
  return src("src/video/**/*.mp4").pipe(dest("dist/video"));
};

const criticalCSS = () => {
  return src("dist/*.html")
    .pipe(
      critical({
        base: "dist/",
        inline: true,
        css: ["dist/css/*.css"]
      })
    )
    .pipe(dest("dist"));
};

const localhost = () => {
  browserSync.init({
    server: {
      baseDir: "dist/"
    },
    port: 3000
  });
};

const watchTask = () => {
  localhost();

  watch(
    ["src/**/*"],
    series(htmlTask, scssTask, jsTask, fontsTask, images, documents)
  );
};

// gulp serve - run development with localhost server
exports.serve = series(
  parallel(
    htmlTask,
    scssTask,
    jsTask,
    fontsTask,
    filesTask,
    video,
    images,
    documents,
    respImages,
    convertWebp,
    swTask,
    manifestTask
  ),
  watchTask
);

// gulp build - run production build with critical css & image optymize
exports.build = series(
  parallel(
    htmlTask,
    scssTask,
    jsTask,
    fontsTask,
    rootFiles,
    filesTask,
    video,
    images,
    documents,
    respImages,
    imagesMinify,
    convertWebp,
    swTask,
    manifestTask
  ),
  criticalCSS
);
