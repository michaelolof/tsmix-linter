import { Range } from './utilities';
import { VariableMember, Method } from './Member';
import { VariableDeclaration, Symbol, SourceFile, Node, TypeChecker } from 'typescript';
import { SymbolizedMemberArray, SymbolizedHolder } from './Checker';
export declare class Variable {
    element: VariableDeclaration;
    filePath: string;
    private __members;
    constructor(variable: VariableDeclaration, filePath: string);
    readonly name: string;
    readonly implementsAnInterface: boolean;
    isOf(type: any): this is Variable;
    getNameRange(source?: SourceFile): Range;
    getMembers(): VariableMember[];
    getMember(name: string): VariableMember | undefined;
    getMethods(): Method[];
    getMembersSymbol(): Map<string, Symbol> | undefined;
    toSymbolizedHolder(type: "mixin" | "client", checker: TypeChecker): Promise<SymbolizedHolder>;
    getMembersSymbolizedMemberArray(checker: TypeChecker): Promise<SymbolizedMemberArray>;
    static IsAVariable(node: Node): node is VariableDeclaration;
    static Find(source: SourceFile): Promise<Variable[] | undefined>;
}
