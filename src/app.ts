import { 
  CompilerOptions, ModuleResolutionKind, ModuleKind, ScriptTarget, createWatchProgram, 
  createWatchCompilerHost, WatchCompilerHostOfFilesAndCompilerOptions, BuilderProgram, 
  sys, WatchOfFilesAndCompilerOptions, createProgram } from 'typescript';
import { findAllTSFiles } from './utilities';
import { validateAll } from '.';
import { Diagnostic } from 'ts-parser';

export const App = {
  watchProgram:undefined as WatchOfFilesAndCompilerOptions<BuilderProgram>|undefined,
  program:undefined as BuilderProgram|undefined,
  host:undefined as WatchCompilerHostOfFilesAndCompilerOptions<BuilderProgram>|undefined,
  rootFolder:undefined as string|undefined,
  rootFiles:undefined as string[] | undefined,
  finishedCompiling:false as boolean,

  compilerOptions: {
    target: ScriptTarget.ESNext,
    module: ModuleKind.CommonJS,
    moduleResolution: ModuleResolutionKind.NodeJs,
    experimentalDecorators: true,
    rootDir: '',
    noEmit: true,
    noEmitOnError: true,
  } as CompilerOptions,

  launchWatcher(rootFolder:string, doneCompiling?:(program:BuilderProgram) => void ) {
    App.rootFolder = rootFolder;
    App.rootFiles = findAllTSFiles( rootFolder );
    App.host = createWatchCompilerHost( App.rootFiles, App.compilerOptions, sys )
    App.host.afterProgramCreate = doneCompiling || this.defaultDoneCompiling
    App.watchProgram = createWatchProgram( App.host );
    App.program = App.watchProgram.getProgram() 
  },

  async launchCompiler(filePath:string):Promise<Diagnostic[]> {
    const program = createProgram( [ filePath ], this.compilerOptions );
    return validateAll( program, [filePath] );
  },

  defaultDoneCompiling( program:BuilderProgram ) {
    App.program = program;
    App.finishedCompiling = true;
  }
}

export const constants = {
  appName: "tsmix-linter",
  moduleName: "typescript-mix"
}


