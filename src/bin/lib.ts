import { App } from '../app';
import { validateAll } from '..';
import { normalizePath } from '../utilities';
import { Diagnostic, UseDecoratorSourceLintTree } from 'ts-parser';
/**
 * This program represents the command line interface for the tsmix-linter library
 * ---------------------------------------------------------------------------------------
 * This library can either be used by
 * 1). node.js tsmix-linter/bin "somefile.ts"
 * 2). node.js tsmix-linter/bin --root "c:/Users/some/path/to/the/root"
 */
const version = "Version 1.0.2";


type LogOptions = "diagnostic" | "minimal" | "normal"

interface LintOptions {
  method: "watch" | "compile",
  target: "folder" | "file",
  logger: (diagnostic:Diagnostic) => void,
}

enum DefaultFlags {
  Help = "--help",
  Version = "--version",
  Watch = "--watch",
  Log = "--log"
}

enum OptionalFlags {
  Help = "-h",
  Version = "-v",
  Watch = "-w",
  Log = "-l"
}

export function runCLI(args:string[]) {
  const parsed = parseArguments(args);
  if( parsed instanceof Logger ) {
    console.log( parsed.message );
    return
  }

  // If we're compiling a file.
  if( parsed.lintOptions.target === "file" && parsed.lintOptions.method === "compile" ) {
    App
    .compileFile( parsed.path )
    .then( diagnostics => diagnostics.map( parsed.lintOptions.logger ) )
    return;
  }

  // If we are watching a file.
  if( parsed.lintOptions.target === "file" && parsed.lintOptions.method === "watch" ) {
    App.watchFile( parsed.path, builderProgram => {
      if( App.rootFiles ) {
        validateAll( builderProgram.getProgram(), App.rootFiles )
        .then( diagnostics => diagnostics.map( parsed.lintOptions.logger ) )
        return 
      } 
      return helperLog("Nothing to lint.\nCouldn't find .ts files in the specified folder.")
    });
    return
  }

  // If we are compiling all files in a folder.
  if( parsed.lintOptions.target === "folder" && parsed.lintOptions.method === "compile" ) {
    App
    .compileFilesInFolder( parsed.path )
    .then( diagnostics => diagnostics.map( parsed.lintOptions.logger ) );
    return;
  }

  // If we are watching all files in a folder.
  if( parsed.lintOptions.target === "folder" && parsed.lintOptions.method === "watch" ) {
    App.watchFilesInFolder( parsed.path, builderProgram => {
      if( App.rootFiles ) {
        validateAll( builderProgram.getProgram(), App.rootFiles )
        .then( diagnostics => diagnostics.map( parsed.lintOptions.logger ) );
        return;
      }
      return helperLog("Nothing to lint.\nCouldn't find .ts files in the specified folder.")            
    });
    return;
  }

  return helperLog().message;
}


function parseArguments(args:string[]):Lintable | Logger {
  const itHasHelpFlag = argumentHasFlag(args, DefaultFlags.Help, OptionalFlags.Help );
  if( itHasHelpFlag ) {
    removeFlagFromArgument( args, itHasHelpFlag.index )
    return helperLog();
  }

  const itHasVersionFlag = argumentHasFlag(args, DefaultFlags.Version, OptionalFlags.Version );
  if( itHasVersionFlag ) {
    removeFlagFromArgument( args, itHasVersionFlag.index );
    return new Logger(version);
  }

  const itHasWatchFlag = argumentHasFlag(args, DefaultFlags.Watch, OptionalFlags.Watch );
  if( itHasWatchFlag ) {
    removeFlagFromArgument( args, itHasWatchFlag.index );
  }

  const itHasLogFlag = argumentHasFlag(args, DefaultFlags.Log, OptionalFlags.Log );
  let logger = minimalLogger;
  if( itHasLogFlag ) {
    let _logValue = args[ itHasLogFlag.index + 1 ] as string | undefined;
    removeFlagFromArgument( args, itHasLogFlag.index );
    if( _logValue === undefined ) { 
      _logValue = "minimal"
    } else args.splice( itHasLogFlag.index + 1, 1 );
    logger = validateLog( _logValue )
  }

  // This means we are linting a file.
  const remainingArgument = args[0] as string | undefined;
  const method = itHasWatchFlag ? "watch" : "compile"
  if( remainingArgument ) return new Lintable( remainingArgument, { method, target:"file", logger })
  else return new Lintable( process.cwd(), {method, target:"folder", logger }) 
  //--------------------------------------------------------------------------------
}

function validateLog(log:string):(diagnostic:Diagnostic) => void {
  switch( log as LogOptions ) {
    case "diagnostic": return diagnosticLogger
    case "normal": return normalLogger
    default: return minimalLogger
  }
}

function argumentHasFlag(argument:string[], defaultFlag:DefaultFlags, optionalFlag: OptionalFlags):{foundFlag:string, index:number} | undefined {
  const firstIndex = argument.indexOf( defaultFlag );
  const secondIndex = argument.indexOf( optionalFlag );
  if( firstIndex > -1 ) return { foundFlag: defaultFlag, index: firstIndex };
  else if( secondIndex > -1 ) return { foundFlag: optionalFlag, index: secondIndex };
  else return undefined;
}

function removeFlagFromArgument(argument:string[], flagLocationIndex:number) {
  argument.splice( flagLocationIndex, 1 )
}

function logMatcher( diagnostic:Diagnostic, log:LogOptions) {
  switch( log ) {
    case "diagnostic":
      diagnosticLogger( diagnostic );
      break;
    case "normal":
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

function helperLog(additionalInfo = "") {
  if( additionalInfo ) {
    additionalInfo = additionalInfo + "\n" + "------------------------------"
  }
  return new Logger( additionalInfo + defaultMessage );
}

class Logger { constructor(public message:string) {} }

class Lintable{ constructor(public path:string, public lintOptions:LintOptions){} }







const defaultMessage = `Version: ${version}

Example: 
  tsmix-linter "hello.ts" (to lint a file)
  tsmix-linter --root "location/to/root/" (to lint all .ts files in the root folder)
           
Options:
  --help, -h       To print this message.
  --version, -v    Prints out the version number
  --watch, -w      Specify if linting is done in watch mode.
  --log, -l        Specify how errors are logged. Either "minimal", "normal" or "diagnostic". 
                   defaults to "minimal"`;
