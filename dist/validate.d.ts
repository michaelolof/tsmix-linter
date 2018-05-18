import { Class, SymbolizedHolderArray, Diagnostic } from 'ts-parser';
import { Program } from 'typescript';
export declare const clients: Class[];
export declare const mixins: SymbolizedHolderArray;
export declare function validateAll(program: Program, interstedFiles: string[]): Promise<Diagnostic[]>;
