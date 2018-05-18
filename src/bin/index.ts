import { App } from '../app';
import { validateAll } from '..';
import { normalizePath } from '../utilities';
/**
 * This program represents the command line interface for the tsmix-linter library
 * ---------------------------------------------------------------------------------------
 * This library can either be used by
 * 1). node.js tsmix-linter/bin "somefile.ts"
 * 2). node.js tsmix-linter/bin --root "c:/Users/some/path/to/the/root"
 */

parseArguments( process.argv );

function helperLog(additionalInfo = "") {
  return additionalInfo + "Unkown Format: You can lint a file or a set of files by;\n" +
  "---------------------------------------------------------------------\n" +
  "tsmix-linter/bin 'somefile.ts'\n" +
  "or\n" +
  "tsmix-linter/bin --path 'Users/JohnDoe/location/to/root/path'";
}

function parseArguments(args:string[]) {
  const arg2 = args[2];
  if( arg2 === undefined ) {
    return helperLog();
  }
  
  if( arg2 === "--path" ) { 
    const rootPath = args[3];
    if( rootPath === undefined ) return helperLog("Undefined root path");
    else return tryAndLintFileByRootPath( rootPath );
  } 
  else if( arg2.startsWith("--") || arg2.startsWith("-") ) {
    return helperLog();
  } 
  else {
    return tryAndLintFileName( arg2 );
  }

}

function tryAndLintFileName(fileName:string) {
  fileName = normalizePath( fileName )
  App
  .launchCompiler( fileName )
  .then( console.log )
}

function tryAndLintFileByRootPath(rootPath:string) {
  App.launchWatcher( rootPath, program => {
    if( App.rootFiles ) {
      validateAll( program.getProgram(), App.rootFiles ).then( console.log );
    }
  });
}

