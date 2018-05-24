"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = require("typescript");
function getInlineRangeFromPosition(namedElement, source, name) {
    if (source === void 0) { source = namedElement.getSourceFile(); }
    if (name === void 0) { name = namedElement.escapedText; }
    var endPosition = source.getLineAndCharacterOfPosition(namedElement.end);
    var startPosition = { line: endPosition.line, character: endPosition.character - name.length };
    return {
        start: startPosition,
        end: endPosition,
    };
}
exports.getInlineRangeFromPosition = getInlineRangeFromPosition;
function createErrorDiagnostic(source, filePath, range, message, code) {
    return {
        range: range,
        filePath: filePath,
        message: message,
        code: code,
        severity: typescript_1.DiagnosticCategory.Error,
        source: source,
    };
}
exports.createErrorDiagnostic = createErrorDiagnostic;
function cleanUpFilePath(filePath) {
    if (filePath.startsWith("file:///"))
        filePath = filePath.substr(8);
    filePath = filePath.replace("%3A", ":");
    return filePath;
}
exports.cleanUpFilePath = cleanUpFilePath;
function find(source, condition, deepFind) {
    if (deepFind === void 0) { deepFind = true; }
    function find(onFound) {
        function iterator(sourceFile) {
            sourceFile.forEachChild(function (childNode) {
                var con = condition(childNode);
                if (con)
                    onFound(con);
                if (deepFind)
                    iterator(childNode);
            });
        }
        iterator(source);
    }
    var allPromises = [];
    find(function (t) {
        var promise = new Promise(function (resolve, reject) {
            if (t) {
                resolve(t);
            }
            else {
                reject("There was an issue. Sort it out.");
            }
        });
        allPromises.push(promise);
    });
    return Promise.all(allPromises);
}
exports.find = find;
function findWhere(source, condition) {
    return __awaiter(this, void 0, void 0, function () {
        var found;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    found = undefined;
                    return [4, find(source, function (node) {
                            var _found = condition(node);
                            if (_found) {
                                found = _found;
                                return found;
                            }
                            else {
                                return undefined;
                            }
                        })];
                case 1:
                    _a.sent();
                    return [2, found];
            }
        });
    });
}
exports.findWhere = findWhere;
function extractImportsFromSource(source) {
    var imports = source["imports"];
    return imports.map(function (imp) { return imp.parent; });
}
exports.extractImportsFromSource = extractImportsFromSource;
function getImportFromSourceByModuleName(moduleName, source) {
    var importTokens = source["imports"];
    for (var _i = 0, importTokens_1 = importTokens; _i < importTokens_1.length; _i++) {
        var token = importTokens_1[_i];
        var path = token["text"];
        if (path.endsWith(moduleName))
            return token.parent;
    }
    return undefined;
}
exports.getImportFromSourceByModuleName = getImportFromSourceByModuleName;
