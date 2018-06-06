"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
var typescript_mix_1 = require("typescript-mix");
/**
 * Error code one defines a situation where properties are not defined in the mixin.
*/
var MixinOne = /** @class */ (function () {
    function MixinOne(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    MixinOne.prototype.getBio = function () {
        return "I am " + this.firstName + " " + this.lastName;
    };
    return MixinOne;
}());
exports.MixinOne = MixinOne;
var ClientOne = /** @class */ (function () {
    function ClientOne() {
    }
    __decorate([
        typescript_mix_1.use(MixinOne),
        __metadata("design:type", Object)
    ], ClientOne.prototype, "this", void 0);
    return ClientOne;
}());
exports.ClientOne = ClientOne;
var MixinTwo = /** @class */ (function () {
    function MixinTwo(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    Object.defineProperty(MixinTwo.prototype, "fullName", {
        get: function () {
            return this.firstName + this.lastName;
        },
        enumerable: true,
        configurable: true
    });
    return MixinTwo;
}());
exports.MixinTwo = MixinTwo;
var ClientTwo = /** @class */ (function () {
    function ClientTwo() {
    }
    __decorate([
        typescript_mix_1.use(MixinTwo),
        __metadata("design:type", Object)
    ], ClientTwo.prototype, "this", void 0);
    return ClientTwo;
}());
exports.ClientTwo = ClientTwo;
//# sourceMappingURL=error-code-one.mock.js.map