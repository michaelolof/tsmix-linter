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
var SymbolizedHolder = (function () {
    function SymbolizedHolder(holderName, holderRange, filePath, type, members, mixins) {
        this.holderName = holderName;
        this.holderRange = holderRange;
        this.filePath = filePath;
        this.type = type;
        this.members = members;
        this.mixins = mixins;
    }
    SymbolizedHolder.prototype.getMemberProperties = function () {
        var propMembers = new SymbolizedMemberArray();
        for (var _i = 0, _a = this.members; _i < _a.length; _i++) {
            var member = _a[_i];
            if (member.type === "property")
                propMembers.push(member);
        }
        return propMembers;
    };
    SymbolizedHolder.prototype.getMemberMethods = function () {
        var methodMembers = new SymbolizedMemberArray();
        for (var _i = 0, _a = this.members; _i < _a.length; _i++) {
            var member = _a[_i];
            if (member.type === "method")
                methodMembers.push(member);
        }
        return methodMembers;
    };
    return SymbolizedHolder;
}());
exports.SymbolizedHolder = SymbolizedHolder;
var SymbolArray = (function () {
    function SymbolArray() {
        var symbol = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            symbol[_i] = arguments[_i];
        }
        this.array = symbol;
    }
    SymbolArray.prototype[Symbol.iterator] = function () {
        var _i, _a, val;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = this.array;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    val = _a[_i];
                    return [4, val];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    };
    SymbolArray.prototype.push = function () {
        var symbol = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            symbol[_i] = arguments[_i];
        }
        (_a = this.array).push.apply(_a, symbol);
        var _a;
    };
    SymbolArray.prototype.forEach = function (calback) {
        this.array.forEach(calback);
    };
    SymbolArray.prototype[Symbol.toStringTag] = function () {
        return __generator(this, function (_a) {
            return [2, this.array.toString()];
        });
    };
    Object.defineProperty(SymbolArray.prototype, "length", {
        get: function () {
            return this.array.length;
        },
        enumerable: true,
        configurable: true
    });
    SymbolArray.prototype.contains = function (member, condition) {
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var m = _a[_i];
            if (condition(m, member))
                return true;
        }
        return false;
    };
    return SymbolArray;
}());
exports.SymbolArray = SymbolArray;
var SymbolizedHolderArray = (function (_super) {
    __extends(SymbolizedHolderArray, _super);
    function SymbolizedHolderArray() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SymbolizedHolderArray.prototype.findClients = function () {
        var clients = new SymbolizedHolderArray();
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var symbol = _a[_i];
            if (symbol.type === "client")
                clients.push(symbol);
        }
        return clients;
    };
    SymbolizedHolderArray.prototype.getSymbolByName = function (name) {
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var symbol = _a[_i];
            if (symbol.holderName === name)
                return symbol;
        }
        return undefined;
    };
    return SymbolizedHolderArray;
}(SymbolArray));
exports.SymbolizedHolderArray = SymbolizedHolderArray;
var SymbolizedMember = (function () {
    function SymbolizedMember(type, memberName, memberRange, signature, accessor, methodThisCalls, methodsNoOfArguments) {
        this.type = type;
        this.memberName = memberName;
        this.memberRange = memberRange;
        this.signature = signature;
        this.accessor = accessor;
        this.methodThisCalls = methodThisCalls;
        this.methodsNoOfArguments = methodsNoOfArguments;
    }
    return SymbolizedMember;
}());
exports.SymbolizedMember = SymbolizedMember;
var SymbolizedMemberArray = (function (_super) {
    __extends(SymbolizedMemberArray, _super);
    function SymbolizedMemberArray() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SymbolizedMemberArray.prototype.doesntHaveMember = function (member) {
        return this.array.filter(function (arrMember) { return arrMember.memberName !== member.memberName && arrMember.signature !== member.signature; });
    };
    SymbolizedMemberArray.prototype.hasThisCallMember = function (thisCall) {
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var m = _a[_i];
            if (m.memberName === thisCall.name) {
                return true;
            }
        }
        return false;
    };
    return SymbolizedMemberArray;
}(SymbolArray));
exports.SymbolizedMemberArray = SymbolizedMemberArray;
