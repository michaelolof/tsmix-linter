"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./UseDecoratorLinter"));
var ts_parser_1 = require("ts-parser");
var MixinStore = /** @class */ (function () {
    function MixinStore() {
    }
    MixinStore.ContainsHolder = function (mixinStore, holderName, holderFilePath) {
        var holderArray = mixinStore[holderFilePath];
        if (holderArray === undefined)
            return undefined;
        var holder = holderArray.getSymbolByName(holderName);
        if (holder === undefined)
            return undefined;
        return holder;
    };
    MixinStore.Push = function (mixinStore, holder) {
        var arr = mixinStore[holder.filePath];
        if (arr === undefined) {
            mixinStore[holder.filePath] = new ts_parser_1.SymbolizedHolderArray(holder);
        }
        else {
            arr.push(holder);
            mixinStore[holder.filePath] = arr;
        }
    };
    return MixinStore;
}());
exports.MixinStore = MixinStore;
//# sourceMappingURL=index.js.map