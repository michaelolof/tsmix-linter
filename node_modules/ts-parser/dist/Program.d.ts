import { SymbolizedHolderArray } from './Checker';
import { Program as tsProgram, TypeChecker } from 'typescript';
export declare class Program {
    rootFiles: ReadonlyArray<string> | undefined;
    private program;
    checker: TypeChecker;
    constructor(program: tsProgram, rootFiles?: ReadonlyArray<string> | undefined);
    getTypes(transform: TransformedUseLintTree): Promise<SymbolizedHolderArray>;
}
export interface UseDecoratorSourceLintTree {
    filePath: string;
    clients: UseDecoratorSourceLintTreeClient[];
}
export interface UseDecoratorSourceLintTreeClient {
    name: string;
    mixins: UseDecoratorSourceLintTreeMixin[];
}
export interface UseDecoratorSourceLintTreeMixin {
    name: string | undefined;
    alias: string | undefined;
    filePath: string;
}
export interface TransformedUseLintTree {
    [filePath: string]: LintableArray;
}
export interface Lintable {
    name: string;
    type: "client" | "mixin";
    mixins?: string[];
}
export declare class LintableArray {
    private hash;
    constructor(...values: Lintable[]);
    push(value: Lintable): void;
    getTypeByName(name: string): string | undefined;
    findByName(name: string): Lintable | undefined;
    hasName(name: string): boolean;
    [Symbol.iterator](): IterableIterator<Lintable>;
}
