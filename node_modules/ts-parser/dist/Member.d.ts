import { Node, MethodDeclaration, SourceFile, Block, TypeChecker, Symbol } from 'typescript';
import { Decorator } from './Decorator';
import { ThisCall } from './Statement';
import { Range } from './utilities';
import { SymbolizedMember } from './Checker';
export declare type MemberType = "method" | "property" | "getter" | "setter";
export declare class Member {
    readonly element: Node;
    readonly filePath: string;
    constructor(memberElement: Node, filePath: string);
    readonly name: string;
    getType(): MemberType;
    isAMethod(): boolean;
    getSymbolSignature(checker: TypeChecker, node?: Node): string;
    getSymbolizedMember(checker: TypeChecker, node?: Node): Promise<SymbolizedMember>;
    getAccessor(): "static" | "instance";
    getNameRange(): Range;
    getMethodBodyThisCalls(): ThisCall[];
    getMethodNumberOfArguments(): number;
}
export declare class ClassMember extends Member {
    getDecorators(): Decorator[];
    isUsingDecorator(decoratorName: string): boolean;
    getDecorator(decoratorName: string): Decorator | undefined;
}
export declare class VariableMember extends Member {
}
export declare class Method extends Member {
    element: MethodDeclaration;
    constructor(element: MethodDeclaration, filePath: string);
    readonly body: Block | undefined;
    static isAMethod(node: Node): boolean;
    static isStringAMethod(method: string): boolean;
    static getMethods(members: Member[]): Method[];
    static FindAll(source: SourceFile, node?: Node): Promise<Method[] | undefined>;
}
export declare class InterfaceClassMember extends ClassMember {
    symbol: Symbol;
    filePath: string;
    constructor(symbol: Symbol, filePath: string);
    readonly name: string;
    getSymbolSignature(checker: TypeChecker, node?: Node): string;
    static FindWhere(source: SourceFile, className: string, checker?: TypeChecker): Promise<InterfaceClassMember[] | undefined>;
}
