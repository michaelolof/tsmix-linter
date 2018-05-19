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
parseArguments(process.argv.slice(2));
var lintMethod;
var options = {
    "--root": undefined,
    "--log": "minimal",
};
function parseArguments(args) {
    var rootLoc = args.indexOf("--root");
    var logLoc = args.indexOf("--log");
    var filePath = args[0];
    var rootValue = undefined;
    var logValue = "minimal";
    if (rootLoc > -1)
        rootValue = args[rootLoc + 1];
    if (logLoc > -1)
        logValue = validateLog(args[logLoc + 1]);
    if (rootValue === undefined && filePath) {
        return lintFile(filePath, logValue);
    }
    if (rootValue) {
        return lintFileByRootPath(rootValue, logValue);
    }
    console.log(helperLog());
    return;
    // if( rootValue )
    function validateLog(log) {
        if (log === "diagnostic" || log === "normal" || log === "minimal")
            return log;
        else
            return "minimal";
    }
}
// function parseArguments(args:string[]) {
//   const arg2 = args[2];
//   if( arg2 === undefined ) {
//     return helperLog();
//   }
//   if( arg2 === "--path" ) { 
//     const rootPath = args[3];
//     if( rootPath === undefined ) return helperLog("Undefined root path");
//     else return tryAndLintFileByRootPath( rootPath );
//   } 
//   else if( arg2.startsWith("--") || arg2.startsWith("-") ) {
//     return helperLog();
//   } 
//   else {
//     return lintFile( arg2 );
//   }
// }
function helperLog(additionalInfo) {
    if (additionalInfo === void 0) { additionalInfo = ""; }
    return additionalInfo + "Unkown Format: You can lint a file or a set of files by;\n" +
        "---------------------------------------------------------------------\n" +
        "tsmix-linter/bin 'somefile.ts'\n" +
        "or\n" +
        "tsmix-linter/bin --path 'Users/JohnDoe/location/to/root/path'";
}
function lintFile(fileName, log) {
    fileName = utilities_1.normalizePath(fileName);
    app_1.App
        .launchCompiler(fileName)
        .then(function (diagnostics) { return diagnostics.map(function (diagnostic) { return logMatcher(diagnostic, log); }); });
}
function lintFileByRootPath(rootPath, log) {
    app_1.App.launchWatcher(rootPath, function (program) {
        if (app_1.App.rootFiles) {
            __1.validateAll(program.getProgram(), app_1.App.rootFiles)
                .then(function (diagnostics) { return diagnostics.map(function (diagnostic) { return logMatcher(diagnostic, log); }); });
        }
    });
}
function logMatcher(diagnostic, log) {
    switch (log) {
        case "diagnostic":
            diagnosticLogger(diagnostic);
            break;
        case "normal":
            console.log("normal logger");
            normalLogger(diagnostic);
            break;
        case "minimal":
            minimalLogger(diagnostic);
            break;
    }
}
function normalLogger(diagnostic) {
    console.warn("error:(" + diagnostic.range.start.line + "," + diagnostic.range.start.character + ")", diagnostic.message.replace("\n", ""), "on", diagnostic.filePath);
    console.log("\n");
}
function diagnosticLogger(diagnostic) {
    console.warn(diagnostic);
    console.log("\n");
}
function minimalLogger(diagnostic) {
    var rel = diagnostic.filePath.replace(process.cwd().replace("\\", "/"), "");
    console.warn("error: (" + diagnostic.range.start.line + "," + diagnostic.range.start.character + "). " + diagnostic.message.split("\n")[0] + " on " + rel);
    console.log("\n");
}
//# sourceMappingURL=index.js.map