import { CompilerOptions, WatchCompilerHostOfFilesAndCompilerOptions, BuilderProgram, WatchOfFilesAndCompilerOptions } from 'typescript';
import { Diagnostic } from 'ts-parser';
export declare const App: {
    watchProgram: WatchOfFilesAndCompilerOptions<BuilderProgram> | undefined;
    program: BuilderProgram | undefined;
    host: WatchCompilerHostOfFilesAndCompilerOptions<BuilderProgram> | undefined;
    rootFolder: string | undefined;
    rootFiles: string[] | undefined;
    finishedCompiling: boolean;
    compilerOptions: CompilerOptions;
    compileFilesInFolder(rootFolder: string): Promise<Diagnostic[]>;
    watchFilesInFolder(rootFolder: string, doneCompiling?: ((program: BuilderProgram) => void) | undefined): void;
    compileFile(filePath: string): Promise<Diagnostic[]>;
    watchFile(filePath: string, doneCompiling?: ((program: BuilderProgram) => void) | undefined): Promise<void>;
    defaultDoneCompiling(program: BuilderProgram): void;
};
export declare const constants: {
    appName: string;
    moduleName: string;
};
