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
var ImportResolver_1 = require("./ImportResolver");
var utilities_1 = require("./utilities");
var Import = (function () {
    function Import(importDeclaration, filePath) {
        this.filePath = filePath;
        this.importDeclaration = importDeclaration;
        if (this.importDeclaration.moduleSpecifier === undefined)
            console.log(importDeclaration.kind);
        this.moduleDeclaration = this.importDeclaration.moduleSpecifier["text"];
        var moduleNameArr = this.moduleDeclaration.split("/");
        this.moduleName = moduleNameArr[moduleNameArr.length - 1];
    }
    Object.defineProperty(Import.prototype, "format", {
        get: function () {
            if (this.__format === undefined) {
                this.getImportedObjects();
                return this.__format;
            }
            return this.__format;
        },
        enumerable: true,
        configurable: true
    });
    Import.prototype.getImportedObjects = function () {
        var namedBindings = this.importDeclaration.importClause.namedBindings;
        if (namedBindings === undefined) {
            var namedBindingsElements = [this.importDeclaration.importClause];
            this.__format = ImportFormat.Default;
        }
        else if (namedBindings["elements"]) {
            namedBindingsElements = namedBindings["elements"];
            this.__format = ImportFormat.Object;
        }
        else if (namedBindings["name"]) {
            namedBindingsElements = [namedBindings];
            this.__format = ImportFormat.Namespaced;
        }
        else {
            throw new RangeError("Import format is not recognized.");
        }
        var importMembers = [];
        for (var _i = 0, namedBindingsElements_1 = namedBindingsElements; _i < namedBindingsElements_1.length; _i++) {
            var namedBindingsElement = namedBindingsElements_1[_i];
            var propertyName = namedBindingsElement["propertyName"];
            var name_1 = namedBindingsElement["name"];
            var memberName = void 0, memberAlias = void 0;
            if (this.__format === ImportFormat.Namespaced) {
                memberName = undefined;
                memberAlias = name_1.escapedText;
            }
            else if (propertyName && name_1) {
                memberName = propertyName.escapedText;
                memberAlias = name_1.escapedText;
            }
            else if (name_1) {
                memberName = name_1.escapedText;
                memberAlias = undefined;
            }
            var importMember = new ImportedObject(this, memberName, memberAlias);
            importMembers.push(importMember);
        }
        return importMembers;
    };
    Import.prototype.resolvePath = function (extension) {
        return new ImportResolver_1.ImportResolver(this.filePath).resolve(this.moduleDeclaration, extension);
    };
    Import.IsAImport = function (node) {
        return node.kind === typescript_1.SyntaxKind.ImportDeclaration;
    };
    Import.FindModule = function (name, imports) {
        for (var _i = 0, imports_1 = imports; _i < imports_1.length; _i++) {
            var imp = imports_1[_i];
            if (imp.moduleName === name)
                return imp;
        }
        return undefined;
    };
    Import.Find = function (source) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, utilities_1.find(source, function (node) {
                        if (Import.IsAImport(node)) {
                            return new Import(node, source.fileName);
                        }
                        else
                            return undefined;
                    })];
            });
        });
    };
    Import.FindObject = function (name, imports) {
        for (var _i = 0, imports_2 = imports; _i < imports_2.length; _i++) {
            var imp = imports_2[_i];
            var members = imp.getImportedObjects();
            for (var _a = 0, members_1 = members; _a < members_1.length; _a++) {
                var member = members_1[_a];
                if (member.alias) {
                    if (member.alias === name) {
                        return member;
                    }
                }
                else {
                    if (member.name === name) {
                        return member;
                    }
                }
            }
        }
        return undefined;
    };
    Import.FindImportByModuleName = function (name, imports) {
        for (var _i = 0, imports_3 = imports; _i < imports_3.length; _i++) {
            var imp = imports_3[_i];
            if (imp.moduleName.endsWith(name))
                return imp;
        }
        return undefined;
    };
    Import.ExtractImportFromSource = function (source) {
        var imps = [];
        var imports = source["imports"];
        for (var _i = 0, imports_4 = imports; _i < imports_4.length; _i++) {
            var imp = imports_4[_i];
            if (imp.parent && typescript_1.isImportDeclaration(imp.parent)) {
                imps.push(new Import(imp.parent, source.fileName));
            }
        }
        return imps;
    };
    return Import;
}());
exports.Import = Import;
var ImportFormat;
(function (ImportFormat) {
    ImportFormat[ImportFormat["Default"] = 0] = "Default";
    ImportFormat[ImportFormat["Object"] = 1] = "Object";
    ImportFormat[ImportFormat["Namespaced"] = 2] = "Namespaced";
})(ImportFormat = exports.ImportFormat || (exports.ImportFormat = {}));
var ImportedObject = (function () {
    function ImportedObject(parentImport, name, alias) {
        this.name = name;
        this.alias = alias;
        this.toLocation = parentImport.filePath;
        this.fromLocation = parentImport.resolvePath("ts");
    }
    ImportedObject.prototype.getAlias = function () {
        if (this.alias)
            return this.alias;
        else if (this.name)
            return this.name;
        else
            return new Error("both this.alias and this.name are undefined. This function cannot work unless at least one of them is defined.");
    };
    return ImportedObject;
}());
exports.ImportedObject = ImportedObject;
//# sourceMappingURL=Import.js.map