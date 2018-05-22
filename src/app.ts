import { 
  CompilerOptions, ModuleResolutionKind, ModuleKind, ScriptTarget, createWatchProgram, 
  createWatchCompilerHost, WatchCompilerHostOfFilesAndCompilerOptions, BuilderProgram, 
  sys, WatchOfFilesAndCompilerOptions, createProgram, } from 'typescript';
import { findAllTSFiles } from './utilities';
import { validateAll } from '.';
import { Diagnostic } from 'ts-parser';

const $watcher = Symbol("watcher");
const $compiler = Symbol("compiler");

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

  compileFilesInFolder(rootFolder:string):Promise<Diagnostic[]> {
    return app.compile( findAllTSFiles( rootFolder ) )
  },

  watchFilesInFolder(rootFolder:string, doneCompiling?:(program:BuilderProgram) => void ) {
    App.rootFolder = rootFolder;
    app.watch( findAllTSFiles( App.rootFolder ), doneCompiling )
  },

  async compileFile(filePath:string):Promise<Diagnostic[]> {
    return app.compile( [ filePath ] );
  },

  async watchFile(filePath:string, doneCompiling?:(program:BuilderProgram) => void ) {
    app.watch( [ filePath ], doneCompiling )
  },

  defaultDoneCompiling( program:BuilderProgram ) {
    App.program = program;
    App.finishedCompiling = true;
  },
}



export const constants = {
  appName: "tsmix-linter",
  moduleName: "typescript-mix"
}


const app = {
  compile(filePaths:string[]):Promise<Diagnostic[]> {
    return validateAll( createProgram( filePaths, App.compilerOptions ), filePaths );
  },

  watch(filePaths:string[], doneCompiling?:(program:BuilderProgram) => void ) {
    App.rootFiles = filePaths;
    App.host = createWatchCompilerHost( filePaths, App.compilerOptions, sys )
    App.host.afterProgramCreate = doneCompiling || App.defaultDoneCompiling
    App.watchProgram = createWatchProgram( App.host );
    App.program = App.watchProgram.getProgram() 
  },
}