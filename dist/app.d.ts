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
    launchWatcher(rootFolder: string, doneCompiling?: ((program: BuilderProgram) => void) | undefined): void;
    launchCompiler(filePath: string): Promise<Diagnostic[]>;
    defaultDoneCompiling(program: BuilderProgram): void;
};
export declare const constants: {
    appName: string;
    moduleName: string;
};
