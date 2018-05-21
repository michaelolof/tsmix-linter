import { App } from '../app';
import { validateAll } from '..';
import { normalizePath } from '../utilities';
import { Diagnostic } from 'ts-parser';
/**
 * This program represents the command line interface for the tsmix-linter library
 * ---------------------------------------------------------------------------------------
 * This library can either be used by
 * 1). node.js tsmix-linter/bin "somefile.ts"
 * 2). node.js tsmix-linter/bin --root "c:/Users/some/path/to/the/root"
 */

parseArguments( process.argv.slice(2) );

let lintMethod:"by-file"|"by-path"|undefined;


type LogParam = "diagnostic" | "minimal" | "normal"

interface ParamtersToValue {
  "--root":string | undefined
  "--log": LogParam
}


const options:ParamtersToValue = {
  "--root": undefined,
  "--log": "minimal",
}

function parseArguments(args:string[]) {
  const rootLoc  = args.indexOf( "--root" );
  const logLoc = args.indexOf( "--log" );
  const filePath:string|undefined = args[ 0 ];
  let rootValue:string | undefined = undefined
  let logValue:LogParam = "minimal";
  
  if( rootLoc > -1 ) rootValue = args[ rootLoc + 1 ]

  if( logLoc > -1 ) logValue = validateLog( args[ logLoc + 1 ] );

  if( rootValue === undefined && filePath ) {
    return lintFile( filePath, logValue )
  }

  if( rootValue ) {
    return lintFileByRootPath( rootValue, logValue )
  }

  console.log( helperLog() );
  return 
  // if( rootValue )


  function validateLog(log:string):LogParam {
    if( log === "diagnostic" || log === "normal" || log === "minimal" ) return log;
    else return "minimal"
  }

}


// function parseArguments(args:string[]) {
//   const arg2 = args[2];
//   if( arg2 === undefined ) {
//     return helperLog();
//   }
  
//   if( arg2 === "--path" ) { 
//     const rootPath = args[3];
//     if( rootPath === undefined ) return helperLog("Undefined root path");
//     else return tryAndLintFileByRootPath( rootPath );
//   } 
//   else if( arg2.startsWith("--") || arg2.startsWith("-") ) {
//     return helperLog();
//   } 
//   else {
//     return lintFile( arg2 );
//   }

// }

function helperLog(additionalInfo = "") {
  return additionalInfo + "Unkown Format: You can lint a file or a set of files by;\n" +
  "---------------------------------------------------------------------\n" +
  "tsmix-linter/bin 'somefile.ts'\n" +
  "or\n" +
  "tsmix-linter/bin --path 'Users/JohnDoe/location/to/root/path'";
}


function lintFile(fileName:string, log:LogParam) {
  fileName = normalizePath( fileName )
  App
  .launchCompiler( fileName )
  .then( diagnostics => diagnostics.map( diagnostic => logMatcher(  diagnostic, log ) ) );  
}

function lintFileByRootPath(rootPath:string, log:LogParam) {
  App.launchWatcher( rootPath, program => {
    if( App.rootFiles ) {
      validateAll( program.getProgram(), App.rootFiles )
      .then( diagnostics => diagnostics.map( diagnostic => logMatcher(  diagnostic, log ) ) );  
    }
  });
}

function logMatcher( diagnostic:Diagnostic, log:LogParam) {
  switch( log ) {
    case "diagnostic":
      diagnosticLogger( diagnostic );
      break;
    case "normal":
      console.log("normal logger")
      normalLogger( diagnostic );
      break
    case "minimal":
      minimalLogger( diagnostic );
      break;
  }
}

function normalLogger(diagnostic:Diagnostic) {
  console.warn( `error:(${diagnostic.range.start.line + 1},${diagnostic.range.start.character})`, diagnostic.message.replace("\n", ""), "on", diagnostic.filePath ) 
  console.log("\n");  
}

function diagnosticLogger(diagnostic: Diagnostic) {
  console.warn( diagnostic );
  console.log("\n");
}

function minimalLogger(diagnostic:Diagnostic) {
  const rel = diagnostic.filePath.replace( process.cwd().replace("\\", "/"), "" );
  console.warn(`error: (${diagnostic.range.start.line + 1},${diagnostic.range.start.character}). ${diagnostic.message.split("\n")[0]} on ${rel}` );
  console.log("\n");
}

