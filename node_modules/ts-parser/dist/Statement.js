"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var utilities_1 = require("./utilities");
var ThisCall = (function () {
    function ThisCall(code) {
        this.code = code;
    }
    Object.defineProperty(ThisCall.prototype, "name", {
        get: function () {
            this.codeWithoutThis = this.code.substr(5);
            if (this.type === "method") {
                this.bracketStartingIndex = this.codeWithoutThis.indexOf("(");
                var methodName = this.codeWithoutThis.substring(0, this.bracketStartingIndex);
                return methodName.trim();
            }
            else
                return this.codeWithoutThis.trim();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThisCall.prototype, "type", {
        get: function () {
            if (_1.Method.isStringAMethod(this.code))
                return "method";
            else
                return "property";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ThisCall.prototype, "codeFormat", {
        get: function () {
            if (this.type === "property")
                return this.code;
            else
                return "this." + this.name + "(...)";
        },
        enumerable: true,
        configurable: true
    });
    ThisCall.Find = function (source) {
        var rgx = {
            instanceMember: /this(\s)?\.(?!.*constructor)[\w]+/g,
            staticMember: /this(\s)?\.constructor(\s)?\.[\w]+/g
        };
        var calls = [];
        var instancePropertiesAndMethods = Array.from(new Set(source.match(rgx.instanceMember) || []));
        var staticPropertiesAndMethods = Array.from(new Set(source.match(rgx.staticMember) || []));
        if (instancePropertiesAndMethods) {
            for (var _i = 0, instancePropertiesAndMethods_1 = instancePropertiesAndMethods; _i < instancePropertiesAndMethods_1.length; _i++) {
                var prop = instancePropertiesAndMethods_1[_i];
                calls.push(new ThisCall(prop));
            }
        }
        if (staticPropertiesAndMethods) {
            for (var _a = 0, staticPropertiesAndMethods_1 = staticPropertiesAndMethods; _a < staticPropertiesAndMethods_1.length; _a++) {
                var prop = staticPropertiesAndMethods_1[_a];
                calls.push(new ThisCall(prop));
            }
        }
        return calls;
    };
    return ThisCall;
}());
exports.ThisCall = ThisCall;
var Argument = (function () {
    function Argument(element, filePath) {
        this.element = element;
        this.filePath = filePath;
    }
    Object.defineProperty(Argument.prototype, "name", {
        get: function () {
            return (this.element.escapedText || this.element["name"].escapedText);
        },
        enumerable: true,
        configurable: true
    });
    Argument.prototype.getNameRange = function (source) {
        return utilities_1.getInlineRangeFromPosition(this.element, source);
    };
    return Argument;
}());
exports.Argument = Argument;
//# sourceMappingURL=Statement.js.map