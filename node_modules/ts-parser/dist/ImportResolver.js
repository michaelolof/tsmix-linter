"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var utilities_1 = require("./utilities");
var ImportResolver = (function () {
    function ImportResolver(currentPath) {
        currentPath = utilities_1.cleanUpFilePath(currentPath);
        this.originalPath = path.resolve(currentPath);
        this.originalPathArr = this.originalPath.split(path.sep);
        this.currentPathArr = this.originalPathArr.slice();
        this.currentPathArr.pop();
        this.currentPath = this.currentPathArr.join(path.sep);
    }
    ImportResolver.prototype.resolve = function (importPath, extension) {
        if (extension === void 0) { extension = "ts"; }
        var importPathArr = importPath.split(ImportResolver.IMPORT_PART_SEPERATOR);
        var length = importPathArr.length;
        for (var i = 0; i < length; i++) {
            var level = importPathArr[i];
            if (level === ".") {
            }
            else if (level === "..") {
                this.moveUpDirectory();
            }
            else {
                var remainingArr = importPathArr.slice(i, length);
                var remaining = remainingArr.join(path.sep);
                return this.mergeCurrentDirectoryWithModule(remaining, extension);
            }
        }
        throw new EvalError("module name cannot be resolved.");
    };
    ImportResolver.prototype.moveUpDirectory = function () {
        this.currentPathArr.pop();
        this.currentPath = this.currentPathArr.join(path.sep);
    };
    ImportResolver.prototype.mergeCurrentDirectoryWithModule = function (remaining, extension) {
        return this.currentPath + path.sep + remaining + "." + extension;
    };
    ImportResolver.IMPORT_PART_SEPERATOR = "/";
    return ImportResolver;
}());
exports.ImportResolver = ImportResolver;
//# sourceMappingURL=ImportResolver.js.map