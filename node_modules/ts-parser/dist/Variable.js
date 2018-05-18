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
var utilities_1 = require("./utilities");
var Member_1 = require("./Member");
var typescript_1 = require("typescript");
var Checker_1 = require("./Checker");
var Variable = (function () {
    function Variable(variable, filePath) {
        this.element = variable;
        this.filePath = filePath;
    }
    Object.defineProperty(Variable.prototype, "name", {
        get: function () {
            return this.element.name["escapedText"];
        },
        enumerable: true,
        configurable: true
    });
    Variable.prototype.isOf = function (type) {
        return this instanceof type;
    };
    Variable.prototype.getNameRange = function (source) {
        return utilities_1.getInlineRangeFromPosition(this.element.name, source);
    };
    Variable.prototype.getMembers = function () {
        if (this.__members)
            return this.__members;
        var memberElements = this.element.initializer["properties"];
        this.__members = [];
        for (var _i = 0, memberElements_1 = memberElements; _i < memberElements_1.length; _i++) {
            var memberElement = memberElements_1[_i];
            var member = new Member_1.VariableMember(memberElement, this.filePath);
            this.__members.push(member);
        }
        return this.__members;
    };
    Variable.prototype.getMember = function (name) {
        var members = this.__members;
        if (members === undefined)
            members = this.getMembers();
        for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
            var member = members_1[_i];
            if (member.name === name)
                return member;
        }
        return undefined;
    };
    Variable.prototype.getMethods = function () {
        var members = this.getMembers();
        return Member_1.Method.getMethods(members);
    };
    Variable.prototype.getMembersSymbol = function () {
        if (this.element.initializer["symbol"] === undefined)
            return undefined;
        return this.element.initializer["symbol"].members;
    };
    Variable.prototype.toSymbolizedHolder = function (type, checker) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = Checker_1.SymbolizedHolder.bind;
                        _b = [void 0, this.name,
                            this.getNameRange(),
                            this.filePath,
                            type];
                        return [4, this.getMembersSymbolizedMemberArray(checker)];
                    case 1: return [2, new (_a.apply(Checker_1.SymbolizedHolder, _b.concat([(_c.sent()).array])))()];
                }
            });
        });
    };
    Variable.prototype.getMembersSymbolizedMemberArray = function (checker) {
        return __awaiter(this, void 0, void 0, function () {
            var members, rtn, _i, members_2, member, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        members = this.getMembers();
                        rtn = new Checker_1.SymbolizedMemberArray();
                        _i = 0, members_2 = members;
                        _c.label = 1;
                    case 1:
                        if (!(_i < members_2.length)) return [3, 4];
                        member = members_2[_i];
                        _b = (_a = rtn).push;
                        return [4, member.getSymbolizedMember(checker, this.element)];
                    case 2:
                        _b.apply(_a, [_c.sent()]);
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3, 1];
                    case 4: return [2, rtn];
                }
            });
        });
    };
    Variable.IsAVariable = function (node) {
        var otherTruths = node["initializer"] && node["type"] && node["initializer"].kind === typescript_1.SyntaxKind.ObjectLiteralExpression;
        if (otherTruths) {
            return typescript_1.isVariableDeclaration(node);
        }
        else
            return false;
    };
    Variable.Find = function (source) {
        return utilities_1.find(source, function (node) {
            if (Variable.IsAVariable(node))
                return new Variable(node, source.fileName);
            else
                return undefined;
        });
    };
    return Variable;
}());
exports.Variable = Variable;
//# sourceMappingURL=Variable.js.map