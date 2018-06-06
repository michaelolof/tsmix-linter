"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Decorator_1 = require("./Decorator");
var Statement_1 = require("./Statement");
var utilities_1 = require("./utilities");
var Checker_1 = require("./Checker");
var Class_1 = require("./Class");
var Member = (function () {
    function Member(memberElement, filePath) {
        this.element = memberElement;
        this.filePath = filePath;
    }
    Object.defineProperty(Member.prototype, "name", {
        get: function () {
            if (this.element.kind === typescript_1.SyntaxKind.Constructor)
                return "constructor";
            else
                return this.element["name"].escapedText;
        },
        enumerable: true,
        configurable: true
    });
    Member.prototype.getType = function () {
        switch (this.element.kind) {
            case typescript_1.SyntaxKind.PropertyDeclaration:
                return "property";
            case typescript_1.SyntaxKind.MethodDeclaration:
                return "method";
            case typescript_1.SyntaxKind.GetAccessor:
                return "getter";
            case typescript_1.SyntaxKind.SetAccessor:
                return "setter";
            default: return "property";
        }
    };
    Member.prototype.isAMethod = function () {
        return Method.isAMethod(this.element);
    };
    Member.prototype.getSymbolSignature = function (checker, node) {
        if (node === undefined)
            node = this.element;
        var symbol = this.element["symbol"];
        return checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, node));
    };
    Member.prototype.getSymbolizedMember = function (checker, node) {
        return __awaiter(this, void 0, void 0, function () {
            var type, methodThisCall, noOfArguments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = this.getType();
                        methodThisCall = undefined;
                        if (!(type === "method")) return [3, 2];
                        return [4, this.getMethodBodyThisCalls()];
                    case 1:
                        methodThisCall = _a.sent();
                        noOfArguments = this.getMethodNumberOfArguments();
                        _a.label = 2;
                    case 2: return [2, new Checker_1.SymbolizedMember(type, this.name, this.getNameRange(), this.getSymbolSignature(checker, node), this.getAccessor(), methodThisCall, noOfArguments)];
                }
            });
        });
    };
    Member.prototype.getAccessor = function () {
        if (this.element.modifiers) {
            for (var _i = 0, _a = this.element.modifiers; _i < _a.length; _i++) {
                var modifier = _a[_i];
                if (modifier.kind == typescript_1.SyntaxKind.StaticKeyword)
                    return "static";
            }
        }
        ;
        return "instance";
    };
    Member.prototype.getNameRange = function () {
        if (this.element.kind === typescript_1.SyntaxKind.Constructor)
            return {};
        return utilities_1.getInlineRangeFromPosition(this.element["name"]);
    };
    Member.prototype.getMethodBodyThisCalls = function () {
        var methodBody = this.element["body"].getFullText();
        var calls = Statement_1.ThisCall.Find(methodBody);
        return calls;
    };
    Member.prototype.getMethodNumberOfArguments = function () {
        return this.element["parameters"].length;
    };
    return Member;
}());
exports.Member = Member;
var ClassMember = (function (_super) {
    __extends(ClassMember, _super);
    function ClassMember() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClassMember.prototype.getDecorators = function () {
        var dec = [];
        var decorators = this.element.decorators;
        if (decorators === undefined)
            return dec;
        for (var _i = 0, decorators_1 = decorators; _i < decorators_1.length; _i++) {
            var decorator = decorators_1[_i];
            var d = new Decorator_1.Decorator(decorator, this.filePath);
            dec.push(d);
        }
        return dec;
    };
    ClassMember.prototype.isUsingDecorator = function (decoratorName) {
        var decorators = this.getDecorators();
        if (decorators.length === 0)
            return false;
        for (var _i = 0, decorators_2 = decorators; _i < decorators_2.length; _i++) {
            var decorator = decorators_2[_i];
            if (decoratorName === decorator.name) {
                return true;
            }
        }
        return false;
    };
    ClassMember.prototype.getDecorator = function (decoratorName) {
        var decorators = this.getDecorators();
        for (var _i = 0, decorators_3 = decorators; _i < decorators_3.length; _i++) {
            var decorator = decorators_3[_i];
            if (decoratorName === decorator.name)
                return decorator;
        }
        return undefined;
    };
    return ClassMember;
}(Member));
exports.ClassMember = ClassMember;
var VariableMember = (function (_super) {
    __extends(VariableMember, _super);
    function VariableMember() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return VariableMember;
}(Member));
exports.VariableMember = VariableMember;
var Method = (function (_super) {
    __extends(Method, _super);
    function Method(element, filePath) {
        var _this = _super.call(this, element, filePath) || this;
        _this.element = element;
        return _this;
    }
    Object.defineProperty(Method.prototype, "body", {
        get: function () {
            return this.element.body;
        },
        enumerable: true,
        configurable: true
    });
    Method.isAMethod = function (node) {
        return node.kind === typescript_1.SyntaxKind.MethodDeclaration;
    };
    Method.isStringAMethod = function (method) {
        return (method.includes("(") && method.includes(")"));
    };
    Method.getMethods = function (members) {
        var methods = [];
        for (var _i = 0, members_1 = members; _i < members_1.length; _i++) {
            var member = members_1[_i];
            if (Method.isAMethod(member.element)) {
                methods.push(new Method(member.element, member.filePath));
            }
        }
        return methods;
    };
    Method.FindAll = function (source, node) {
        var n = source;
        if (node)
            n = node;
        var condition = function (node) {
            if (Method.isAMethod(node))
                return new Method(node, source.fileName);
            else
                return undefined;
        };
        return utilities_1.find(n, condition);
    };
    return Method;
}(Member));
exports.Method = Method;
var InterfaceClassMember = (function (_super) {
    __extends(InterfaceClassMember, _super);
    function InterfaceClassMember(symbol, filePath) {
        var _this = _super.call(this, symbol.valueDeclaration, filePath) || this;
        _this.symbol = symbol;
        _this.filePath = filePath;
        return _this;
    }
    Object.defineProperty(InterfaceClassMember.prototype, "name", {
        get: function () {
            return this.symbol.escapedName;
        },
        enumerable: true,
        configurable: true
    });
    InterfaceClassMember.prototype.getSymbolSignature = function (checker, node) {
        if (node === undefined)
            node = this.element;
        return checker.typeToString(checker.getTypeOfSymbolAtLocation(this.symbol, node));
    };
    InterfaceClassMember.FindWhere = function (source, className, checker) {
        return utilities_1.findWhere(source, function (node) {
            if (typescript_1.isClassDeclaration(node)) {
                var cls = new Class_1.Class(node, source.fileName);
                if (cls.name === className)
                    return cls.getInterfaceMembers(checker);
                else
                    return undefined;
            }
            else
                return undefined;
        });
    };
    return InterfaceClassMember;
}(ClassMember));
exports.InterfaceClassMember = InterfaceClassMember;
