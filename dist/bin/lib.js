"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("../app");
var __1 = require("..");
/**
 * This program represents the command line interface for the tsmix-linter library
 * ---------------------------------------------------------------------------------------
 * This library can either be used by
 * 1). node.js tsmix-linter/bin "somefile.ts"
 * 2). node.js tsmix-linter/bin --root "c:/Users/some/path/to/the/root"
 */
var version = "Version 1.0.11";
var DefaultFlags;
(function (DefaultFlags) {
    DefaultFlags["Help"] = "--help";
    DefaultFlags["Version"] = "--version";
    DefaultFlags["Watch"] = "--watch";
    DefaultFlags["Log"] = "--log";
})(DefaultFlags || (DefaultFlags = {}));
var OptionalFlags;
(function (OptionalFlags) {
    OptionalFlags["Help"] = "-h";
    OptionalFlags["Version"] = "-v";
    OptionalFlags["Watch"] = "-w";
    OptionalFlags["Log"] = "-l";
})(OptionalFlags || (OptionalFlags = {}));
function runCLI(args) {
    var parsed = parseArguments(args);
    if (parsed instanceof Logger) {
        console.log(parsed.message);
        return;
    }
    // If we're compiling a file.
    if (parsed.lintOptions.target === "file" && parsed.lintOptions.method === "compile") {
        app_1.App
            .compileFile(parsed.path)
            .then(function (diagnostics) { return diagnostics.map(parsed.lintOptions.logger); });
        return;
    }
    // If we are watching a file.
    if (parsed.lintOptions.target === "file" && parsed.lintOptions.method === "watch") {
        app_1.App.watchFile(parsed.path, function (builderProgram) {
            if (app_1.App.rootFiles) {
                __1.validateAll(builderProgram.getProgram(), app_1.App.rootFiles)
                    .then(function (diagnostics) { return diagnostics.map(parsed.lintOptions.logger); });
                return;
            }
            return helperLog("Nothing to lint.\nCouldn't find .ts files in the specified folder.");
        });
        return;
    }
    // If we are compiling all files in a folder.
    if (parsed.lintOptions.target === "folder" && parsed.lintOptions.method === "compile") {
        app_1.App
            .compileFilesInFolder(parsed.path)
            .then(function (diagnostics) { return diagnostics.map(parsed.lintOptions.logger); });
        return;
    }
    // If we are watching all files in a folder.
    if (parsed.lintOptions.target === "folder" && parsed.lintOptions.method === "watch") {
        app_1.App.watchFilesInFolder(parsed.path, function (builderProgram) {
            if (app_1.App.rootFiles) {
                __1.validateAll(builderProgram.getProgram(), app_1.App.rootFiles)
                    .then(function (diagnostics) { return diagnostics.map(parsed.lintOptions.logger); });
                return;
            }
            return helperLog("Nothing to lint.\nCouldn't find .ts files in the specified folder.");
        });
        return;
    }
    return helperLog().message;
}
exports.runCLI = runCLI;
function parseArguments(args) {
    var itHasHelpFlag = argumentHasFlag(args, DefaultFlags.Help, OptionalFlags.Help);
    if (itHasHelpFlag) {
        removeFlagFromArgument(args, itHasHelpFlag.index);
        return helperLog();
    }
    var itHasVersionFlag = argumentHasFlag(args, DefaultFlags.Version, OptionalFlags.Version);
    if (itHasVersionFlag) {
        removeFlagFromArgument(args, itHasVersionFlag.index);
        return new Logger(version);
    }
    var itHasWatchFlag = argumentHasFlag(args, DefaultFlags.Watch, OptionalFlags.Watch);
    if (itHasWatchFlag) {
        removeFlagFromArgument(args, itHasWatchFlag.index);
    }
    var itHasLogFlag = argumentHasFlag(args, DefaultFlags.Log, OptionalFlags.Log);
    var logger = normalLogger;
    if (itHasLogFlag) {
        var _logValue = args[itHasLogFlag.index + 1];
        removeFlagFromArgument(args, itHasLogFlag.index);
        if (_logValue === undefined) {
            _logValue = "normal";
        }
        else
            args.splice(itHasLogFlag.index + 1, 1);
        logger = validateLog(_logValue);
    }
    // This means we are linting a file.
    var remainingArgument = args[0];
    var method = itHasWatchFlag ? "watch" : "compile";
    if (remainingArgument && remainingArgument !== ".")
        return new Lintable(remainingArgument, { method: method, target: "file", logger: logger });
    else
        return new Lintable(process.cwd(), { method: method, target: "folder", logger: logger });
    //--------------------------------------------------------------------------------
}
function validateLog(log) {
    switch (log) {
        case "diagnostic": return diagnosticLogger;
        case "minimal": return minimalLogger;
        default: return normalLogger;
    }
}
function argumentHasFlag(argument, defaultFlag, optionalFlag) {
    var firstIndex = argument.indexOf(defaultFlag);
    var secondIndex = argument.indexOf(optionalFlag);
    if (firstIndex > -1)
        return { foundFlag: defaultFlag, index: firstIndex };
    else if (secondIndex > -1)
        return { foundFlag: optionalFlag, index: secondIndex };
    else
        return undefined;
}
function removeFlagFromArgument(argument, flagLocationIndex) {
    argument.splice(flagLocationIndex, 1);
}
function logMatcher(diagnostic, log) {
    switch (log) {
        case "diagnostic":
            diagnosticLogger(diagnostic);
            break;
        case "normal":
            normalLogger(diagnostic);
            break;
        case "minimal":
            minimalLogger(diagnostic);
            break;
    }
}
function normalLogger(diagnostic) {
    console.log("\n");
    console.warn("error:(" + (diagnostic.range.start.line + 1) + "," + diagnostic.range.start.character + ")", diagnostic.message.replace("\n", ""), "on", diagnostic.filePath);
}
function diagnosticLogger(diagnostic) {
    console.log("\n");
    console.warn(diagnostic);
}
function minimalLogger(diagnostic) {
    var rel = diagnostic.filePath.replace(process.cwd().replace("\\", "/"), "");
    console.log("\n");
    console.warn("error: (" + (diagnostic.range.start.line + 1) + "," + diagnostic.range.start.character + "). " + diagnostic.message.split("\n")[0] + " on " + rel);
}
function helperLog(additionalInfo) {
    if (additionalInfo === void 0) { additionalInfo = ""; }
    if (additionalInfo) {
        additionalInfo = additionalInfo + "\n" + "------------------------------";
    }
    return new Logger(additionalInfo + defaultMessage);
}
var Logger = /** @class */ (function () {
    function Logger(message) {
        this.message = message;
    }
    return Logger;
}());
var Lintable = /** @class */ (function () {
    function Lintable(path, lintOptions) {
        this.path = path;
        this.lintOptions = lintOptions;
    }
    return Lintable;
}());
var defaultMessage = "Version: " + version + "\n\nExample: \n  tsmix-linter \"hello.ts\" (to lint a file)\n  tsmix-linter \".\" (to lint all .ts files in the current directory)\n           \nOptions:\n  --help, -h       To print this message.\n  --version, -v    Prints out the version number\n  --watch, -w      Specify if linting is done in watch mode.\n  --log, -l        Specify how errors are logged. Either \"minimal\", \"normal\" or \"diagnostic\". \n                   defaults to \"normal\"";
//# sourceMappingURL=lib.js.map