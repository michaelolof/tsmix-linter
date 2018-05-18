"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Class_1 = require("./Class");
var _1 = require(".");
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
function findClass(source) {
    return find(source, function (node) {
        if (_1.issa._class(node))
            return new Class_1.Class(node, source.fileName);
        else
            return undefined;
    });
}
exports.findClass = findClass;
//# sourceMappingURL=finder.js.map