import { Identifier, SourceFile } from "typescript";
export declare type ThisCallType = "property" | "method";
export declare type ThisCallAccessor = "instance" | "static";
export declare class ThisCall {
    readonly code: string;
    private bracketStartingIndex;
    private codeWithoutThis;
    constructor(code: string);
    readonly name: string;
    readonly type: ThisCallType;
    readonly codeFormat: string;
    static Find(source: string): ThisCall[];
}
export declare class Argument {
    element: Identifier;
    filePath: string;
    constructor(element: Identifier, filePath: string);
    readonly name: string;
    getNameRange(source?: SourceFile): {
        start: {
            line: number;
            character: number;
        };
        end: {
            line: number;
            character: number;
        };
    };
}
