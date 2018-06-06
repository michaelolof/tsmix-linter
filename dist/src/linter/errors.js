"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["One"] = "tsmix:01";
    ErrorCode["Two"] = "tsmix:02";
    ErrorCode["Three"] = "tsmix:03";
    ErrorCode["Four"] = "tsmix:04";
    ErrorCode["Five"] = "tsmix:05";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
exports.ErrorCodeMap = (_a = {},
    _a[ErrorCode.One] = "Client has undefined variables defined in the mixin",
    _a[ErrorCode.Two] = "Mixin does not implement an interface",
    _a[ErrorCode.Three] = "Mixin does not correctly implement an interface. Mixin is not self contained.",
    _a[ErrorCode.Four] = "Delegated method's type do not match.",
    _a[ErrorCode.Five] = "Mixin not found in declared file.",
    _a);
var _a;
//# sourceMappingURL=errors.js.map