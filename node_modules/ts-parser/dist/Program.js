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
var Checker_1 = require("./Checker");
var Mixin_1 = require("./Mixin");
var Program = (function () {
    function Program(program, rootFiles) {
        this.rootFiles = rootFiles;
        this.program = program;
        this.checker = program.getTypeChecker();
    }
    Program.prototype.getTypes = function (transform) {
        return __awaiter(this, void 0, void 0, function () {
            var rootFiles, holders, _i, rootFiles_1, file, source, allClassesOrVariables, lintables, _a, allClassesOrVariables_1, classOrVariable, found, symbolizedMembers, members, _b, members_1, member, signature, type, methodThisCalls, methodsNoOfArguments, accessor;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        rootFiles = this.rootFiles;
                        if (rootFiles === undefined)
                            rootFiles = this.program.getRootFileNames();
                        holders = new Checker_1.SymbolizedHolderArray();
                        _i = 0, rootFiles_1 = rootFiles;
                        _c.label = 1;
                    case 1:
                        if (!(_i < rootFiles_1.length)) return [3, 11];
                        file = rootFiles_1[_i];
                        source = this.program.getSourceFile(file);
                        if (source === undefined) {
                            console.error("source not found");
                            return [3, 10];
                        }
                        return [4, Mixin_1.Mixin.Find(source)];
                    case 2:
                        allClassesOrVariables = _c.sent();
                        if (allClassesOrVariables === undefined) {
                            console.error("Strange No classes or variable found in file:" + file);
                            return [3, 10];
                        }
                        lintables = transform[file];
                        _a = 0, allClassesOrVariables_1 = allClassesOrVariables;
                        _c.label = 3;
                    case 3:
                        if (!(_a < allClassesOrVariables_1.length)) return [3, 10];
                        classOrVariable = allClassesOrVariables_1[_a];
                        found = lintables.findByName(classOrVariable.name);
                        if (found === undefined)
                            return [3, 9];
                        symbolizedMembers = [];
                        members = classOrVariable.getMembers();
                        _b = 0, members_1 = members;
                        _c.label = 4;
                    case 4:
                        if (!(_b < members_1.length)) return [3, 8];
                        member = members_1[_b];
                        signature = member.getSymbolSignature(this.checker, classOrVariable.element);
                        type = "property";
                        methodThisCalls = undefined;
                        methodsNoOfArguments = undefined;
                        if (!member.isAMethod()) return [3, 6];
                        type = "method";
                        return [4, member.getMethodBodyThisCalls()];
                    case 5:
                        methodThisCalls = _c.sent();
                        methodsNoOfArguments = member.getMethodNumberOfArguments();
                        _c.label = 6;
                    case 6:
                        accessor = member.getAccessor();
                        symbolizedMembers.push({
                            memberName: member.name,
                            memberRange: member.getNameRange(),
                            signature: signature,
                            type: type,
                            accessor: accessor,
                            methodThisCalls: methodThisCalls,
                            methodsNoOfArguments: methodsNoOfArguments
                        });
                        _c.label = 7;
                    case 7:
                        _b++;
                        return [3, 4];
                    case 8:
                        holders.push(new Checker_1.SymbolizedHolder(classOrVariable.name, classOrVariable.getNameRange(), file, found.type, symbolizedMembers, found.mixins));
                        _c.label = 9;
                    case 9:
                        _a++;
                        return [3, 3];
                    case 10:
                        _i++;
                        return [3, 1];
                    case 11: return [2, holders];
                }
            });
        });
    };
    return Program;
}());
exports.Program = Program;
var LintableArray = (function () {
    function LintableArray() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        this.hash = {};
        if (values === undefined)
            return;
        for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
            var val = values_1[_a];
            this.hash[JSON.stringify(val)] = val;
        }
    }
    LintableArray.prototype.push = function (value) {
        this.hash[JSON.stringify(value)] = value;
    };
    LintableArray.prototype.getTypeByName = function (name) {
        var lintable = this.findByName(name);
        if (lintable)
            return lintable.type;
        else
            return undefined;
    };
    LintableArray.prototype.findByName = function (name) {
        for (var hashVal in this.hash) {
            var lintable = this.hash[hashVal];
            if (lintable.name === name)
                return lintable;
        }
        return undefined;
    };
    LintableArray.prototype.hasName = function (name) {
        if (this.findByName(name))
            return true;
        else
            return false;
    };
    LintableArray.prototype[Symbol.iterator] = function () {
        var _a, _b, _i, hashVals, val;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [];
                    for (_b in this.hash)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    hashVals = _a[_i];
                    val = this.hash[hashVals];
                    return [4, val];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    };
    return LintableArray;
}());
exports.LintableArray = LintableArray;
//# sourceMappingURL=Program.js.map