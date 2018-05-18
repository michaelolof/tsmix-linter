import { ClassDeclaration, Symbol, TypeChecker, SourceFile, Node } from 'typescript';
import { SymbolizedMemberArray, SymbolizedHolder } from './Checker';
import { ClassMember, Method } from './Member';
import { Range } from './utilities';
export declare class Class {
    element: ClassDeclaration;
    filePath: string;
    private __members;
    mixinNames?: string[];
    constructor(element: ClassDeclaration, filePath: string);
    readonly name: string;
    getMembers(): ClassMember[];
    getAllMembers(): void;
    getMembersSymbol(): Map<string, Symbol> | undefined;
    hasMembersUsingDecorator(decoratorName: string): ClassMember[];
    getMemberUsingDecorator(decoratorName: string, memberName: string): ClassMember | undefined;
    isOf(type: any): this is Class;
    hasMemberByNameAndAccessor(name: string, accessor: "static" | "instance"): ClassMember | undefined;
    static IsAClass(node: Node): node is ClassDeclaration;
    static Find(source: SourceFile): Promise<Class[] | undefined>;
}
export interface Class {
    getNameRange(source?: SourceFile): Range;
    getMethods(): Method[];
    getMember(name: string): ClassMember | undefined;
    toSymbolizedHolder(type: "mixin" | "client", checker: TypeChecker): Promise<SymbolizedHolder>;
    getMembersSymbolizedMemberArray(checker: TypeChecker): Promise<SymbolizedMemberArray>;
}
