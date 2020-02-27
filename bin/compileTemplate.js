"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var minify_css_string_1 = require("minify-css-string");
var resolvePath = function (filePath) {
    var filePathItems = filePath.split(/[\\/]/);
    var fileName = filePathItems.pop();
    var pathName = filePathItems.join('/');
    return [pathName, fileName];
};
var readFile = function (filePath, callback) {
    var _a = resolvePath(filePath), pathName = _a[0], fileName = _a[1];
    return new Promise(function (resolve) {
        fs.readFile(path.resolve(__dirname, pathName) + "/" + fileName, 'utf8', function (err, contents) {
            if (err) {
                console.log('Ошибка!: ', err);
                return;
            }
            ;
            if (callback) {
                resolve(callback(contents));
            }
            else {
                resolve(contents);
            }
        });
    });
};
var writeFile = function (filePath, content) {
    var _a = resolvePath(filePath), pathName = _a[0], fileName = _a[1];
    fs.writeFile(path.resolve(__dirname, pathName) + "/" + fileName, content, function (err) {
        if (err) {
            console.log('#34', { err: err });
        }
        ;
    });
};
// Чтение json
var readJson = function () {
    return readFile('../src/build/sampleData.json', function (contents) { return JSON.stringify(JSON.parse(contents)); });
};
var readCss = function () {
    return readFile('../dist/css/scene.css', function (contents) { return minify_css_string_1["default"](contents); });
};
var readBundleJs = function () {
    return readFile('../dist/js/bundle.js', function (contents) { return minify_css_string_1["default"](contents); });
};
var readIndex = function () {
    return readFile('../src/build/indexTemplate.html');
};
var promiseReads = [readJson(), readCss(), readBundleJs(), readIndex()];
Promise.all(promiseReads).then(function (_a) {
    var jsonText = _a[0], cssText = _a[1], bundleJsText = _a[2], indexText = _a[3];
    var indexHtmlText = indexText.replace('{jsonAnchor}', jsonText);
    writeFile('../index.html', indexHtmlText);
    var indexHtmlTextFor1C = indexText
        .replace(/<link id="cssLink".+?\/>/, "<style>" + cssText + "</style>")
        .replace(/<script id="jsScript".+?<\/script>/, "<script>" + bundleJsText + "</script>");
    writeFile('../index1C.html', indexHtmlTextFor1C);
    writeFile('../index1CForDebug.html', indexHtmlTextFor1C.replace('{jsonAnchor}', jsonText));
});
