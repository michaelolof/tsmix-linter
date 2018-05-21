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
var ts_parser_1 = require("ts-parser");
var index_1 = require("./index");
var app_1 = require("../app");
var DecoratorLinter = /** @class */ (function () {
    function DecoratorLinter(source, program) {
        this.source = source;
        this.program = program;
        this.checker = this.program.getTypeChecker();
    }
    DecoratorLinter.prototype.validate = function (imports) {
        return __awaiter(this, void 0, void 0, function () {
            //--------------------------------------------------------------------
            function findClassesAndVariables(source) {
                return ts_parser_1.find(source, function (node) {
                    if (ts_parser_1.Class.IsAClass(node))
                        return new ts_parser_1.Class(node, source.fileName);
                    else if (ts_parser_1.Variable.IsAVariable(node))
                        return new ts_parser_1.Variable(node, source.fileName);
                    else
                        return undefined;
                });
            }
            function validateClassUsingUseDecorator(cls) {
                return __awaiter(this, void 0, void 0, function () {
                    var diagnostics, client, mixinArguments, symbolizedMembers, _i, mixinArguments_1, mixinArgument, clientSignature, localMixin, _a, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                diagnostics = [];
                                client = self.isClassAUseDecoratorClient(cls);
                                if (!client)
                                    return [2 /*return*/, diagnostics];
                                mixinArguments = client.arguments;
                                symbolizedMembers = cls.getMembersSymbolizedMemberArray(self.checker);
                                _i = 0, mixinArguments_1 = mixinArguments;
                                _g.label = 1;
                            case 1:
                                if (!(_i < mixinArguments_1.length)) return [3 /*break*/, 6];
                                mixinArgument = mixinArguments_1[_i];
                                clientSignature = {
                                    client: cls,
                                    symbolizedMembers: symbolizedMembers,
                                    mixinArgument: mixinArgument,
                                };
                                localMixin = self.isMixinLocalDeclared(mixinArgument.name, classesAndVariables);
                                if (!localMixin) return [3 /*break*/, 3];
                                _b = (_a = diagnostics.push).apply;
                                _c = [diagnostics];
                                return [4 /*yield*/, validateLocalMixin(clientSignature, localMixin)];
                            case 2:
                                _b.apply(_a, _c.concat([_g.sent()]));
                                return [3 /*break*/, 5];
                            case 3:
                                _e = (_d = diagnostics.push).apply;
                                _f = [diagnostics];
                                return [4 /*yield*/, validateImportedMixin(clientSignature, mixinArgument)];
                            case 4:
                                _e.apply(_d, _f.concat([_g.sent()]));
                                _g.label = 5;
                            case 5:
                                _i++;
                                return [3 /*break*/, 1];
                            case 6: return [2 /*return*/, diagnostics];
                        }
                    });
                });
            }
            function validateClassUsingDelegateDecorator(cls) {
                return __awaiter(this, void 0, void 0, function () {
                    //----------------------------------------------------------------------------------
                    function validateMemberUsingDecorator(args) {
                        var diagnostics = [];
                        for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                            var arg = args_1[_i];
                            var argSymbol = self.checker.getSymbolAtLocation(arg.element);
                            if (argSymbol === undefined)
                                continue;
                            if (argSymbol.declarations === undefined)
                                continue;
                            var declaration = argSymbol.declarations[0];
                            if (declaration.body === undefined)
                                continue;
                            var bodyString = declaration.body.getFullText();
                            var thisCalls = ts_parser_1.ThisCall.Find(bodyString);
                            var clientMembersName = cls.getMembers().map(function (m) { return m.name; });
                            if (thisCalls.length === 0)
                                continue;
                            for (var _a = 0, thisCalls_1 = thisCalls; _a < thisCalls_1.length; _a++) {
                                var thisCall = thisCalls_1[_a];
                                var nameRange = arg.getNameRange();
                                if (self.clientHasTSIgnoreFlag(self.source, nameRange))
                                    continue;
                                if (clientMembersName.indexOf(thisCall.name) < 0) {
                                    var code = thisCall.type === "method" ? "this." + thisCall.name + "(...) method" : "this." + thisCall.name + " property";
                                    var message = "Mixin Dependency Not Found: \n" + code + " not found. \nDelegated method " + arg.name + " calls a " + code + " which is not declared in the client " + cls.name + " class";
                                    diagnostics.push(ts_parser_1.createErrorDiagnostic(app_1.constants.appName, arg.filePath, nameRange, message));
                                }
                            }
                        }
                        return diagnostics;
                    }
                    var diagnostics, membersUsingDecorator, _i, membersUsingDecorator_1, memberUsingDecorator;
                    return __generator(this, function (_a) {
                        diagnostics = [];
                        membersUsingDecorator = self.isClassADelegateDecoratorClient(cls);
                        if (!membersUsingDecorator)
                            return [2 /*return*/, diagnostics];
                        for (_i = 0, membersUsingDecorator_1 = membersUsingDecorator; _i < membersUsingDecorator_1.length; _i++) {
                            memberUsingDecorator = membersUsingDecorator_1[_i];
                            diagnostics.push.apply(diagnostics, validateMemberUsingDecorator(memberUsingDecorator.decorator.getArguments()));
                        }
                        return [2 /*return*/, diagnostics
                            //----------------------------------------------------------------------------------
                        ];
                    });
                });
            }
            function validateLocalMixin(clientSignature, mixin) {
                return __awaiter(this, void 0, void 0, function () {
                    var storedMixin, diagnostics, localMixinHolder, _a, _b, _c, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                storedMixin = index_1.MixinStore.ContainsHolder(mixinStore, mixin.name, mixin.filePath);
                                diagnostics = [];
                                if (!(storedMixin === undefined)) return [3 /*break*/, 3];
                                return [4 /*yield*/, mixin.toSymbolizedHolder("mixin", self.checker)];
                            case 1:
                                localMixinHolder = _g.sent();
                                index_1.MixinStore.Push(mixinStore, localMixinHolder);
                                _b = (_a = diagnostics.push).apply;
                                _c = [diagnostics];
                                return [4 /*yield*/, validateMixin(clientSignature, localMixinHolder)];
                            case 2:
                                _b.apply(_a, _c.concat([_g.sent()]));
                                return [2 /*return*/, diagnostics];
                            case 3:
                                _e = (_d = diagnostics.push).apply;
                                _f = [diagnostics];
                                return [4 /*yield*/, validateMixin(clientSignature, storedMixin)];
                            case 4:
                                _e.apply(_d, _f.concat([_g.sent()]));
                                return [2 /*return*/, diagnostics];
                        }
                    });
                });
            }
            /**
             * Normally this function is meant to retuen Diagnostic[], but it is returning
             * Diagnostic[] | undefined since I don't want to report every possible error.
             * Some errors are best left to typescript to handle.
             */
            function validateImportedMixin(clientSignature, mixinArgument) {
                return __awaiter(this, void 0, void 0, function () {
                    var diagnostics, importedObject, storedMixin, _a, _b, _c, source, message, mixin, importedMixinHolder, _d, _e, _f;
                    return __generator(this, function (_g) {
                        switch (_g.label) {
                            case 0:
                                diagnostics = [];
                                importedObject = ts_parser_1.Import.FindObject(mixinArgument.name, imports);
                                if (importedObject === undefined)
                                    return [2 /*return*/, diagnostics];
                                storedMixin = index_1.MixinStore.ContainsHolder(mixinStore, importedObject.name, importedObject.fromLocation);
                                if (!storedMixin) return [3 /*break*/, 2];
                                _b = (_a = diagnostics.push).apply;
                                _c = [diagnostics];
                                return [4 /*yield*/, validateMixin(clientSignature, storedMixin)];
                            case 1:
                                _b.apply(_a, _c.concat([_g.sent()]));
                                return [2 /*return*/, diagnostics];
                            case 2:
                                source = self.program.getSourceFile(importedObject.fromLocation);
                                // If source file of imported mixin cannot be found.
                                if (source === undefined) {
                                    message = "Mixin not found in " + importedObject.toLocation;
                                    diagnostics.push(ts_parser_1.createErrorDiagnostic(app_1.constants.appName, importedObject.toLocation, mixinArgument.getNameRange(), message));
                                    return [2 /*return*/, diagnostics];
                                }
                                return [4 /*yield*/, ts_parser_1.Mixin.FindWhere(source, function (mixin) { return mixin.name === importedObject.name; })];
                            case 3:
                                mixin = _g.sent();
                                // If mixin canoot be found in the source file
                                if (mixin === undefined)
                                    return [2 /*return*/, diagnostics];
                                return [4 /*yield*/, mixin.toSymbolizedHolder("mixin", self.checker)];
                            case 4:
                                importedMixinHolder = _g.sent();
                                index_1.MixinStore.Push(mixinStore, importedMixinHolder);
                                _e = (_d = diagnostics.push).apply;
                                _f = [diagnostics];
                                return [4 /*yield*/, validateMixin(clientSignature, importedMixinHolder)];
                            case 5:
                                _e.apply(_d, _f.concat([_g.sent()]));
                                return [2 /*return*/, diagnostics];
                        }
                    });
                });
            }
            function validateMixin(clientSignature, mixinHolder) {
                return __awaiter(this, void 0, void 0, function () {
                    // ----------------------------------------------------------------------------------------
                    function checkIfMixinPropertiesAreDeclaredInClient(mixinMember) {
                        var diagnostics = [];
                        var clientHasMixinMember = clientMembers.contains(mixinMember, function (clientMember, mixinMember) { return clientMember.memberName === mixinMember.memberName && clientMember.signature === mixinMember.signature; });
                        if (!clientHasMixinMember) {
                            var nameRange = client.getNameRange();
                            if (self.clientHasTSIgnoreFlag(self.source, nameRange))
                                return diagnostics;
                            var message = "Mixin dependency not found. \n(property) '" + mixinMember.memberName + ":" + mixinMember.signature + "' found in mixin " + mixinHolder.holderName + " is missing in the implementing class '" + client.name + "'.";
                            diagnostics.push(ts_parser_1.createErrorDiagnostic(app_1.constants.appName, client.filePath, nameRange, message));
                        }
                        return diagnostics;
                    }
                    function checkIfMixinIsSelfContained(mixinMember) {
                        var diagnostics = [];
                        var methodThisCalls = mixinMember.methodThisCalls;
                        if (methodThisCalls === undefined)
                            return diagnostics;
                        // If there are this calls in a method's body that are not part of the 
                        // mixin members, then the mixin is not self contained.
                        for (var _i = 0, methodThisCalls_1 = methodThisCalls; _i < methodThisCalls_1.length; _i++) {
                            var methodThisCall = methodThisCalls_1[_i];
                            if (mixinMembers.hasThisCallMember(methodThisCall)) {
                                continue;
                            }
                            else {
                                var nameRange = clientSignature.mixinArgument.getNameRange();
                                if (self.clientHasTSIgnoreFlag(self.source, nameRange))
                                    continue;
                                var message = "Mixin is not self contained. \nMixin method " + mixinHolder.holderName + "." + mixinMember.memberName + "(...) calls " + methodThisCall.codeFormat + " which is not defined in the mixin at " + mixinHolder.filePath + ". \nEnsure mixin is self contained or use another mixin.";
                                diagnostics.push(ts_parser_1.createErrorDiagnostic(app_1.constants.appName, client.filePath, nameRange, message));
                            }
                        }
                        return diagnostics;
                    }
                    var diagnostics, clientMembers, client, mixinMembers, _i, _a, mixinMember, _b, _c, _d, _e;
                    return __generator(this, function (_f) {
                        switch (_f.label) {
                            case 0:
                                diagnostics = [];
                                return [4 /*yield*/, clientSignature.symbolizedMembers];
                            case 1:
                                clientMembers = _f.sent();
                                client = clientSignature.client;
                                mixinMembers = new (ts_parser_1.SymbolizedMemberArray.bind.apply(ts_parser_1.SymbolizedMemberArray, [void 0].concat(mixinHolder.members)))();
                                _i = 0, _a = mixinMembers.array;
                                _f.label = 2;
                            case 2:
                                if (!(_i < _a.length)) return [3 /*break*/, 7];
                                mixinMember = _a[_i];
                                _b = mixinMember.type;
                                switch (_b) {
                                    case "property": return [3 /*break*/, 3];
                                    case "method": return [3 /*break*/, 4];
                                }
                                return [3 /*break*/, 6];
                            case 3:
                                diagnostics.push.apply(diagnostics, checkIfMixinPropertiesAreDeclaredInClient(mixinMember));
                                _f.label = 4;
                            case 4:
                                _d = (_c = diagnostics.push).apply;
                                _e = [/** Check if all method body this calls are defined in the client. */ diagnostics];
                                return [4 /*yield*/, checkIfMixinIsSelfContained(mixinMember)];
                            case 5:
                                _d.apply(_c, _e.concat([_f.sent()]));
                                _f.label = 6;
                            case 6:
                                _i++;
                                return [3 /*break*/, 2];
                            case 7: return [2 /*return*/, diagnostics];
                        }
                    });
                });
            }
            var mixinStore, self, diagnostics, classesAndVariables, _i, classesAndVariables_1, classOrVariable, _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        mixinStore = {};
                        self = this;
                        diagnostics = [];
                        return [4 /*yield*/, findClassesAndVariables(this.source)];
                    case 1:
                        classesAndVariables = _g.sent();
                        if (classesAndVariables === undefined)
                            return [2 /*return*/, diagnostics];
                        _i = 0, classesAndVariables_1 = classesAndVariables;
                        _g.label = 2;
                    case 2:
                        if (!(_i < classesAndVariables_1.length)) return [3 /*break*/, 6];
                        classOrVariable = classesAndVariables_1[_i];
                        if (classOrVariable instanceof ts_parser_1.Variable)
                            return [3 /*break*/, 5];
                        _b = (_a = diagnostics.push).apply;
                        _c = [diagnostics];
                        return [4 /*yield*/, validateClassUsingUseDecorator(classOrVariable)];
                    case 3:
                        _b.apply(_a, _c.concat([_g.sent()]));
                        _e = (_d = diagnostics.push).apply;
                        _f = [diagnostics];
                        return [4 /*yield*/, validateClassUsingDelegateDecorator(classOrVariable)];
                    case 4:
                        _e.apply(_d, _f.concat([_g.sent()]));
                        _g.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, diagnostics];
                }
            });
        });
    };
    DecoratorLinter.prototype.isMixinLocalDeclared = function (mixinName, classesOrVariables) {
        for (var _i = 0, classesOrVariables_1 = classesOrVariables; _i < classesOrVariables_1.length; _i++) {
            var classOrVariable = classesOrVariables_1[_i];
            if (classOrVariable.name === mixinName)
                return classOrVariable;
        }
        return undefined;
    };
    DecoratorLinter.prototype.isClassAUseDecoratorClient = function (cls) {
        var memberUsingDecorator = cls.getMemberUsingDecorator(DecoratorLinter.UseDecoratorId, "this");
        if (memberUsingDecorator === undefined)
            return false;
        var decorator = memberUsingDecorator.getDecorator(DecoratorLinter.UseDecoratorId);
        if (decorator === undefined)
            return false;
        return { arguments: decorator.getArguments() };
    };
    DecoratorLinter.prototype.isClassADelegateDecoratorClient = function (cls) {
        var membersUsingDecorator = cls.hasMembersUsingDecorator(DecoratorLinter.DelegateDecoratorId);
        if (membersUsingDecorator.length === 0)
            return false;
        var memberToDecorator = membersUsingDecorator.map(function (member) {
            return {
                memberName: member.name,
                decorator: member.getDecorator(DecoratorLinter.DelegateDecoratorId)
            };
        });
        return memberToDecorator;
    };
    DecoratorLinter.prototype.clientHasTSIgnoreFlag = function (clientSource, clientRange) {
        var lineContent = clientSource.getFullText().split("\n")[clientRange.start.line - 1];
        if (lineContent === undefined)
            return false;
        if (lineContent.includes("//") && lineContent.includes("@ts-ignore"))
            return true;
        else
            return false;
    };
    DecoratorLinter.UseDecoratorId = "use";
    DecoratorLinter.DelegateDecoratorId = "delegate";
    return DecoratorLinter;
}());
exports.DecoratorLinter = DecoratorLinter;
//# sourceMappingURL=UseDecoratorLinter.js.map