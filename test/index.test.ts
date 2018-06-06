import { App } from '../src/app';
import { validateAll } from '../src';
import { Diagnostic } from '../src/linter/index';


export const mockDiagnostics = launchMockTest("compile");
export const fileToIdToDiagnostics = filterByFileThenId( mockDiagnostics );

function launchMockTest(launcher:"watch"|"compile") {
  const mockPath = "C:/Users/Michael/Desktop/M.O.O/Programs/custom-npm-modules/tsmix-linter/test/mock";
  
  return new Promise<Diagnostic[]>( (resolve, reject) => {
    switch( launcher ) {
      case "watch":
        App.watchFilesInFolder( mockPath, builderProgram => {
          const program = builderProgram.getProgram();
          if( App.rootFiles ) {
            resolve( validateAll( program, App.rootFiles ) )
          }
          else reject("Couldn't find an files in root folder.")
        });
      case "compile":
        resolve( App.compileFilesInFolder( mockPath ) );
      }
    });
}

async function filterByFileThenId(diagnostics:Promise<Diagnostic[]>) {
  const map:FileToIdToDiagnosticsMap = {};
  (await diagnostics).map( diagnostic => {
    const prev = map[ diagnostic.filePath ] || {}
    pushNewIdToDiagnosticsMap( prev, diagnostic );
    map[ diagnostic.filePath ] = prev
  })
  return map;

  function pushNewIdToDiagnosticsMap( map:IdToDiagnosticsMap, diagnostic:Diagnostic ) {
    const prev = map[ diagnostic.id! ] || []
    prev.push( diagnostic )
    map[ diagnostic.id! ] = prev;
    return map;
  }

}

export interface FileToIdToDiagnosticsMap {
  [filePath:string]: IdToDiagnosticsMap
}

export interface IdToDiagnosticsMap {
  [id:string]:Diagnostic[]
}