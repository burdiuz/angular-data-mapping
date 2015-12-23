var gulp = require('gulp'),
  rev = require('gulp-rev'),
  fs = require('fs');

const DEST_BASE_DIR = "dist/";
const SRC_BASE_DIR = "src/";
const MODULE_TEMPLATE_PATH = "src/service.template.js";
const MODULE_DESTINATION_PATH = "dist/datamapping.js";
const MODULE_MINIMIZED_PATH = "dist/datamapping.min.js";
const TEST_PATH = "tests/";

(function() {
  "use strict";
  function readFile(path) {
    var content = fs.readFileSync(path);
    return content.toString();
  }

  gulp.task('build', [], function() {
    var strip = require("strip-comments"),
      glob = require("glob");
    var template = readFile(MODULE_TEMPLATE_PATH);
    var rgx = /\/\*--((-|[\w\.\d])+)-\*\//ig,
      match = null,
      marks = {}, mark, path, list, length, data;
    while ((match = rgx.exec(template))) {
      marks[match[1]] = true;
    }
    for (mark in marks) {
      if (!marks.hasOwnProperty(mark)) continue;
      path = SRC_BASE_DIR + mark.replace('-', '/');
      list = glob.sync(path + '{/*.js,.js}');
      console.log('Mark:', mark, ':', list);
      length = list.length;
      if (length) {
        data = "";
        for (var index = 0; index < length; index++) {
          data += "\r\n" + readFile(list[index]);
        }
        template = template.replace('/*--' + mark + '-*/', data);
      }
    }
    fs.writeFileSync(MODULE_DESTINATION_PATH, strip(template).replace(/([\r\n]+)\s*\1/ig, "\r\n"));

  });
})();
gulp.task('minimize', ['build'], function() {
  var uglify = require('gulp-uglify'),
    rename = require("gulp-rename");
  gulp.src(MODULE_DESTINATION_PATH)
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest(DEST_BASE_DIR));
});
var tinylr;
gulp.task('livereload', function() {
  tinylr = require('tiny-lr')();
  tinylr.listen(3029);
});

function notifyLiveReload(event) {
  var fileName = require('path').relative(__dirname, event.path);
  console.log('File changed:', fileName);
  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}
// watch and then build
gulp.task('watch', ['build'], function() {
  gulp.watch(SRC_BASE_DIR + '**/*.js', ['build']);
  gulp.watch(MODULE_DESTINATION_PATH, notifyLiveReload);
});
gulp.task('express', [], function() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')({port: 3029}));
  app.use(express.static(__dirname));
  app.listen(3030);
});
gulp.task('default', ['express', 'livereload', 'watch'], function() {
  var open = require("gulp-open");
  gulp.src("index.html")
    .pipe(open("", {
      url: "http://localhost:3030",
      app: "chrome"
    }));
  console.log('open browser');
});
