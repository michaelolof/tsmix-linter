"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var __1 = require("..");
var utilities_1 = require("../utilities");
/**
 * This program represents the command line interface for the tsmix-linter library
 * ---------------------------------------------------------------------------------------
 * This library can either be used by
 * 1). node.js tsmix-linter/bin "somefile.ts"
 * 2). node.js tsmix-linter/bin --root "c:/Users/some/path/to/the/root"
 */
parseArguments(process.argv);
function helperLog(additionalInfo) {
    if (additionalInfo === void 0) { additionalInfo = ""; }
    return additionalInfo + "Unkown Format: You can lint a file or a set of files by;\n" +
        "---------------------------------------------------------------------\n" +
        "tsmix-linter/bin 'somefile.ts'\n" +
        "or\n" +
        "tsmix-linter/bin --path 'Users/JohnDoe/location/to/root/path'";
}
function parseArguments(args) {
    var arg2 = args[2];
    if (arg2 === undefined) {
        return helperLog();
    }
    if (arg2 === "--path") {
        var rootPath = args[3];
        if (rootPath === undefined)
            return helperLog("Undefined root path");
        else
            return tryAndLintFileByRootPath(rootPath);
    }
    else if (arg2.startsWith("--") || arg2.startsWith("-")) {
        return helperLog();
    }
    else {
        return tryAndLintFileName(arg2);
    }
}
function tryAndLintFileName(fileName) {
    fileName = utilities_1.normalizePath(fileName);
    app_1.App
        .launchCompiler(fileName)
        .then(console.log);
}
function tryAndLintFileByRootPath(rootPath) {
    app_1.App.launchWatcher(rootPath, function (program) {
        if (app_1.App.rootFiles) {
            __1.validateAll(program.getProgram(), app_1.App.rootFiles).then(console.log);
        }
    });
}
//# sourceMappingURL=index.js.map