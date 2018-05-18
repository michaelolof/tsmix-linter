import { SourceFile, TypeChecker, Program } from 'typescript';
import { Import, Diagnostic } from "ts-parser";
export declare class DecoratorLinter {
    private source;
    private program;
    static UseDecoratorId: string;
    static DelegateDecoratorId: string;
    checker: TypeChecker;
    constructor(source: SourceFile, program: Program);
    validate(imports: Import[]): Promise<Diagnostic[]>;
    private isMixinLocalDeclared(mixinName, classesOrVariables);
    private isClassAUseDecoratorClient(cls);
    private isClassADelegateDecoratorClient(cls);
}
